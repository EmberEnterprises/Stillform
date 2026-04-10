#!/usr/bin/env python3
"""Generate a polished executive Stillform deck with chart visuals."""

from pathlib import Path

from pptx import Presentation
from pptx.chart.data import CategoryChartData
from pptx.dml.color import RGBColor
from pptx.enum.chart import XL_CHART_TYPE, XL_LEGEND_POSITION
from pptx.enum.shapes import MSO_AUTO_SHAPE_TYPE
from pptx.enum.text import PP_ALIGN
from pptx.util import Inches, Pt


BG = RGBColor(9, 11, 15)
SURFACE = RGBColor(18, 21, 27)
SURFACE_ALT = RGBColor(25, 29, 37)
LINE = RGBColor(46, 52, 63)
AMBER = RGBColor(208, 151, 63)
TEXT = RGBColor(234, 236, 239)
TEXT_DIM = RGBColor(165, 170, 180)
ACCENT_BLUE = RGBColor(96, 158, 242)
ACCENT_GREEN = RGBColor(94, 187, 141)
ACCENT_RED = RGBColor(210, 98, 96)

TITLE_FONT = "Cormorant Garamond"
BODY_FONT = "DM Sans"
MONO_FONT = "IBM Plex Mono"

SLIDE_W = Inches(13.333)
SLIDE_H = Inches(7.5)


def set_bg(slide):
    fill = slide.background.fill
    fill.solid()
    fill.fore_color.rgb = BG


def add_header(slide, idx, total, kicker="STILLFORM · EXECUTIVE DECK"):
    bar = slide.shapes.add_shape(MSO_AUTO_SHAPE_TYPE.RECTANGLE, Inches(0), Inches(0), SLIDE_W, Inches(0.36))
    bar.fill.solid()
    bar.fill.fore_color.rgb = SURFACE
    bar.line.fill.background()

    k = slide.shapes.add_textbox(Inches(0.58), Inches(0.12), Inches(7.0), Inches(0.2))
    kp = k.text_frame.paragraphs[0]
    kr = kp.add_run()
    kr.text = kicker
    kr.font.name = MONO_FONT
    kr.font.size = Pt(9)
    kr.font.color.rgb = AMBER

    p = slide.shapes.add_textbox(Inches(11.0), Inches(0.12), Inches(1.9), Inches(0.2))
    pp = p.text_frame.paragraphs[0]
    pp.alignment = PP_ALIGN.RIGHT
    pr = pp.add_run()
    pr.text = f"{idx:02d} / {total:02d}"
    pr.font.name = MONO_FONT
    pr.font.size = Pt(9)
    pr.font.color.rgb = TEXT_DIM


def add_title(slide, title, subtitle=None):
    t = slide.shapes.add_textbox(Inches(0.72), Inches(0.72), Inches(12.0), Inches(1.2))
    p = t.text_frame.paragraphs[0]
    r = p.add_run()
    r.text = title
    r.font.name = TITLE_FONT
    r.font.size = Pt(42)
    r.font.color.rgb = AMBER

    if subtitle:
        s = slide.shapes.add_textbox(Inches(0.76), Inches(1.64), Inches(11.8), Inches(0.45))
        sp = s.text_frame.paragraphs[0]
        sr = sp.add_run()
        sr.text = subtitle
        sr.font.name = BODY_FONT
        sr.font.size = Pt(16)
        sr.font.color.rgb = TEXT_DIM


def add_bullets(slide, x, y, w, h, lines, size=18):
    box = slide.shapes.add_textbox(x, y, w, h)
    tf = box.text_frame
    tf.word_wrap = True
    tf.clear()
    for idx, line in enumerate(lines):
        p = tf.paragraphs[0] if idx == 0 else tf.add_paragraph()
        p.text = line
        p.level = 0
        p.font.name = BODY_FONT
        p.font.size = Pt(size)
        p.font.color.rgb = TEXT
        p.space_after = Pt(8)


