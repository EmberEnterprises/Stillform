const SUPABASE_URL = process.env.SUPABASE_URL || "https://pxrewildfnbxlygjofpx.supabase.co";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "";

const DEFAULT_ALLOWED_ORIGINS = [
  "https://stillformapp.com",
  "https://www.stillformapp.com",
  "https://stillformapp.netlify.app",
  "http://localhost:4173",
  "http://localhost:5173",
  "http://127.0.0.1:4173",
  "http://127.0.0.1:5173",
  "capacitor://localhost",
  "ionic://localhost"
];

const parseOriginList = () => {
  const raw = process.env.SECURITY_ALLOWED_ORIGINS || process.env.ALLOWED_ORIGINS || "";
  const envOrigins = raw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  return [...new Set([...DEFAULT_ALLOWED_ORIGINS, ...envOrigins])];
};

const ALLOWED_ORIGINS = parseOriginList();

export const getRequestOrigin = (event) =>
  event?.headers?.origin || event?.headers?.Origin || null;

export const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  if (/^https?:\/\/localhost:\d+$/i.test(origin)) return true;
  if (/^https?:\/\/127\.0\.0\.1:\d+$/i.test(origin)) return true;
  return false;
};

export const createCorsHeaders = (
  event,
  {
    methods = "GET, POST, OPTIONS",
    headers = "Content-Type, Authorization"
  } = {}
) => {
  const origin = getRequestOrigin(event);
  const responseHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Headers": headers,
    "Access-Control-Allow-Methods": methods,
    Vary: "Origin"
  };
  if (origin && isAllowedOrigin(origin)) {
    responseHeaders["Access-Control-Allow-Origin"] = origin;
  } else if (!origin) {
    // Non-browser requests (curl/webhooks) won't use CORS headers but we keep a stable value.
    responseHeaders["Access-Control-Allow-Origin"] = "https://stillformapp.com";
  }
  return responseHeaders;
};

export const rejectDisallowedOrigin = (event, corsOptions = {}) => {
  const origin = getRequestOrigin(event);
  if (origin && !isAllowedOrigin(origin)) {
    return {
      statusCode: 403,
      headers: createCorsHeaders(event, corsOptions),
      body: JSON.stringify({ error: "Origin not allowed" })
    };
  }
  return null;
};

export const jsonResponse = (event, statusCode, body, corsOptions = {}) => ({
  statusCode,
  headers: createCorsHeaders(event, corsOptions),
  body: JSON.stringify(body)
});

export const parseBearer = (authHeader) => {
  if (!authHeader || typeof authHeader !== "string") return null;
  const [type, token] = authHeader.trim().split(/\s+/);
  if (!type || !token || type.toLowerCase() !== "bearer") return null;
  return token;
};

export const getUserFromToken = async (accessToken) => {
  if (!accessToken || !SUPABASE_ANON_KEY) return null;
  const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    method: "GET",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${accessToken}`
    }
  });
  if (!res.ok) return null;
  return res.json().catch(() => null);
};
