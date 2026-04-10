#!/usr/bin/env python3
"""Generate a narrative-first executive deck for Stillform."""

from pathlib import Path

from pptx import Presentation
from pptx.chart.data import CategoryChartData
from pptx.dml.color import RGBColor
from pptx.enum.chart import XL_CHART_TYPE, XL_LEGEND_POSITION
from pptx.enum.shapes import MSO_AUTO_SHAPE_TYPE
from pptx.enum.text import PP_ALIGN
from pptx.util import Inches, Pt


SLIDE_W = Inches(13.333)
SLIDE_H = Inches(7.5)

# App-aligned theme
BG = RGBColor(10, 10, 12)  # #0A0A0C
SURFACE = RGBColor(20, 20, 24)  # #141418
SURFACE_2 = RGBColor(26, 26, 31)  # #1A1A1F
TEXT = RGBColor(232, 234, 240)  # #E8EAF0
TEXT_DIM = RGBColor(148, 150, 161)  # #9496A1
ACCENT = RGBColor(200, 146, 42)  # #C8922A
ACCENT_DIM = RGBColor(150, 117, 52)
RED = RGBColor(170, 82, 82)
BLUE = RGBColor(106, 129, 170)
GREEN = RGBColor(126, 162, 126)
LINE = RGBColor(58, 58, 66)

FONT = "Calibri"
MONO = "Consolas"


def set_bg(slide):
    fill = slide.background.fill
    fill.solid()
    fill.fore_color.rgb = BG


def add_header(slide, idx, total):
    bar = slide.shapes.add_shape(MSO_AUTO_SHAPE_TYPE.RECTANGLE, Inches(0), Inches(0), SLIDE_W, Inches(0.36))
    bar.fill.solid()
    bar.fill.fore_color.rgb = SURFACE
    bar.line.fill.background()

    left = slide.shapes.add_textbox(Inches(0.55), Inches(0.11), Inches(8.5), Inches(0.2))
    lp = left.text_frame.paragraphs[0]
    lr = lp.add_run()
    lr.text = "STILLFORM · EXECUTIVE APPLIED SCIENCE BRIEF"
    lr.font.name = MONO
    lr.font.size = Pt(9)
    lr.font.color.rgb = ACCENT

    right = slide.shapes.add_textbox(Inches(11.2), Inches(0.11), Inches(1.6), Inches(0.2))
    rp = right.text_frame.paragraphs[0]
    rp.alignment = PP_ALIGN.RIGHT
    rr = rp.add_run()
    rr.text = f"{idx:02d} / {total:02d}"
    rr.font.name = MONO
    rr.font.size = Pt(9)
    rr.font.color.rgb = TEXT_DIM


def add_title(slide, title, subtitle):
    t = slide.shapes.add_textbox(Inches(0.7), Inches(0.7), Inches(12.0), Inches(1.05))
    tp = t.text_frame.paragraphs[0]
    tr = tp.add_run()
    tr.text = title
    tr.font.name = FONT
    tr.font.size = Pt(38)
    tr.font.bold = True
    tr.font.color.rgb = TEXT

    s = slide.shapes.add_textbox(Inches(0.74), Inches(1.55), Inches(11.9), Inches(0.45))
    sp = s.text_frame.paragraphs[0]
    sr = sp.add_run()
    sr.text = subtitle
    sr.font.name = FONT
    sr.font.size = Pt(15)
    sr.font.color.rgb = TEXT_DIM


def add_source(slide, text):
    b = slide.shapes.add_textbox(Inches(0.75), Inches(7.03), Inches(12.0), Inches(0.24))
    p = b.text_frame.paragraphs[0]
    r = p.add_run()
    r.text = f"Source: {text}"
    r.font.name = MONO
    r.font.size = Pt(8.5)
    r.font.color.rgb = TEXT_DIM


def add_panel(slide, x, y, w, h, alt=False):
    panel = slide.shapes.add_shape(MSO_AUTO_SHAPE_TYPE.RECTANGLE, x, y, w, h)
    panel.fill.solid()
    panel.fill.fore_color.rgb = SURFACE_2 if alt else SURFACE
    panel.line.color.rgb = LINE
    panel.line.width = Pt(1)
    return panel