def style_chart(chart):
    chart.has_legend = True
    chart.legend.position = XL_LEGEND_POSITION.BOTTOM
    chart.legend.include_in_layout = False
    chart.legend.font.name = BODY_FONT
    chart.legend.font.size = Pt(10)
    chart.legend.font.color.rgb = TEXT_DIM

    if chart.category_axis:
        chart.category_axis.tick_labels.font.name = BODY_FONT
        chart.category_axis.tick_labels.font.size = Pt(10)
        chart.category_axis.tick_labels.font.color.rgb = TEXT_DIM
    if chart.value_axis:
        chart.value_axis.tick_labels.font.name = BODY_FONT
        chart.value_axis.tick_labels.font.size = Pt(10)
        chart.value_axis.tick_labels.font.color.rgb = TEXT_DIM
        chart.value_axis.has_major_gridlines = True
        chart.value_axis.major_gridlines.format.line.color.rgb = LINE


def add_retention_chart(slide):
    data = CategoryChartData()
    data.categories = ["Uptake", "Adherence", "Attrition (Post)", "Attrition (Follow-up)"]
    data.add_series("Rate %", (92.4, 61.8, 18.6, 28.4))
    chart = slide.shapes.add_chart(
        XL_CHART_TYPE.COLUMN_CLUSTERED,
        Inches(0.8),
        Inches(2.25),
        Inches(6.15),
        Inches(3.9),
        data,
    ).chart
    style_chart(chart)
    series = chart.series[0]
    series.format.fill.solid()
    series.format.fill.fore_color.rgb = AMBER
    series.format.line.color.rgb = AMBER

    note = slide.shapes.add_textbox(Inches(7.25), Inches(2.35), Inches(5.35), Inches(3.6))
    add_bullets(
        slide,
        Inches(7.25),
        Inches(2.35),
        Inches(5.35),
        Inches(3.6),
        [
            "The market converts attention; it loses continuity.",
            "Stillform is designed around continuity loops: morning baseline, intervention, evening close.",
            "Research signal is consistent: reminders and accountability improve retention; gamification does not.",
        ],
        size=15,
    )


def add_mechanism_confidence_chart(slide):
    data = CategoryChartData()
    data.categories = ["Breathing", "Affect Labeling", "Reappraisal", "Interoception", "Loop Adherence", "AI Personalization"]
    data.add_series("Evidence Confidence (1-5)", (5.0, 5.0, 4.5, 3.5, 4.0, 2.5))
    chart = slide.shapes.add_chart(
        XL_CHART_TYPE.BAR_CLUSTERED,
        Inches(0.8),
        Inches(2.05),
        Inches(7.0),
        Inches(4.5),
        data,
    ).chart
    style_chart(chart)
    chart.has_legend = False
    series = chart.series[0]
    series.format.fill.solid()
    series.format.fill.fore_color.rgb = ACCENT_BLUE
    series.format.line.color.rgb = ACCENT_BLUE

    card = slide.shapes.add_shape(MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE, Inches(8.1), Inches(2.2), Inches(4.45), Inches(4.25))
    card.fill.solid()
    card.fill.fore_color.rgb = SURFACE
    card.line.color.rgb = LINE

    add_bullets(
        slide,
        Inches(8.35),
        Inches(2.55),
        Inches(3.95),
        Inches(3.7),
        [
            "High confidence: breathing, labeling, reappraisal.",
            "Good confidence: interoceptive routing, adherence loops.",
            "Emerging confidence: longitudinal AI personalization impact.",
            "Execution rule: claim only what evidence supports.",
        ],
        size=13,
    )


