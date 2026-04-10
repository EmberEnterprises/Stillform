#!/usr/bin/env python3
"""Generate a stricter, executive-style Stillform applied-science deck."""

from pathlib import Path

from pptx import Presentation
from pptx.chart.data import CategoryChartData
from pptx.dml.color import RGBColor
from pptx.enum.chart import XL_CHART_TYPE
from pptx.enum.shapes import MSO_AUTO_SHAPE_TYPE
from pptx.enum.text import PP_ALIGN
from pptx.util import Inches, Pt


SLIDE_W = Inches(13.333)
SLIDE_H = Inches(7.5)

# App-aligned palette (from src/App.jsx :root)
BG = RGBColor(10, 10, 12)  # #0A0A0C
SURFACE = RGBColor(20, 20, 24)  # #141418
SURFACE_ALT = RGBColor(26, 26, 31)  # #1A1A1F
TEXT = RGBColor(232, 234, 240)  # #E8EAF0
TEXT_DIM = RGBColor(148, 150, 161)  # #9496A1
ACCENT = RGBColor(200, 146, 42)  # #C8922A
LINE = RGBColor(61, 62, 71)
SLATE = RGBColor(119, 125, 140)

FONT = "Calibri"
MONO = "Consolas"


def set_bg(slide):
    fill = slide.background.fill
    fill.solid()
    fill.fore_color.rgb = BG


def panel(slide, x, y, w, h, alt=False):
    shape = slide.shapes.add_shape(MSO_AUTO_SHAPE_TYPE.RECTANGLE, x, y, w, h)
    shape.fill.solid()
    shape.fill.fore_color.rgb = SURFACE_ALT if alt else SURFACE
    shape.line.color.rgb = LINE
    shape.line.width = Pt(0.9)
    return shape


def add_header(slide, idx, total):
    bar = slide.shapes.add_shape(MSO_AUTO_SHAPE_TYPE.RECTANGLE, Inches(0), Inches(0), SLIDE_W, Inches(0.36))
    bar.fill.solid()
    bar.fill.fore_color.rgb = SURFACE
    bar.line.fill.background()

    left = slide.shapes.add_textbox(Inches(0.55), Inches(0.11), Inches(8.0), Inches(0.2))
    lp = left.text_frame.paragraphs[0]
    lr = lp.add_run()
    lr.text = "STILLFORM · APPLIED SCIENCE BRIEF"
    lr.font.name = MONO
    lr.font.size = Pt(8.5)
    lr.font.color.rgb = ACCENT

    right = slide.shapes.add_textbox(Inches(11.1), Inches(0.11), Inches(1.7), Inches(0.2))
    rp = right.text_frame.paragraphs[0]
    rp.alignment = PP_ALIGN.RIGHT
    rr = rp.add_run()
    rr.text = f"{idx:02d} / {total:02d}"
    rr.font.name = MONO
    rr.font.size = Pt(8.5)
    rr.font.color.rgb = TEXT_DIM


def add_title(slide, title, subtitle):
    t = slide.shapes.add_textbox(Inches(0.7), Inches(0.7), Inches(12.0), Inches(1.1))
    p = t.text_frame.paragraphs[0]
    r = p.add_run()
    r.text = title
    r.font.name = FONT
    r.font.size = Pt(36)
    r.font.bold = True
    r.font.color.rgb = TEXT

    s = slide.shapes.add_textbox(Inches(0.72), Inches(1.55), Inches(12.0), Inches(0.4))
    sp = s.text_frame.paragraphs[0]
    sr = sp.add_run()
    sr.text = subtitle
    sr.font.name = FONT
    sr.font.size = Pt(14)
    sr.font.color.rgb = TEXT_DIM


def add_source(slide, text):
    b = slide.shapes.add_textbox(Inches(0.75), Inches(7.03), Inches(12.0), Inches(0.25))
    p = b.text_frame.paragraphs[0]
    r = p.add_run()
    r.text = f"Source: {text}"
    r.font.name = MONO
    r.font.size = Pt(8)
    r.font.color.rgb = TEXT_DIM