def style_chart(chart, legend=False):
    chart.has_legend = legend
    if legend:
        chart.legend.position = XL_LEGEND_POSITION.BOTTOM
        chart.legend.include_in_layout = False
        chart.legend.font.name = FONT
        chart.legend.font.size = Pt(10)
        chart.legend.font.color.rgb = TEXT_DIM

    if chart.category_axis:
        chart.category_axis.tick_labels.font.name = FONT
        chart.category_axis.tick_labels.font.size = Pt(10)
        chart.category_axis.tick_labels.font.color.rgb = TEXT_DIM
    if chart.value_axis:
        chart.value_axis.tick_labels.font.name = FONT
        chart.value_axis.tick_labels.font.size = Pt(10)
        chart.value_axis.tick_labels.font.color.rgb = TEXT_DIM
        chart.value_axis.has_major_gridlines = True
        chart.value_axis.major_gridlines.format.line.color.rgb = LINE


def add_story_lines(slide, x, y, w, h, lines, first_size=22, body_size=16):
    box = slide.shapes.add_textbox(x, y, w, h)
    tf = box.text_frame
    tf.word_wrap = True
    for i, line in enumerate(lines):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.text = line
        p.font.name = FONT
        p.font.size = Pt(first_size if i == 0 else body_size)
        p.font.bold = i == 0
        p.font.color.rgb = TEXT
        p.space_after = Pt(9 if i == 0 else 7)


def slide_1_definition(prs, idx, total):
    s = prs.slides.add_slide(prs.slide_layouts[6])
    set_bg(s)
    add_header(s, idx, total)
    add_title(s, "What Stillform Is", "The story anchor before any charts")

    add_panel(s, Inches(0.85), Inches(2.1), Inches(11.9), Inches(4.75))
    add_story_lines(
        s,
        Inches(1.15),
        Inches(2.45),
        Inches(11.2),
        Inches(3.9),
        [
            "Stillform is a composure and self-awareness system.",
            "It is not a psychiatry app and not therapy replacement software.",
            "It trains people to read state accurately, interrupt impulsive reactions, and choose better actions under load.",
            "Its core mechanism is daily loop execution: morning baseline -> state-aware intervention -> post-shift rating -> evening closure.",
        ],
    )
    add_source(s, "Stillform product architecture and privacy/disclaimer copy")


def slide_2_why_visuals(prs, idx, total):
    s = prs.slides.add_slide(prs.slide_layouts[6])
    set_bg(s)
    add_header(s, idx, total)
    add_title(s, "Why These Visuals Matter", "Each chart answers an executive decision question")

    add_panel(s, Inches(0.75), Inches(2.05), Inches(12.1), Inches(4.8))
    table = s.shapes.add_table(6, 3, Inches(1.0), Inches(2.35), Inches(11.6), Inches(4.2)).table
    table.columns[0].width = Inches(2.8)
    table.columns[1].width = Inches(4.1)
    table.columns[2].width = Inches(4.7)
    rows = [
        ("Visual", "Question", "Why it matters"),
        ("Global context", "Is composure demand real?", "Shows pressure environment users live in."),
        ("Metacognition", "Can users monitor state better?", "Validates awareness training mechanics."),
        ("EQ/microbias", "Are social reads cleaner?", "Reduces conflict misreads and relational cost."),
        ("Impulsivity", "Can reactions be interrupted?", "Protects decisions in high-arousal windows."),
        ("Telemetry layer", "Can we prove improvement?", "Moves from claims to measurable evidence."),
    ]
    for r, row in enumerate(rows):
        for c, val in enumerate(row):
            cell = table.cell(r, c)
            cell.text = val
            cell.fill.solid()
            cell.fill.fore_color.rgb = SURFACE if r == 0 else (BG if r % 2 else SURFACE_2)
            run = cell.text_frame.paragraphs[0].runs[0]
            run.font.name = FONT
            run.font.size = Pt(11 if r == 0 else 10)
            run.font.bold = r == 0
            run.font.color.rgb = ACCENT if r == 0 else TEXT
    add_source(s, "Deck framing logic tied to Stillform mechanism audit")