def add_flywheel(slide):
    centers = [Inches(1.2), Inches(4.2), Inches(7.2), Inches(10.2)]
    labels = ["State Detection", "Right Intervention", "Daily Closure", "Pattern Learning"]
    colors = [ACCENT_BLUE, AMBER, ACCENT_GREEN, RGBColor(163, 128, 224)]
    for i, x in enumerate(centers):
        circ = slide.shapes.add_shape(MSO_AUTO_SHAPE_TYPE.OVAL, x, Inches(2.8), Inches(2.0), Inches(2.0))
        circ.fill.solid()
        circ.fill.fore_color.rgb = SURFACE
        circ.line.color.rgb = colors[i]
        circ.line.width = Pt(2)
        tx = slide.shapes.add_textbox(x + Inches(0.18), Inches(3.35), Inches(1.65), Inches(0.9))
        tp = tx.text_frame.paragraphs[0]
        tp.alignment = PP_ALIGN.CENTER
        tr = tp.add_run()
        tr.text = labels[i]
        tr.font.name = BODY_FONT
        tr.font.size = Pt(12)
        tr.font.color.rgb = TEXT
        if i < len(centers) - 1:
            arrow = slide.shapes.add_shape(
                MSO_AUTO_SHAPE_TYPE.RIGHT_ARROW,
                x + Inches(2.03),
                Inches(3.55),
                Inches(0.8),
                Inches(0.36),
            )
            arrow.fill.solid()
            arrow.fill.fore_color.rgb = TEXT_DIM
            arrow.line.fill.background()

    add_bullets(
        slide,
        Inches(0.9),
        Inches(5.25),
        Inches(11.8),
        Inches(1.3),
        [
            "This is the operating loop: detect accurately, regulate quickly, close deliberately, learn longitudinally."
        ],
        size=16,
    )


def add_business_chart(slide):
    data = CategoryChartData()
    data.categories = ["Individual", "Coach / Team", "Clinical Adjacent"]
    data.add_series("Revenue Mix Target %", (65, 25, 10))
    chart = slide.shapes.add_chart(
        XL_CHART_TYPE.DOUGHNUT,
        Inches(0.9),
        Inches(2.0),
        Inches(4.8),
        Inches(4.4),
        data,
    ).chart
    chart.has_legend = True
    chart.legend.position = XL_LEGEND_POSITION.RIGHT
    chart.legend.font.name = BODY_FONT
    chart.legend.font.size = Pt(10)
    chart.legend.font.color.rgb = TEXT_DIM
    plot = chart.plots[0]
    plot.has_data_labels = False
    point_colors = [AMBER, ACCENT_BLUE, ACCENT_GREEN]
    for i, p in enumerate(chart.series[0].points):
        p.format.fill.solid()
        p.format.fill.fore_color.rgb = point_colors[i]

    add_bullets(
        slide,
        Inches(6.1),
        Inches(2.2),
        Inches(6.1),
        Inches(3.9),
        [
            "Consumer-first model keeps product velocity high.",
            "Coach and team channels layer accountability and raise retention.",
            "Clinical-adjacent channel is post-traction, compliance-gated.",
            "Pricing logic: premium trust product, not volume-churn utility.",
        ],
        size=15,
    )


def add_execution_timeline(slide):
    phases = [
        ("Phase 1", "Reliability", "Subscription truth, cloud integrity, zero-friction loop"),
        ("Phase 2", "Retention", "Nudge recovery, visible progress, daily adherence"),
        ("Phase 3", "Scale", "Coach channel, selective B2B, outcome reporting"),
    ]
    x = Inches(0.95)
    for idx, (phase, title, detail) in enumerate(phases):
        card = slide.shapes.add_shape(MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE, x, Inches(2.35), Inches(3.95), Inches(3.45))
        card.fill.solid()
        card.fill.fore_color.rgb = SURFACE if idx % 2 == 0 else SURFACE_ALT
        card.line.color.rgb = LINE
        label = slide.shapes.add_textbox(x + Inches(0.22), Inches(2.62), Inches(3.2), Inches(0.3))
        lp = label.text_frame.paragraphs[0]
        lr = lp.add_run()
        lr.text = phase
        lr.font.name = MONO_FONT
        lr.font.size = Pt(10)
        lr.font.color.rgb = AMBER
        ttl = slide.shapes.add_textbox(x + Inches(0.22), Inches(2.95), Inches(3.45), Inches(0.5))
        tp = ttl.text_frame.paragraphs[0]
        tr = tp.add_run()
        tr.text = title
        tr.font.name = BODY_FONT
        tr.font.size = Pt(20)
        tr.font.bold = True
        tr.font.color.rgb = TEXT
        body = slide.shapes.add_textbox(x + Inches(0.22), Inches(3.48), Inches(3.45), Inches(1.95))
        bp = body.text_frame.paragraphs[0]
        br = bp.add_run()
        br.text = detail
        br.font.name = BODY_FONT
        br.font.size = Pt(13)
        br.font.color.rgb = TEXT_DIM
        x += Inches(4.25)