def style_chart(chart):
    chart.has_legend = False
    if chart.category_axis:
        chart.category_axis.tick_labels.font.name = FONT
        chart.category_axis.tick_labels.font.size = Pt(9)
        chart.category_axis.tick_labels.font.color.rgb = TEXT_DIM
    if chart.value_axis:
        chart.value_axis.tick_labels.font.name = FONT
        chart.value_axis.tick_labels.font.size = Pt(9)
        chart.value_axis.tick_labels.font.color.rgb = TEXT_DIM
        chart.value_axis.has_major_gridlines = True
        chart.value_axis.major_gridlines.format.line.color.rgb = LINE


def add_explainer(slide, x, y, w, h, title, lines):
    panel(slide, x, y, w, h, alt=True)
    box = slide.shapes.add_textbox(x + Inches(0.18), y + Inches(0.18), w - Inches(0.35), h - Inches(0.35))
    tf = box.text_frame
    p0 = tf.paragraphs[0]
    r0 = p0.add_run()
    r0.text = title
    r0.font.name = FONT
    r0.font.size = Pt(15)
    r0.font.bold = True
    r0.font.color.rgb = ACCENT
    for line in lines:
        p = tf.add_paragraph()
        p.text = line
        p.font.name = FONT
        p.font.size = Pt(12)
        p.font.color.rgb = TEXT
        p.space_after = Pt(6)


def slide_1_cover(prs, idx, total):
    s = prs.slides.add_slide(prs.slide_layouts[6])
    set_bg(s)
    add_header(s, idx, total)
    add_title(s, "Stillform: Applied Science", "Executive view — mechanism, not marketing")
    panel(s, Inches(0.85), Inches(2.2), Inches(11.9), Inches(4.1))
    b = s.shapes.add_textbox(Inches(1.15), Inches(2.65), Inches(11.2), Inches(3.4))
    tf = b.text_frame
    lines = [
        "Composure is treated as a trainable operational skill.",
        "Science domains: metacognition, EQ, impulsivity interruption, microbias conflict correction.",
        "Every chart maps to a Stillform mechanism and a measurable telemetry output.",
    ]
    for i, line in enumerate(lines):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.text = line
        p.font.name = FONT
        p.font.size = Pt(20)
        p.font.color.rgb = TEXT
        p.space_after = Pt(8)
    add_source(s, "Stillform science sheet + App.jsx telemetry model")


def slide_2_context(prs, idx, total):
    s = prs.slides.add_slide(prs.slide_layouts[6])
    set_bg(s)
    add_header(s, idx, total)
    add_title(s, "Global Context", "Pressure remains high; composure capacity is uneven")

    panel(s, Inches(0.75), Inches(2.05), Inches(5.95), Inches(4.7))
    d1 = CategoryChartData()
    d1.categories = ["Worry", "Stress", "Pain", "Sadness", "Anger"]
    d1.add_series("Daily negative (%)", (39, 37, 32, 26, 22))
    c1 = s.shapes.add_chart(XL_CHART_TYPE.BAR_CLUSTERED, Inches(1.0), Inches(2.45), Inches(5.45), Inches(3.95), d1).chart
    style_chart(c1)
    c1.value_axis.maximum_scale = 45
    for p in c1.series[0].points:
        p.format.fill.solid()
        p.format.fill.fore_color.rgb = ACCENT
        p.format.line.color.rgb = ACCENT

    panel(s, Inches(6.95), Inches(2.05), Inches(5.85), Inches(4.7))
    d2 = CategoryChartData()
    d2.categories = ["Respect", "Enjoyment", "Laughter", "Rested", "Learned"]
    d2.add_series("Daily positive (%)", (88, 73, 73, 72, 52))
    c2 = s.shapes.add_chart(XL_CHART_TYPE.BAR_CLUSTERED, Inches(7.2), Inches(2.45), Inches(5.35), Inches(3.95), d2).chart
    style_chart(c2)
    c2.value_axis.maximum_scale = 100
    for p in c2.series[0].points:
        p.format.fill.solid()
        p.format.fill.fore_color.rgb = SLATE
        p.format.line.color.rgb = SLATE

    add_source(s, "Gallup State of the World's Emotional Health (2024)")


