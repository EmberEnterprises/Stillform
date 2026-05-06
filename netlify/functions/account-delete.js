import { sbAdminFetch } from "./_subscriptionState.js";
import {
  jsonResponse,
  parseBearer,
  getUserFromToken,
  rejectDisallowedOrigin
} from "./_httpSecurity.js";

const CORS_OPTIONS = { methods: "POST, OPTIONS" };

// Server-side account deletion. Required by Apple App Store Review Guideline
// 5.1.1(v) — apps that allow account creation must allow users to initiate
// account deletion from within the app.
//
// What this function does:
//   1. Authenticates the request via the user's bearer token
//   2. Deletes the user's row from stillform_subscription_state (all identity
//      keys — user:, install:, customer:, subscription: rows tied to this user)
//   3. Calls Supabase Auth Admin API to delete the auth.users row
//   4. Returns success — client then handles local cleanup (sbDeleteCloudData
//      already handles user_data and backups tables, runs before this call)
//
// What this function does NOT do (intentional):
//   - Does NOT cancel Lemon Squeezy subscriptions. The client warns the user
//     about active subscriptions and provides the customer portal link before
//     calling this. Programmatic cancellation would require write-scope on the
//     Lemon Squeezy API key and is more error-prone than letting the user
//     manage their own billing through the portal we already shipped.
//   - Does NOT delete user_data / backups rows. Client calls sbDeleteCloudData()
//     before invoking this function, which handles those tables with the user's
//     own access token (cleaner than admin-API deletion since the user has
//     direct DELETE rights on their own rows via RLS).

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") return jsonResponse(event, 200, { ok: true }, CORS_OPTIONS);
  if (event.httpMethod !== "POST") return jsonResponse(event, 405, { error: "Method not allowed" }, CORS_OPTIONS);

  const originBlocked = rejectDisallowedOrigin(event, CORS_OPTIONS);
  if (originBlocked) return originBlocked;

  try {
    const token = parseBearer(event.headers?.authorization || event.headers?.Authorization || "");
    const user = await getUserFromToken(token);
    const userId = user?.id || null;
    if (!userId) return jsonResponse(event, 401, { error: "Unauthorized" }, CORS_OPTIONS);

    const errors = [];

    // 1. Delete subscription state rows — there may be multiple per user
    //    keyed by user:, install:, customer:, subscription:. Best-effort —
    //    if some rows don't have user_id populated (the architectural issue
    //    captured in master todo as 'Subscription state architecture rewrite')
    //    they may not delete cleanly. Logged but not fatal.
    try {
      await sbAdminFetch(
        `/rest/v1/stillform_subscription_state?user_id=eq.${encodeURIComponent(userId)}`,
        { method: "DELETE", headers: { Prefer: "return=minimal" } }
      );
    } catch (e) {
      errors.push(`subscription_state:${e?.message || "delete_failed"}`);
    }

    // 2. Delete the auth.users row — this is the critical step that makes
    //    this real account deletion vs. just data wipe. Without this step,
    //    Apple rejects the app on review (App Store Review Guideline 5.1.1(v)).
    try {
      await sbAdminFetch(
        `/auth/v1/admin/users/${encodeURIComponent(userId)}`,
        { method: "DELETE" }
      );
    } catch (e) {
      // Auth deletion failure IS fatal — without it, the account isn't
      // actually deleted. Return error so client can show real message
      // instead of pretending success.
      console.error("account-delete-auth-failed", { userId, message: e?.message });
      return jsonResponse(event, 500, {
        error: "Account deletion failed. Your data has been removed but the account record could not be deleted. Please contact araembersllc@proton.me.",
        partial: true,
        errors: [...errors, `auth:${e?.message || "delete_failed"}`]
      }, CORS_OPTIONS);
    }

    return jsonResponse(event, 200, {
      ok: true,
      errors: errors.length ? errors : undefined
    }, CORS_OPTIONS);
  } catch (error) {
    console.error("account-delete-failed", { message: error?.message || "unknown" });
    return jsonResponse(event, 500, { error: "Account deletion failed" }, CORS_OPTIONS);
  }
}
