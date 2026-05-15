import React from "react";
import EditorialBlock from "../../components/EditorialBlock.jsx";
import Button from "../../components/Button.jsx";
import MonoLabel from "../../components/MonoLabel.jsx";

/**
 * Close — the closing step of the spine.
 *
 * Per STILLFORM_CANON.md §7: "Close — takeaway, optional save, library
 * updated, session ends with closing language."
 *
 * Per canon §6 (rumination guard): "Build closing rituals — sessions END."
 * The Close surface is a deliberate termination — not a "thanks for
 * sharing" empty close, and not a "want to journal more?" open-ended
 * prolongation. The takeaway names what was built; the user returns home.
 *
 * Phase 2 scope: displays the final AI reframe as the takeaway, plus a
 * quiet note that the session is closed. Session persistence (writing to
 * stillform_sessions / library / artifact history) ships in Phase 2.5
 * once the v1 data shape integration is verified end-to-end.
 *
 * @param {string|null} takeaway — the final AI reframe text
 * @param {function(): void} onReturnHome
 */
export default function Close({ takeaway, onReturnHome }) {
  return (
    <main className="sf-page sf-page--hero">
      <div className="sf-fade-enter">
        <EditorialBlock
          label="Close"
          headline="Session ends here."
          headlineSize="lg"
          body="The work compounds. What you named is now part of your library."
          labelInfoTitle="Close"
          labelInfoBody="Closing the rep matters. The brain encodes what you ended on, not what you spent most time on. A clean close cements what was built and prevents the work from looping into rumination. Stickgold & Walker on consolidation windows; Wells 2009 on rumination guardrails."
        />
      </div>

      {takeaway ? (
        <div
          className="sf-fade-enter sf-fade-enter--delay-1"
          style={{ marginTop: "var(--sf-space-64)" }}
        >
          <MonoLabel size="xs" style={{ display: "block", marginBottom: "var(--sf-space-16)" }}>
            What landed
          </MonoLabel>
          <p
            style={{
              margin: 0,
              color: "var(--sf-text-cream)",
              fontFamily: "var(--sf-font-serif)",
              fontSize: "20px",
              lineHeight: 1.5,
              fontWeight: 400,
              whiteSpace: "pre-wrap",
            }}
          >
            {takeaway}
          </p>
        </div>
      ) : null}

      <div
        className="sf-fade-enter sf-fade-enter--delay-2"
        style={{ marginTop: "var(--sf-space-64)" }}
      >
        <Button variant="primary" onClick={onReturnHome}>
          Return home
        </Button>
      </div>
    </main>
  );
}