def slide_3_global_context(prs, idx, total):
    s = prs.slides.add_slide(prs.slide_layouts[6])
    set_bg(s)
    add_header(s, idx, total)
    add_title(s, "Global Context", "Pressure remains high; composure capacity is uneven")

    add_panel(s, Inches(0.75), Inches(2.05), Inches(6.0), Inches(4.8))
    d1 = CategoryChartData()
    d1.categories = ["Worry", "Stress", "Pain", "Sadness", "Anger"]
    d1.add_series("Daily negative experiences (%)", (39, 37, 32, 26, 22))
    c1 = s.shapes.add_chart(XL_CHART_TYPE.BAR_CLUSTERED, Inches(1.0), Inches(2.45), Inches(5.55), Inches(3.95), d1).chart
    style_chart(c1)
    c1.value_axis.maximum_scale = 45
    for pt in c1.series[0].points:
        pt.format.fill.solid()
        pt.format.fill.fore_color.rgb = ACCENT_DIM
        pt.format.line.color.rgb = ACCENT_DIM

    add_panel(s, Inches(6.95), Inches(2.05), Inches(5.85), Inches(4.8), alt=True)
    d2 = CategoryChartData()
    d2.categories = ["Respect", "Laughter", "Enjoyment", "Rested", "Learned"]
    d2.add_series("Daily positive experiences (%)", (88, 73, 73, 72, 52))
    c2 = s.shapes.add_chart(XL_CHART_TYPE.BAR_CLUSTERED, Inches(7.2), Inches(2.45), Inches(5.4), Inches(3.95), d2).chart
    style_chart(c2)
    c2.value_axis.maximum_scale = 100
    for pt in c2.series[0].points:
        pt.format.fill.solid()
        pt.format.fill.fore_color.rgb = BLUE
        pt.format.line.color.rgb = BLUE

    add_source(s, "Gallup State of the World's Emotional Health (2024)")


def slide_4_metacognition(prs, idx, total):
    s = prs.slides.add_slide(prs.slide_layouts[6])
    set_bg(s)
    add_header(s, idx, total)
    add_title(s, "Metacognition", "Converting unobserved emotion loops into monitored choices")

    add_panel(s, Inches(0.75), Inches(2.05), Inches(8.1), Inches(4.8))
    d = CategoryChartData()
    d.categories = ["Worry load", "Stress load", "Learning signal", "Affect-label lever"]
    d.add_series("Issue/lever index", (39, 37, 52, 60))
    c = s.shapes.add_chart(XL_CHART_TYPE.COLUMN_CLUSTERED, Inches(1.05), Inches(2.45), Inches(7.55), Inches(3.95), d).chart
    style_chart(c)
    c.value_axis.maximum_scale = 65
    colors = [ACCENT_DIM, ACCENT_DIM, BLUE, GREEN]
    for i, pt in enumerate(c.series[0].points):
        pt.format.fill.solid()
        pt.format.fill.fore_color.rgb = colors[i]
        pt.format.line.color.rgb = colors[i]

    add_panel(s, Inches(9.1), Inches(2.05), Inches(3.7), Inches(4.8), alt=True)
    add_story_lines(
        s,
        Inches(9.4),
        Inches(2.45),
        Inches(3.2),
        Inches(3.9),
        [
            "How Stillform applies this:",
            "Pulse emotion labeling trains state naming (affect labeling).",
            "Reframe then converts state awareness into action selection.",
            "Measured by pre/post composure delta trends over sessions.",
        ],
        first_size=16,
        body_size=13,
    )
    add_source(s, "Flavell 1979; Lieberman 2007; Torre & Lieberman 2018")


