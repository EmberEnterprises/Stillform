#!/usr/bin/env python3
"""
Generate Stillform Strategic Overview PowerPoint (.pptx).

This script builds a clean, presentation-ready deck from the current
science-first strategic framing.
"""

from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN
from pptx.util import Inches, Pt


BG = RGBColor(14, 15, 17)
SURFACE = RGBColor(23, 25, 29)
AMBER = RGBColor(201, 147, 58)
TEXT = RGBColor(233, 233, 234)
TEXT_DIM = RGBColor(160, 162, 168)

TITLE_FONT = "Cormorant Garamond"
BODY_FONT = "DM Sans"
MONO_FONT = "IBM Plex Mono"


def set_background(slide):
    fill = slide.background.fill
    fill.solid()
    fill.fore_color.rgb = BG


def add_header(slide, kicker="STILLFORM · STRATEGIC DECK"):
    box = slide.shapes.add_textbox(Inches(0.7), Inches(0.35), Inches(6.2), Inches(0.35))
    p = box.text_frame.paragraphs[0]
    run = p.add_run()
    run.text = kicker
    run.font.name = MONO_FONT
    run.font.size = Pt(11)
    run.font.color.rgb = AMBER

    line = slide.shapes.add_shape(
        MSO_SHAPE.RECTANGLE, Inches(0.7), Inches(0.7), Inches(12.0), Inches(0.01)
    )
    line.fill.solid()
    line.fill.fore_color.rgb = RGBColor(50, 52, 58)
    line.line.fill.background()


def add_title(slide, title, subtitle=None):
    t = slide.shapes.add_textbox(Inches(0.7), Inches(0.95), Inches(11.8), Inches(1.2))
    tf = t.text_frame
    p = tf.paragraphs[0]
    run = p.add_run()
    run.text = title
    run.font.name = TITLE_FONT
    run.font.size = Pt(38)
    run.font.color.rgb = AMBER

    if subtitle:
        s = slide.shapes.add_textbox(Inches(0.72), Inches(1.9), Inches(11.3), Inches(0.55))
        p2 = s.text_frame.paragraphs[0]
        r2 = p2.add_run()
        r2.text = subtitle
        r2.font.name = BODY_FONT
        r2.font.size = Pt(16)
        r2.font.color.rgb = TEXT_DIM


def add_bullets(slide, x, y, w, h, bullets, size=20):
    box = slide.shapes.add_textbox(x, y, w, h)
    tf = box.text_frame
    tf.word_wrap = True
    tf.clear()
    for i, b in enumerate(bullets):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.text = b
        p.level = 0
        p.font.name = BODY_FONT
        p.font.size = Pt(size)
        p.font.color.rgb = TEXT
        p.space_after = Pt(10)


def add_section_label(slide, text, x=0.7, y=2.5):
    box = slide.shapes.add_textbox(Inches(x), Inches(y), Inches(4.5), Inches(0.35))
    p = box.text_frame.paragraphs[0]
    run = p.add_run()
    run.text = text
    run.font.name = MONO_FONT
    run.font.size = Pt(11)
    run.font.color.rgb = AMBER


def add_table_like(slide, x, y, w, h, rows, col_widths):
    table_shape = slide.shapes.add_table(len(rows), len(rows[0]), x, y, w, h)
    table = table_shape.table
    for i, cw in enumerate(col_widths):
        table.columns[i].width = cw

    for r_idx, row in enumerate(rows):
        for c_idx, value in enumerate(row):
            cell = table.cell(r_idx, c_idx)
            cell.text = value
            cell.fill.solid()
            cell.fill.fore_color.rgb = SURFACE if r_idx == 0 else BG
            for p in cell.text_frame.paragraphs:
                for run in p.runs:
                    run.font.name = BODY_FONT
                    run.font.size = Pt(12 if r_idx == 0 else 11)
                    run.font.color.rgb = AMBER if r_idx == 0 else TEXT