def slide_3_map(prs, idx, total):
    s = prs.slides.add_slide(prs.slide_layouts[6])
    set_bg(s)
    add_header(s, idx, total)
    add_title(s, "How Stillform Works", "Applied science -> mechanism -> signal")

    table = s.shapes.add_table(6, 4, Inches(0.65), Inches(2.0), Inches(12.1), Inches(4.95)).table
    widths = [Inches(2.1), Inches(3.2), Inches(3.6), Inches(3.2)]
    for i, w in enumerate(widths):
        table.columns[i].width = w

    rows = [
        ("Domain", "Issue", "Stillform mechanism", "Measured signal"),
        ("Metacognition", "High stress narrows self-monitoring", "Affect labeling + pattern reflection", "Pre/post composure shift"),
        ("EQ", "State noise distorts social reads", "Bio-filter + microbias prompting", "Conflict-loop reduction"),
        ("Composure", "Inconsistent daily regulation", "Morning baseline + EOD close", "14d loop completion"),
        ("Impulsivity", "Fast state -> fast reactions", "Somatic interrupt + default pathway", "Time-to-stabilization"),
        ("Microbias", "20-30% overread of negative intensity", "Projection/attribution checks", "Bias-tag recurrence trend"),
    ]
    for r, row in enumerate(rows):
        for c, v in enumerate(row):
            cell = table.cell(r, c)
            cell.text = v
            cell.fill.solid()
            cell.fill.fore_color.rgb = SURFACE if r == 0 else (BG if r % 2 else SURFACE_ALT)
            run = cell.text_frame.paragraphs[0].runs[0]
            run.font.name = FONT
            run.font.size = Pt(10 if r == 0 else 9.5)
            run.font.bold = r == 0
            run.font.color.rgb = ACCENT if r == 0 else TEXT
    add_source(s, "Stillform science sheet + App.jsx loop/nudge/rating instrumentation")


def slide_4_metacognition(prs, idx, total):
    s = prs.slides.add_slide(prs.slide_layouts[6])
    set_bg(s)
    add_header(s, idx, total)
    add_title(s, "Metacognition", "Converting unobserved emotion loops into monitored choices")

    panel(s, Inches(0.75), Inches(2.05), Inches(7.9), Inches(4.7))
    d = CategoryChartData()
    d.categories = ["Worry load", "Stress load", "Learning signal", "Affect-label support"]
    d.add_series("Index", (39, 37, 52, 60))
    c = s.shapes.add_chart(XL_CHART_TYPE.COLUMN_CLUSTERED, Inches(1.05), Inches(2.45), Inches(7.35), Inches(3.95), d).chart
    style_chart(c)
    c.value_axis.maximum_scale = 65
    for p in c.series[0].points:
        p.format.fill.solid()
        p.format.fill.fore_color.rgb = ACCENT
        p.format.line.color.rgb = ACCENT

    add_explainer(
        s,
        Inches(8.95),
        Inches(2.05),
        Inches(3.85),
        Inches(4.7),
        "How this works in-app",
        [
            "Pulse emotion chips perform affect labeling.",
            "Reframe reflects patterns back as operational language.",
            "Output target: clearer next-action selection under load.",
        ],
    )
    add_source(s, "Flavell 1979; Lieberman 2007; Torre & Lieberman 2018")