def add_risk_table(slide):
    headers = ["Risk", "Exposure", "Control", "Owner Signal"]
    rows = [
        ("Overclaim risk", "Trust erosion", "Strict evidence language policy", "Claim audit pass rate"),
        ("Retention decay", "No long-term outcome", "Daily loop + recovery nudges", "14d completion and recovery"),
        ("AI overreliance", "Skill transfer failure", "Self-guided fallback and action prompts", "Self-guided success rate"),
        ("Operational drift", "Quality inconsistency", "SHIP preflight + invariant checks", "Preflight pass rate"),
    ]
    table = slide.shapes.add_table(
        len(rows) + 1,
        4,
        Inches(0.7),
        Inches(2.05),
        Inches(12.0),
        Inches(4.95),
    ).table
    col_widths = [Inches(2.45), Inches(2.2), Inches(4.2), Inches(3.15)]
    for i, w in enumerate(col_widths):
        table.columns[i].width = w

    for c, h in enumerate(headers):
        cell = table.cell(0, c)
        cell.text = h
        cell.fill.solid()
        cell.fill.fore_color.rgb = SURFACE
        run = cell.text_frame.paragraphs[0].runs[0]
        run.font.name = BODY_FONT
        run.font.bold = True
        run.font.size = Pt(12)
        run.font.color.rgb = AMBER

    for r, values in enumerate(rows, start=1):
        for c, v in enumerate(values):
            cell = table.cell(r, c)
            cell.text = v
            cell.fill.solid()
            cell.fill.fore_color.rgb = SURFACE_ALT if r % 2 == 0 else BG
            run = cell.text_frame.paragraphs[0].runs[0]
            run.font.name = BODY_FONT
            run.font.size = Pt(11)
            run.font.color.rgb = TEXT