def build_deck(path):
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank = prs.slide_layouts[6]

    # 1. Title
    s = prs.slides.add_slide(blank)
    set_background(s)
    add_header(s)
    add_title(
        s,
        "Stillform Strategic Overview",
        "Preventive risk management for human behavior · science-first operating deck",
    )
    add_bullets(
        s,
        Inches(0.8),
        Inches(2.7),
        Inches(11.8),
        Inches(3.7),
        [
            "Category: Preventive risk management for emotional maturity and behavioral decision quality.",
            "Audience: Everyone who needs better regulation under load — work, family, health, relationships.",
            "Standard: Every claim must map to mechanism, evidence, and measurable product signal.",
        ],
        size=18,
    )

    # 2. Who/What/How/Why
    s = prs.slides.add_slide(blank)
    set_background(s)
    add_header(s)
    add_title(s, "Operating definition", "Who · What · How · Why")
    rows = [
        ["Dimension", "Definition", "Why it matters"],
        ["Who", "For everyone building composure as a trainable daily skill.", "Universal need, not niche framing."],
        ["What", "A neuroscience-guided preventive risk management system for behavior.", "Reduces avoidable human damage before it compounds."],
        ["How", "Detect state -> route intervention -> transfer to action -> close loop -> learn patterns.", "Mechanism-driven, not content-driven."],
        ["Why", "Unregulated state degrades judgment, communication, and relationships.", "Lower errors, cleaner decisions, better outcomes."],
    ]
    add_table_like(
        s,
        Inches(0.7),
        Inches(2.0),
        Inches(12.0),
        Inches(4.7),
        rows,
        [Inches(1.4), Inches(5.0), Inches(5.6)],
    )

    # 3. Mechanics + neuroscience
    s = prs.slides.add_slide(blank)
    set_background(s)
    add_header(s)
    add_title(s, "Mechanics + neuroscience map", "Science -> product implementation -> measured signal")
    rows = [
        ["Mechanic", "Scientific basis", "Product implementation", "Measured signal"],
        ["Affect labeling", "Lieberman et al. (2007)", "Pulse chips + post-session labeling", "State precision + shift trends"],
        ["Cognitive reappraisal", "Ochsner & Gross; Buhle et al.", "Reframe structured perspective work", "Pre/post composure delta"],
        ["Interoceptive regulation", "Mehling; Critchley & Garfinkel", "Bio-filter + body scan + somatic prompts", "Faster recovery windows"],
        ["Implementation intentions", "Gollwitzer", "Calibration -> default routing", "Action latency reduction"],
        ["Stress inoculation", "Meichenbaum", "Morning baseline + EOD close loop", "Loop adherence over time"],
    ]
    add_table_like(
        s,
        Inches(0.55),
        Inches(1.95),
        Inches(12.25),
        Inches(5.0),
        rows,
        [Inches(1.9), Inches(3.1), Inches(3.5), Inches(3.75)],
    )

    # 4. Core loop mechanics
    s = prs.slides.add_slide(blank)
    set_background(s)
    add_header(s)
    add_title(s, "Core loop mechanics", "Preventive architecture, not reactive patching")
    add_section_label(s, "How the system runs", y=2.2)
    add_bullets(
        s,
        Inches(0.75),
        Inches(2.55),
        Inches(12.0),
        Inches(3.9),
        [
            "1) Morning baseline: energy + hardware check (bio-filter).",
            "2) State routing: body-first, thought-first, or balanced intervention order.",
            "3) In-session work: paced regulation + cognitive reframing + affect labeling.",
            "4) Transfer: state-to-statement and practical next-action bridge.",
            "5) End-of-day closure: daily loop completion and pattern continuity.",
            "6) Longitudinal learning: pattern memory + proof of change surfaces.",
        ],
        size=17,
    )

    # 5. Metrics + proof
    s = prs.slides.add_slide(blank)
    set_background(s)
    add_header(s)
    add_title(s, "Evidence model", "What must be true to claim impact")
    rows = [
        ["Layer", "Metric", "Interpretation"],
        ["Session", "Pre/post composure delta", "Immediate regulation effectiveness"],
        ["Daily loop", "Morning/EOD completion + drop-off", "Behavioral consistency quality"],
        ["Intervention", "Nudge shown/actioned/recovery", "Preventive support conversion"],
        ["Longitudinal", "Trend in awareness latency", "Maturity and self-regulation speed"],
        ["Trust", "Restore reliability + entitlement truth", "Operational integrity under production load"],
    ]
    add_table_like(
        s,
        Inches(0.8),
        Inches(2.05),
        Inches(11.8),
        Inches(4.7),
        rows,
        [Inches(2.2), Inches(3.8), Inches(5.8)],
    )

    # 6. Integrity system
    s = prs.slides.add_slide(blank)
    set_background(s)
    add_header(s)
    add_title(s, "Integrity system", "How quality and trust are enforced")
    add_bullets(
        s,
        Inches(0.8),
        Inches(2.35),
        Inches(11.9),
        Inches(3.9),
        [
            "SHIP preflight gates: build integrity + claim integrity + audience integrity.",
            "Invariant lock: universal audience framing, no niche drift, no manipulative copy.",
            "Execution quality gate: coherent pass, post-change verification, release blocking on failure.",
            "Subscription truth, cloud restore, and diagnostics are treated as trust-critical infrastructure.",
        ],
        size=18,
    )

    # 7. Business model
    s = prs.slides.add_slide(blank)
    set_background(s)
    add_header(s)
    add_title(s, "Business model and distribution", "Operator-grade business plan snapshot")
    rows = [
        ["Component", "Current position", "Why this is defensible"],
        ["Revenue model", "Single tier subscription ($14.99 / $9.99 annualized)", "Low decision friction + trust alignment"],
        ["Category", "Preventive risk management for behavior", "Differentiated from generic wellness consumption"],
        ["Distribution", "High-trust channels: coaches, therapist-adjacent, communities", "Trust transfer beats cold top-of-funnel spend"],
        ["Retention thesis", "Daily loop utility + measured progress + continuity", "Habit + proof + context memory creates stickiness"],
    ]
    add_table_like(
        s,
        Inches(0.7),
        Inches(2.0),
        Inches(12.0),
        Inches(4.9),
        rows,
        [Inches(2.2), Inches(4.3), Inches(5.5)],
    )

    # 8. Execution transparency
    s = prs.slides.add_slide(blank)
    set_background(s)
    add_header(s)
    add_title(s, "Execution transparency", "Completed + tested vs next gated phases")
    add_bullets(
        s,
        Inches(0.8),
        Inches(2.35),
        Inches(11.9),
        Inches(3.8),
        [
            "Completed + tested: subscription truth plumbing, cloud restore controls, loop telemetry, intervention nudges, adaptive sensitivity.",
            "Deck integrity uplift: business plan + integrity evidence + science-first mechanics register.",
            "Next gated phases: live-mode billing truth, native launch QA matrix, integration provider hookups with consent/revoke controls.",
            "Readiness standard: no phase advances without objective gate pass.",
        ],
        size=17,
    )

    # 9. Risks + mitigations
    s = prs.slides.add_slide(blank)
    set_background(s)
    add_header(s)
    add_title(s, "Risk register", "Known risks and active mitigations")
    rows = [
        ["Risk", "Mitigation"],
        ["Claim drift or overstatement", "Mechanism-first language and SHIP claim checks before release"],
        ["Feature sprawl / UX noise", "Ecosystem-first policy: strengthen loop before adding branches"],
        ["Reliability regressions", "Build + preflight gates + diagnostics for trust-critical surfaces"],
        ["Retention decay", "Daily loop reinforcement + intervention recovery measurement"],
    ]
    add_table_like(
        s,
        Inches(1.0),
        Inches(2.1),
        Inches(11.2),
        Inches(4.6),
        rows,
        [Inches(3.7), Inches(7.5)],
    )

    # 10. Closing
    s = prs.slides.add_slide(blank)
    set_background(s)
    add_header(s)
    add_title(s, "Stillform", "Preventive risk management for human behavior")
    close = s.shapes.add_textbox(Inches(0.8), Inches(2.8), Inches(11.8), Inches(2.5))
    tf = close.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.LEFT
    run = p.add_run()
    run.text = (
        "Mission: reduce avoidable human damage by making composure trainable, measurable, and transferable.\n\n"
        "Standard: honor, honesty, and integrity in product behavior, language, and release decisions."
    )
    run.font.name = BODY_FONT
    run.font.size = Pt(24)
    run.font.color.rgb = TEXT

    footer = s.shapes.add_textbox(Inches(0.8), Inches(6.55), Inches(11.5), Inches(0.4))
    p2 = footer.text_frame.paragraphs[0]
    r2 = p2.add_run()
    r2.text = "stillformapp.com"
    r2.font.name = MONO_FONT
    r2.font.size = Pt(14)
    r2.font.color.rgb = AMBER

    prs.save(path)


if __name__ == "__main__":
    build_deck("public/Stillform_Strategic_Overview.pptx")