def slide_5_eq(prs, idx, total):
    s = prs.slides.add_slide(prs.slide_layouts[6])
    set_bg(s)
    add_header(s, idx, total)
    add_title(s, "EQ + Microbias Conflict", "Reducing projection and attribution errors before they escalate")

    add_panel(s, Inches(0.75), Inches(2.05), Inches(8.1), Inches(4.8))
    d = CategoryChartData()
    d.categories = ["Overread low", "Overread high", "Daily anger", "Daily sadness"]
    d.add_series("Range / prevalence (%)", (20, 30, 22, 26))
    c = s.shapes.add_chart(XL_CHART_TYPE.COLUMN_CLUSTERED, Inches(1.05), Inches(2.45), Inches(7.55), Inches(3.95), d).chart
    style_chart(c)
    c.value_axis.maximum_scale = 35
    for i, pt in enumerate(c.series[0].points):
        clr = [BLUE, BLUE, ACCENT_DIM, ACCENT_DIM][i]
        pt.format.fill.solid()
        pt.format.fill.fore_color.rgb = clr
        pt.format.line.color.rgb = clr

    add_panel(s, Inches(9.1), Inches(2.05), Inches(3.7), Inches(4.8), alt=True)
    add_story_lines(
        s,
        Inches(9.4),
        Inches(2.45),
        Inches(3.2),
        Inches(3.9),
        [
            "How Stillform applies this:",
            "Bio-filter marks depleted state before interpretation.",
            "Reframe checks one microbias at a time (projection, attribution, contagion, impact gap, intensity).",
            "Target outcome: fewer avoidable social conflicts.",
        ],
        first_size=16,
        body_size=13,
    )
    add_source(s, "Stillform science sheet (microbias section); Nature Communications 2025")


def slide_6_impulsivity(prs, idx, total):
    s = prs.slides.add_slide(prs.slide_layouts[6])
    set_bg(s)
    add_header(s, idx, total)
    add_title(s, "Impulsivity Under Load", "Interrupting fast-state reaction chains")

    add_panel(s, Inches(0.75), Inches(2.05), Inches(6.0), Inches(4.8))
    d1 = CategoryChartData()
    d1.categories = ["2011 baseline", "2019 level"]
    d1.add_series("Riots/strikes/anti-gov demos index", (100, 344))
    c1 = s.shapes.add_chart(XL_CHART_TYPE.COLUMN_CLUSTERED, Inches(1.0), Inches(2.45), Inches(5.55), Inches(3.95), d1).chart
    style_chart(c1)
    c1.value_axis.maximum_scale = 360
    for pt in c1.series[0].points:
        pt.format.fill.solid()
        pt.format.fill.fore_color.rgb = ACCENT_DIM
        pt.format.line.color.rgb = ACCENT_DIM

    add_panel(s, Inches(6.95), Inches(2.05), Inches(5.85), Inches(4.8), alt=True)
    d2 = CategoryChartData()
    d2.categories = ["Stress", "Worry"]
    d2.add_series("Daily pressure prevalence (%)", (37, 39))
    c2 = s.shapes.add_chart(XL_CHART_TYPE.COLUMN_CLUSTERED, Inches(7.2), Inches(2.45), Inches(2.7), Inches(3.95), d2).chart
    style_chart(c2)
    c2.value_axis.maximum_scale = 45
    for pt in c2.series[0].points:
        pt.format.fill.solid()
        pt.format.fill.fore_color.rgb = BLUE
        pt.format.line.color.rgb = BLUE

    add_story_lines(
        s,
        Inches(10.2),
        Inches(2.45),
        Inches(2.45),
        Inches(3.9),
        [
            "How Stillform applies this:",
            "Somatic interrupt catches body escalation during Reframe.",
            "Default pathway routing removes decision delay in high arousal.",
            "Measured by faster stabilization and stronger post-shift scores.",
        ],
        first_size=15,
        body_size=12.5,
    )
    add_source(s, "Gallup 2025 contextual trend references; Stillform intervention flow")


def slide_7_how_it_works(prs, idx, total):
    s = prs.slides.add_slide(prs.slide_layouts[6])
    set_bg(s)
    add_header(s, idx, total)
    add_title(s, "How Stillform Works", "Applied science translated into one daily operating loop")

    steps = [
        ("State capture", "Morning check-in + bio-filter"),
        ("Interrupt", "Breathe / Body Scan / somatic cue"),
        ("Reframe", "Structured cognitive shift + microbias check"),
        ("Rate shift", "Non-skippable post-session state rating"),
        ("Close loop", "EOD check-in feeds next-day context"),
    ]
    x0, y, w, h, gap = Inches(0.72), Inches(2.35), Inches(2.45), Inches(2.95), Inches(0.1)
    for i, (name, desc) in enumerate(steps):
        add_panel(s, x0 + i * (w + gap), y, w, h, alt=i % 2 == 1)
        t = s.shapes.add_textbox(x0 + i * (w + gap) + Inches(0.15), y + Inches(0.18), Inches(2.1), Inches(0.5))
        tp = t.text_frame.paragraphs[0]
        tr = tp.add_run()
        tr.text = name
        tr.font.name = FONT
        tr.font.size = Pt(15)
        tr.font.bold = True
        tr.font.color.rgb = ACCENT
        b = s.shapes.add_textbox(x0 + i * (w + gap) + Inches(0.15), y + Inches(0.86), Inches(2.1), Inches(1.95))
        bp = b.text_frame.paragraphs[0]
        br = bp.add_run()
        br.text = desc
        br.font.name = FONT
        br.font.size = Pt(13)
        br.font.color.rgb = TEXT
    add_source(s, "Stillform App.jsx: morning/EOD loops, post-rating, and mode routing")