def build():
    prs = Presentation()
    prs.slide_width = SLIDE_W
    prs.slide_height = SLIDE_H
    blank = prs.slide_layouts[6]
    total = 12

    # 1
    s = prs.slides.add_slide(blank)
    set_bg(s)
    add_header(s, 1, total)
    add_title(s, "Stillform", "Executive strategy brief · composure as preventive risk management")
    add_bullets(
        s,
        Inches(0.82),
        Inches(2.35),
        Inches(11.6),
        Inches(3.2),
        [
            "A neuroscience-grounded system that trains composure as a daily operational skill.",
            "Built for everyone: leaders, parents, students, teams, and anyone making decisions under load.",
            "Category position: not wellness content, but regulation infrastructure.",
        ],
        size=19,
    )

    # 2
    s = prs.slides.add_slide(blank)
    set_bg(s)
    add_header(s, 2, total)
    add_title(s, "The thesis", "Composure is a controllable performance variable")
    quote = s.shapes.add_shape(MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE, Inches(0.95), Inches(2.2), Inches(11.4), Inches(3.65))
    quote.fill.solid()
    quote.fill.fore_color.rgb = SURFACE
    quote.line.color.rgb = LINE
    add_bullets(
        s,
        Inches(1.35),
        Inches(2.95),
        Inches(10.6),
        Inches(2.6),
        [
            "When state is misread, judgment degrades.",
            "When state is regulated, perspective widens.",
            "When perspective widens, outcomes improve.",
        ],
        size=29,
    )

    # 3
    s = prs.slides.add_slide(blank)
    set_bg(s)
    add_header(s, 3, total)
    add_title(s, "Market reality", "Engagement is the bottleneck, not initial interest")
    add_retention_chart(s)

    # 4
    s = prs.slides.add_slide(blank)
    set_bg(s)
    add_header(s, 4, total)
    add_title(s, "Mechanism architecture", "Body-first and thought-first pathways in one operating system")
    add_flywheel(s)

    # 5
    s = prs.slides.add_slide(blank)
    set_bg(s)
    add_header(s, 5, total)
    add_title(s, "Evidence confidence map", "Mechanism confidence weighted by current literature depth")
    add_mechanism_confidence_chart(s)

    # 6
    s = prs.slides.add_slide(blank)
    set_bg(s)
    add_header(s, 6, total)
    add_title(s, "Product proof design", "How the app makes change visible without noise")
    add_bullets(
        s,
        Inches(0.8),
        Inches(2.15),
        Inches(12.0),
        Inches(4.8),
        [
            "Composure telemetry: 12-week behavioral trace.",
            "Proof of change: pre/post shift trend, loop reliability, intervention recovery.",
            "Pattern intelligence: tool efficacy, signal clusters, blind-spot recurrence.",
            "Integrity guard: evidence-calibrated claims only (supports regulation, no clinical overreach).",
        ],
        size=18,
    )

    # 7
    s = prs.slides.add_slide(blank)
    set_bg(s)
    add_header(s, 7, total)
    add_title(s, "Business model", "Premium trust product with layered distribution")
    add_business_chart(s)

    # 8
    s = prs.slides.add_slide(blank)
    set_bg(s)
    add_header(s, 8, total)
    add_title(s, "Go-to-market", "Beachhead to scale without losing product integrity")
    add_bullets(
        s,
        Inches(0.85),
        Inches(2.2),
        Inches(11.8),
        Inches(4.7),
        [
            "Phase A: direct users proving retention and measurable gains.",
            "Phase B: executive coaches and high-trust practitioners as multipliers.",
            "Phase C: selective clinical-adjacent partnerships after outcome stability.",
            "Commercial principle: distribution expands only after mechanism quality is stable.",
        ],
        size=18,
    )

    # 9
    s = prs.slides.add_slide(blank)
    set_bg(s)
    add_header(s, 9, total)
    add_title(s, "Execution cadence", "Three operating phases with hard quality gates")
    add_execution_timeline(s)

    # 10
    s = prs.slides.add_slide(blank)
    set_bg(s)
    add_header(s, 10, total)
    add_title(s, "Risk and controls", "Known risks are explicitly bounded")
    add_risk_table(s)

    # 11
    s = prs.slides.add_slide(blank)
    set_bg(s)
    add_header(s, 11, total)
    add_title(s, "Operator scoreboard", "The metrics that decide if the system is truly working")
    add_bullets(
        s,
        Inches(0.9),
        Inches(2.15),
        Inches(11.6),
        Inches(4.9),
        [
            "Activation: first-session completion and first-week return.",
            "Behavior: morning/EOD loop completion and nudge recovery.",
            "Regulation: pre/post composure shift and time-to-stabilization.",
            "Durability: 14/30-day retention and self-guided success during outages.",
            "Trust: claim-audit compliance and zero critical safety regressions.",
        ],
        size=17,
    )

    # 12
    s = prs.slides.add_slide(blank)
    set_bg(s)
    add_header(s, 12, total)
    add_title(s, "Closing", "Build the system people can trust when stakes are high")
    card = s.shapes.add_shape(MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE, Inches(1.15), Inches(2.25), Inches(10.95), Inches(3.9))
    card.fill.solid()
    card.fill.fore_color.rgb = SURFACE
    card.line.color.rgb = LINE
    add_bullets(
        s,
        Inches(1.55),
        Inches(3.0),
        Inches(10.0),
        Inches(2.6),
        [
            "Stillform does not sell calm.",
            "Stillform builds composure as a repeatable capability.",
            "That capability compounds into better decisions, cleaner relationships, and lower long-tail risk.",
        ],
        size=24,
    )

    out = Path(__file__).resolve().parents[1] / "public" / "Stillform_Executive_Deck.pptx"
    out.parent.mkdir(parents=True, exist_ok=True)
    prs.save(out)
    print(f"Wrote {out}")


if __name__ == "__main__":
    build()