def slide_5_eq(prs, idx, total):
    s = prs.slides.add_slide(prs.slide_layouts[6])
    set_bg(s)
    add_header(s, idx, total)
    add_title(s, "EQ + Microbias Conflict", "Reducing projection and attribution errors before they escalate")

    panel(s, Inches(0.75), Inches(2.05), Inches(7.9), Inches(4.7))
    d = CategoryChartData()
    d.categories = ["Overread low", "Overread high", "Daily anger", "Daily sadness"]
    d.add_series("Range / prevalence (%)", (20, 30, 22, 26))
    c = s.shapes.add_chart(XL_CHART_TYPE.COLUMN_CLUSTERED, Inches(1.05), Inches(2.45), Inches(7.35), Inches(3.95), d).chart
    style_chart(c)
    c.value_axis.maximum_scale = 35
    for p in c.series[0].points:
        p.format.fill.solid()
        p.format.fill.fore_color.rgb = ACCENT
        p.format.line.color.rgb = ACCENT

    add_explainer(
        s,
        Inches(8.95),
        Inches(2.05),
        Inches(3.85),
        Inches(4.7),
        "How this works in-app",
        [
            "Bio-filter tags depleted hardware states first.",
            "Reframe applies one microbias correction at a time.",
            "Goal: lower reactive conflict interpretation errors.",
        ],
    )
    add_source(s, "Stillform science sheet microbias section; Nature Communications 2025")


def slide_6_impulsivity(prs, idx, total):
    s = prs.slides.add_slide(prs.slide_layouts[6])
    set_bg(s)
    add_header(s, idx, total)
    add_title(s, "Impulsivity Under Load", "Interrupting fast-state reaction chains")

    panel(s, Inches(0.75), Inches(2.05), Inches(5.95), Inches(4.7))
    d1 = CategoryChartData()
    d1.categories = ["2011", "2019"]
    d1.add_series("Unrest index", (100, 344))
    c1 = s.shapes.add_chart(XL_CHART_TYPE.COLUMN_CLUSTERED, Inches(1.0), Inches(2.45), Inches(5.45), Inches(3.95), d1).chart
    style_chart(c1)
    c1.value_axis.maximum_scale = 360
    for p in c1.series[0].points:
        p.format.fill.solid()
        p.format.fill.fore_color.rgb = ACCENT
        p.format.line.color.rgb = ACCENT

    panel(s, Inches(6.95), Inches(2.05), Inches(5.85), Inches(2.25))
    d2 = CategoryChartData()
    d2.categories = ["Stress", "Worry"]
    d2.add_series("Daily pressure (%)", (37, 39))
    c2 = s.shapes.add_chart(XL_CHART_TYPE.COLUMN_CLUSTERED, Inches(7.2), Inches(2.3), Inches(5.35), Inches(1.75), d2).chart
    style_chart(c2)
    c2.value_axis.maximum_scale = 45
    for p in c2.series[0].points:
        p.format.fill.solid()
        p.format.fill.fore_color.rgb = SLATE
        p.format.line.color.rgb = SLATE

    add_explainer(
        s,
        Inches(6.95),
        Inches(4.5),
        Inches(5.85),
        Inches(2.25),
        "How this works in-app",
        [
            "Somatic interrupt catches rapid escalation in-session.",
            "Default pathway routing reduces decision lag under load.",
            "Target: reduce reactive action in high-pressure windows.",
        ],
    )
    add_source(s, "Gallup 2024/2025 context; Stillform somatic interrupt + routing logic")


def slide_7_mechanism(prs, idx, total):
    s = prs.slides.add_slide(prs.slide_layouts[6])
    set_bg(s)
    add_header(s, idx, total)
    add_title(s, "Stillform Mechanism", "Daily operating loop")

    steps = [
        "State capture",
        "Intervention",
        "Reappraisal",
        "Transfer action",
        "EOD consolidation",
    ]
    x0, y, w, h, gap = Inches(0.72), Inches(2.45), Inches(2.38), Inches(2.8), Inches(0.12)
    for i, step in enumerate(steps):
        x = x0 + i * (w + gap)
        panel(s, x, y, w, h, alt=i % 2 == 1)
        t = s.shapes.add_textbox(x + Inches(0.16), y + Inches(0.2), Inches(2.05), Inches(0.55))
        tp = t.text_frame.paragraphs[0]
        tr = tp.add_run()
        tr.text = step
        tr.font.name = FONT
        tr.font.size = Pt(14)
        tr.font.bold = True
        tr.font.color.rgb = ACCENT
        if i < len(steps) - 1:
            a = s.shapes.add_shape(MSO_AUTO_SHAPE_TYPE.RIGHT_ARROW, x + w - Inches(0.02), y + Inches(1.1), Inches(0.14), Inches(0.5))
            a.fill.solid()
            a.fill.fore_color.rgb = TEXT_DIM
            a.line.fill.background()
    add_explainer(
        s,
        Inches(0.72),
        Inches(5.45),
        Inches(12.06),
        Inches(1.3),
        "Execution intent",
        ["Composure is trained as repeatable daily behavior, not occasional mood relief."],
    )
    add_source(s, "Stillform morning -> intervention -> post-rating -> EOD architecture")