def slide_8_telemetry(prs, idx, total):
    s = prs.slides.add_slide(prs.slide_layouts[6])
    set_bg(s)
    add_header(s, idx, total)
    add_title(s, "Telemetry Proof", "If applied science is real, it must show up in measured signals")

    add_panel(s, Inches(0.75), Inches(2.05), Inches(8.1), Inches(4.8))
    d = CategoryChartData()
    d.categories = ["Pre/post delta", "Loop completion 14d", "Nudge recovery 14d", "Reliability score", "Tool efficacy"]
    d.add_series("Signal coverage index", (100, 100, 100, 100, 100))
    c = s.shapes.add_chart(XL_CHART_TYPE.COLUMN_CLUSTERED, Inches(1.05), Inches(2.45), Inches(7.55), Inches(3.95), d).chart
    style_chart(c)
    c.value_axis.maximum_scale = 110
    for pt in c.series[0].points:
        pt.format.fill.solid()
        pt.format.fill.fore_color.rgb = ACCENT
        pt.format.line.color.rgb = ACCENT

    add_panel(s, Inches(9.1), Inches(2.05), Inches(3.7), Inches(4.8), alt=True)
    add_story_lines(
        s,
        Inches(9.4),
        Inches(2.45),
        Inches(3.2),
        Inches(3.9),
        [
            "How Stillform proves effect:",
            "Reliability score = (loop completion x 0.65) + (nudge recovery x 0.35).",
            "Decision window: rolling 14 days.",
            "Telemetry horizon: 12 weeks.",
        ],
        first_size=15,
        body_size=12.5,
    )
    add_source(s, "Stillform App.jsx reliabilityScore and telemetry blocks")


def slide_9_close(prs, idx, total):
    s = prs.slides.add_slide(prs.slide_layouts[6])
    set_bg(s)
    add_header(s, idx, total)
    add_title(s, "Executive Thesis", "Applied science mapped to execution")
    add_panel(s, Inches(0.9), Inches(2.2), Inches(11.55), Inches(4.25))
    add_story_lines(
        s,
        Inches(1.25),
        Inches(2.65),
        Inches(10.9),
        Inches(3.5),
        [
            "Stillform is a composure system for everyone.",
            "Its value is not inspirational content; it is measurable state-to-action transfer under pressure.",
            "The deck's visuals matter only because each one ties directly to a mechanism and a telemetry proof signal.",
            "The release standard is simple: if the mechanism is not measurable, it is not ready to claim.",
        ],
        first_size=29,
        body_size=20,
    )
    add_source(s, "Stillform applied science model and release integrity principles")


def build():
    prs = Presentation()
    prs.slide_width = SLIDE_W
    prs.slide_height = SLIDE_H
    total = 9

    slide_1_definition(prs, 1, total)
    slide_2_why_visuals(prs, 2, total)
    slide_3_global_context(prs, 3, total)
    slide_4_metacognition(prs, 4, total)
    slide_5_eq(prs, 5, total)
    slide_6_impulsivity(prs, 6, total)
    slide_7_how_it_works(prs, 7, total)
    slide_8_telemetry(prs, 8, total)
    slide_9_close(prs, 9, total)

    out = Path(__file__).resolve().parents[1] / "public" / "Stillform_Executive_Deck.pptx"
    out.parent.mkdir(parents=True, exist_ok=True)
    prs.save(out)
    print(f"Wrote {out}")


if __name__ == "__main__":
    build()