def slide_8_telemetry(prs, idx, total):
    s = prs.slides.add_slide(prs.slide_layouts[6])
    set_bg(s)
    add_header(s, idx, total)
    add_title(s, "Telemetry Proof", "If applied science is real, it must show up in measured signals")

    panel(s, Inches(0.75), Inches(2.05), Inches(7.9), Inches(4.7))
    d = CategoryChartData()
    d.categories = ["Pre/post shift", "Loop completion 14d", "Nudge recovery 14d", "Reliability score", "Tool efficacy"]
    d.add_series("Instrumentation coverage", (100, 100, 100, 100, 100))
    c = s.shapes.add_chart(XL_CHART_TYPE.COLUMN_CLUSTERED, Inches(1.05), Inches(2.45), Inches(7.35), Inches(3.95), d).chart
    style_chart(c)
    c.value_axis.maximum_scale = 110
    for p in c.series[0].points:
        p.format.fill.solid()
        p.format.fill.fore_color.rgb = ACCENT
        p.format.line.color.rgb = ACCENT

    add_explainer(
        s,
        Inches(8.95),
        Inches(2.05),
        Inches(3.85),
        Inches(4.7),
        "How this works in-app",
        [
            "Reliability score = (Loop x 0.65) + (Recovery x 0.35).",
            "14-day window for active operating signal.",
            "12-week horizon for composure telemetry.",
        ],
    )
    add_source(s, "Stillform App.jsx reliabilityScore + loop/nudge telemetry implementation")


def slide_9_close(prs, idx, total):
    s = prs.slides.add_slide(prs.slide_layouts[6])
    set_bg(s)
    add_header(s, idx, total)
    add_title(s, "Executive Thesis", "Applied science mapped to execution")
    panel(s, Inches(0.88), Inches(2.2), Inches(11.6), Inches(4.15))
    box = s.shapes.add_textbox(Inches(1.2), Inches(2.65), Inches(11.0), Inches(3.35))
    tf = box.text_frame
    lines = [
        "Stillform is not psychiatric treatment software.",
        "It is a composure and self-awareness operating system.",
        "Mechanism quality is judged by behavior shift, reliability, and transfer under pressure.",
    ]
    for i, line in enumerate(lines):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.text = line
        p.font.name = FONT
        p.font.size = Pt(25 if i == 0 else 20)
        p.font.bold = True
        p.font.color.rgb = TEXT
        p.space_after = Pt(8)
    add_source(s, "Stillform applied science model: metacognition, EQ, composure, impulsivity, microbias")


def build():
    prs = Presentation()
    prs.slide_width = SLIDE_W
    prs.slide_height = SLIDE_H
    total = 9

    slide_1_cover(prs, 1, total)
    slide_2_context(prs, 2, total)
    slide_3_map(prs, 3, total)
    slide_4_metacognition(prs, 4, total)
    slide_5_eq(prs, 5, total)
    slide_6_impulsivity(prs, 6, total)
    slide_7_mechanism(prs, 7, total)
    slide_8_telemetry(prs, 8, total)
    slide_9_close(prs, 9, total)

    out = Path(__file__).resolve().parents[1] / "public" / "Stillform_Executive_Deck.pptx"
    out.parent.mkdir(parents=True, exist_ok=True)
    prs.save(out)
    print(f"Wrote {out}")


if __name__ == "__main__":
    build()
