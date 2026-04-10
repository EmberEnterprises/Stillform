#!/usr/bin/env python3
"""Generate a visual-first executive deck with sourced data charts."""

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

BG = RGBColor(10, 13, 19)
SURFACE = RGBColor(18, 24, 34)
SURFACE_ALT = RGBColor(24, 31, 43)
LINE = RGBColor(54, 63, 79)
TEXT = RGBColor(236, 240, 245)
TEXT_DIM = RGBColor(166, 176, 191)
ACCENT = RGBColor(235, 171, 74)
BLUE = RGBColor(94, 153, 244)
GREEN = RGBColor(99, 191, 147)
RED = RGBColor(215, 96, 96)
PURPLE = RGBColor(159, 122, 234)

FONT = "Calibri"
MONO = "Consolas"
TITLE_SIZE = Pt(42)
SUBTITLE_SIZE = Pt(16)
BODY_SIZE = Pt(16)
SOURCE_SIZE = Pt(9)


def set_bg(slide):
    fill = slide.background.fill
    fill.solid()
    fill.fore_color.rgb = BG


def add_header(slide, idx, total, kicker="STILLFORM · EXECUTIVE BRIEF"):
    bar = slide.shapes.add_shape(MSO_AUTO_SHAPE_TYPE.RECTANGLE, Inches(0), Inches(0), SLIDE_W, Inches(0.38))
    bar.fill.solid()
    bar.fill.fore_color.rgb = SURFACE
    bar.line.fill.background()

    k = slide.shapes.add_textbox(Inches(0.55), Inches(0.12), Inches(8.0), Inches(0.2))
    p = k.text_frame.paragraphs[0]
    r = p.add_run()
    r.text = kicker
    r.font.name = MONO
    r.font.size = Pt(9)
    r.font.color.rgb = ACCENT

    n = slide.shapes.add_textbox(Inches(11.2), Inches(0.12), Inches(1.6), Inches(0.2))
    p2 = n.text_frame.paragraphs[0]
    p2.alignment = PP_ALIGN.RIGHT
    r2 = p2.add_run()
    r2.text = f"{idx:02d} / {total:02d}"
    r2.font.name = MONO
    r2.font.size = Pt(9)
    r2.font.color.rgb = TEXT_DIM


def add_title(slide, title, subtitle):
    t = slide.shapes.add_textbox(Inches(0.7), Inches(0.72), Inches(12.0), Inches(1.15))
    p = t.text_frame.paragraphs[0]
    r = p.add_run()
    r.text = title
    r.font.name = FONT
    r.font.size = TITLE_SIZE
    r.font.bold = True
    r.font.color.rgb = TEXT

    s = slide.shapes.add_textbox(Inches(0.74), Inches(1.62), Inches(11.9), Inches(0.45))
    sp = s.text_frame.paragraphs[0]
    sr = sp.add_run()
    sr.text = subtitle
    sr.font.name = FONT
    sr.font.size = SUBTITLE_SIZE
    sr.font.color.rgb = TEXT_DIM


def add_source(slide, text):
    box = slide.shapes.add_textbox(Inches(0.75), Inches(7.07), Inches(12.0), Inches(0.24))
    p = box.text_frame.paragraphs[0]
    r = p.add_run()
    r.text = f"Source: {text}"
    r.font.name = MONO
    r.font.size = SOURCE_SIZE
    r.font.color.rgb = TEXT_DIM


def add_card(slide, x, y, w, h):
    card = slide.shapes.add_shape(MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE, x, y, w, h)
    card.fill.solid()
    card.fill.fore_color.rgb = SURFACE
    card.line.color.rgb = LINE
    card.line.width = Pt(1.2)
    return card


def style_chart(chart):
    chart.has_legend = True
    chart.legend.position = XL_LEGEND_POSITION.BOTTOM
    chart.legend.include_in_layout = False
    chart.legend.font.name = FONT
    chart.legend.font.size = Pt(11)
    chart.legend.font.color.rgb = TEXT_DIM

    if chart.category_axis:
        chart.category_axis.tick_labels.font.name = FONT
        chart.category_axis.tick_labels.font.size = Pt(11)
        chart.category_axis.tick_labels.font.color.rgb = TEXT_DIM

    if chart.value_axis:
        chart.value_axis.tick_labels.font.name = FONT
        chart.value_axis.tick_labels.font.size = Pt(11)
        chart.value_axis.tick_labels.font.color.rgb = TEXT_DIM
        chart.value_axis.has_major_gridlines = True
        chart.value_axis.major_gridlines.format.line.color.rgb = LINE


def add_kpi(slide, x, y, label, value, color=ACCENT):
    box = slide.shapes.add_textbox(x, y, Inches(2.8), Inches(1.6))
    tf = box.text_frame
    p1 = tf.paragraphs[0]
    p1.alignment = PP_ALIGN.LEFT
    r1 = p1.add_run()
    r1.text = label.upper()
    r1.font.name = MONO
    r1.font.size = Pt(10)
    r1.font.color.rgb = TEXT_DIM

    p2 = tf.add_paragraph()
    p2.alignment = PP_ALIGN.LEFT
    r2 = p2.add_run()
    r2.text = value
    r2.font.name = FONT
    r2.font.size = Pt(38)
    r2.font.bold = True
    r2.font.color.rgb = color


def slide_cover(prs, idx, total):
    s = prs.slides.add_slide(prs.slide_layouts[6])
    set_bg(s)
    add_header(s, idx, total)
    add_title(
        s,
        "Stillform Executive Deck",
        "Graph-first strategic view with externally sourced benchmarks",
    )
    add_card(s, Inches(0.82), Inches(2.28), Inches(12.0), Inches(3.95))

    bullets = [
        "Composure as preventive risk management, not passive wellness content.",
        "Audience is everyone: high-stakes leaders, parents, students, and teams.",
        "Every quantitative claim on this deck is source-tagged.",
    ]
    body = s.shapes.add_textbox(Inches(1.15), Inches(2.8), Inches(11.2), Inches(2.9))
    tf = body.text_frame
    tf.word_wrap = True
    for i, line in enumerate(bullets):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.text = line
        p.font.name = FONT
        p.font.size = Pt(22)
        p.font.color.rgb = TEXT
        p.space_after = Pt(10)

    add_source(s, "Deck compiled from Gallup, WHO, OneSignal, Frontiers (2023-2025)")


def slide_global_distress(prs, idx, total):
    s = prs.slides.add_slide(prs.slide_layouts[6])
    set_bg(s)
    add_header(s, idx, total)
    add_title(s, "Global Emotional Load", "Daily distress indicators remain elevated worldwide")

    add_card(s, Inches(0.75), Inches(2.08), Inches(8.05), Inches(4.65))
    data = CategoryChartData()
    data.categories = ["Worry", "Stress", "Physical pain", "Sadness", "Anger"]
    data.add_series("Global adults (%)", (39, 37, 32, 26, 22))

    chart = s.shapes.add_chart(
        XL_CHART_TYPE.BAR_CLUSTERED,
        Inches(1.05),
        Inches(2.45),
        Inches(7.45),
        Inches(3.95),
        data,
    ).chart
    style_chart(chart)
    chart.has_legend = False
    series = chart.series[0]
    series.format.fill.solid()
    series.format.fill.fore_color.rgb = ACCENT
    series.format.line.color.rgb = ACCENT
    chart.value_axis.maximum_scale = 45

    add_card(s, Inches(9.05), Inches(2.08), Inches(3.55), Inches(4.65))
    add_kpi(s, Inches(9.35), Inches(2.45), "Worry", "39%", RED)
    add_kpi(s, Inches(9.35), Inches(3.72), "Stress", "37%", ACCENT)
    add_kpi(s, Inches(9.35), Inches(4.99), "Pain", "32%", BLUE)

    add_source(s, "Gallup State of the World's Emotional Health (2024 global survey)")


def slide_who_need(prs, idx, total):
    s = prs.slides.add_slide(prs.slide_layouts[6])
    set_bg(s)
    add_header(s, idx, total)
    add_title(s, "Clinical Need at Scale", "Population burden is large; care access remains constrained")

    add_card(s, Inches(0.75), Inches(2.08), Inches(5.35), Inches(4.65))
    add_kpi(s, Inches(1.08), Inches(2.45), "People living with mental disorder", "1.1B", ACCENT)
    k2 = s.shapes.add_textbox(Inches(1.1), Inches(4.35), Inches(4.7), Inches(1.6))
    p2 = k2.text_frame.paragraphs[0]
    r2 = p2.add_run()
    r2.text = "Nearly 1 in 7 globally"
    r2.font.name = FONT
    r2.font.size = Pt(26)
    r2.font.bold = True
    r2.font.color.rgb = TEXT

    data = CategoryChartData()
    data.categories = ["Anxiety", "Depression", "Bipolar", "Schizophrenia"]
    data.add_series("People affected (millions)", (359, 280, 37, 23))
    add_card(s, Inches(6.35), Inches(2.08), Inches(6.45), Inches(4.65))
    chart = s.shapes.add_chart(
        XL_CHART_TYPE.COLUMN_CLUSTERED,
        Inches(6.65),
        Inches(2.45),
        Inches(5.9),
        Inches(3.95),
        data,
    ).chart
    style_chart(chart)
    chart.has_legend = False
    series = chart.series[0]
    series.format.fill.solid()
    series.format.fill.fore_color.rgb = BLUE
    series.format.line.color.rgb = BLUE

    add_source(s, "WHO Mental Disorders Fact Sheet (2021 prevalence; updated 2025)")


def slide_retention(prs, idx, total):
    s = prs.slides.add_slide(prs.slide_layouts[6])
    set_bg(s)
    add_header(s, idx, total)
    add_title(s, "Behavioral Retention Curve", "Steep decay from day 1 to day 30 in mobile usage")

    add_card(s, Inches(0.75), Inches(2.08), Inches(12.05), Inches(4.65))
    data = CategoryChartData()
    data.categories = ["Day 1", "Day 7", "Day 30"]
    data.add_series("Overall apps", (28.29, 17.86, 7.88))
    data.add_series("Health & fitness", (28.00, 18.13, 8.48))
    chart = s.shapes.add_chart(
        XL_CHART_TYPE.LINE_MARKERS,
        Inches(1.15),
        Inches(2.45),
        Inches(11.25),
        Inches(3.95),
        data,
    ).chart
    style_chart(chart)
    chart.value_axis.maximum_scale = 32
    chart.value_axis.minimum_scale = 0

    s1 = chart.series[0]
    s1.format.line.color.rgb = RED
    s1.format.line.width = Pt(2.6)
    s1.marker.style = 2
    s1.marker.size = 7
    s1.marker.format.fill.solid()
    s1.marker.format.fill.fore_color.rgb = RED

    s2 = chart.series[1]
    s2.format.line.color.rgb = GREEN
    s2.format.line.width = Pt(2.6)
    s2.marker.style = 2
    s2.marker.size = 7
    s2.marker.format.fill.solid()
    s2.marker.format.fill.fore_color.rgb = GREEN

    add_source(s, "OneSignal Mobile App Benchmarks 2024")


def slide_care_gap(prs, idx, total):
    s = prs.slides.add_slide(prs.slide_layouts[6])
    set_bg(s)
    add_header(s, idx, total)
    add_title(s, "Formal Care Coverage Gap", "Most people with high-burden conditions are untreated")

    add_card(s, Inches(0.75), Inches(2.08), Inches(8.0), Inches(4.65))
    data = CategoryChartData()
    data.categories = ["Psychosis", "Depression"]
    data.add_series("Formal care", (29, 33))
    data.add_series("No formal care", (71, 67))
    chart = s.shapes.add_chart(
        XL_CHART_TYPE.COLUMN_STACKED,
        Inches(1.05),
        Inches(2.45),
        Inches(7.4),
        Inches(3.95),
        data,
    ).chart
    style_chart(chart)
    chart.value_axis.maximum_scale = 100

    c1 = chart.series[0]
    c1.format.fill.solid()
    c1.format.fill.fore_color.rgb = GREEN
    c1.format.line.color.rgb = GREEN
    c2 = chart.series[1]
    c2.format.fill.solid()
    c2.format.fill.fore_color.rgb = RED
    c2.format.line.color.rgb = RED

    add_card(s, Inches(9.05), Inches(2.08), Inches(3.75), Inches(4.65))
    txt = s.shapes.add_textbox(Inches(9.35), Inches(2.45), Inches(3.2), Inches(3.9))
    tf = txt.text_frame
    tf.word_wrap = True
    lines = [
        "Coverage is the strategic hole.",
        "High-burden conditions still show majority untreated.",
        "Preventive systems should lower load before escalation.",
    ]
    for i, line in enumerate(lines):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.text = line
        p.font.name = FONT
        p.font.size = Pt(18)
        p.font.color.rgb = TEXT
        p.space_after = Pt(8)

    add_source(s, "WHO Mental Disorders Fact Sheet; Mental Health Atlas references")


def slide_effect_sizes(prs, idx, total):
    s = prs.slides.add_slide(prs.slide_layouts[6])
    set_bg(s)
    add_header(s, idx, total)
    add_title(s, "Mechanism Evidence (mHealth Reappraisal)", "Measured effect sizes are positive, moderate, and actionable")

    add_card(s, Inches(0.75), Inches(2.08), Inches(8.05), Inches(4.65))
    data = CategoryChartData()
    data.categories = ["Overall mental health", "Anxiety symptoms", "Depressive symptoms"]
    data.add_series("SMD (Hedges g)", (0.34, 0.33, 0.51))
    chart = s.shapes.add_chart(
        XL_CHART_TYPE.COLUMN_CLUSTERED,
        Inches(1.05),
        Inches(2.45),
        Inches(7.45),
        Inches(3.95),
        data,
    ).chart
    style_chart(chart)
    chart.has_legend = False
    chart.value_axis.maximum_scale = 0.6
    chart.value_axis.minimum_scale = 0

    series = chart.series[0]
    for i, point in enumerate(series.points):
        point.format.fill.solid()
        point.format.fill.fore_color.rgb = [BLUE, GREEN, PURPLE][i]
        point.format.line.color.rgb = [BLUE, GREEN, PURPLE][i]

    add_card(s, Inches(9.05), Inches(2.08), Inches(3.75), Inches(4.65))
    add_kpi(s, Inches(9.35), Inches(2.45), "RCTs", "30", ACCENT)
    add_kpi(s, Inches(9.35), Inches(3.72), "Participants", "3,904", TEXT)
    add_kpi(s, Inches(9.35), Inches(4.99), "Year", "2023", BLUE)

    add_source(s, "Frontiers in Digital Health (Kunzler et al., 2023; DOI 10.3389/fdgth.2023.1253390)")


def slide_operating_loop(prs, idx, total):
    s = prs.slides.add_slide(prs.slide_layouts[6])
    set_bg(s)
    add_header(s, idx, total)
    add_title(s, "Stillform Operating Loop", "Designed for continuity, not one-off motivation")

    steps = [
        ("1", "Morning baseline", BLUE),
        ("2", "State detection", GREEN),
        ("3", "Right intervention", ACCENT),
        ("4", "Post-shift rating", PURPLE),
        ("5", "Evening closure", RED),
    ]
    start_x = Inches(0.75)
    y = Inches(2.55)
    w = Inches(2.35)
    h = Inches(2.55)
    gap = Inches(0.14)
    for i, (num, label, color) in enumerate(steps):
        x = start_x + i * (w + gap)
        card = add_card(s, x, y, w, h)
        card.line.color.rgb = color
        n = s.shapes.add_textbox(x + Inches(0.16), y + Inches(0.14), Inches(0.5), Inches(0.4))
        np = n.text_frame.paragraphs[0]
        nr = np.add_run()
        nr.text = num
        nr.font.name = FONT
        nr.font.size = Pt(22)
        nr.font.bold = True
        nr.font.color.rgb = color
        t = s.shapes.add_textbox(x + Inches(0.16), y + Inches(0.75), Inches(2.0), Inches(1.6))
        tp = t.text_frame.paragraphs[0]
        tr = tp.add_run()
        tr.text = label
        tr.font.name = FONT
        tr.font.size = Pt(18)
        tr.font.bold = True
        tr.font.color.rgb = TEXT

        if i < len(steps) - 1:
            arrow = s.shapes.add_shape(
                MSO_AUTO_SHAPE_TYPE.CHEVRON,
                x + w - Inches(0.01),
                y + Inches(1.02),
                Inches(0.16),
                Inches(0.48),
            )
            arrow.fill.solid()
            arrow.fill.fore_color.rgb = TEXT_DIM
            arrow.line.fill.background()

    add_card(s, Inches(0.75), Inches(5.35), Inches(12.05), Inches(1.34))
    note = s.shapes.add_textbox(Inches(1.0), Inches(5.67), Inches(11.5), Inches(0.8))
    p = note.text_frame.paragraphs[0]
    r = p.add_run()
    r.text = "Core rule: composure is trained as a daily system behavior, not a one-time app event."
    r.font.name = FONT
    r.font.size = Pt(22)
    r.font.color.rgb = TEXT

    add_source(s, "Internal product architecture (loop-based intervention system)")


def slide_close(prs, idx, total):
    s = prs.slides.add_slide(prs.slide_layouts[6])
    set_bg(s)
    add_header(s, idx, total)
    add_title(s, "Closing", "What this deck proves")
    add_card(s, Inches(0.9), Inches(2.2), Inches(11.55), Inches(4.2))

    lines = [
        "1) The need is real and global.",
        "2) The care gap is structural.",
        "3) The mechanism has measurable efficacy.",
        "4) The product is built as a continuity loop for everyone.",
    ]
    txt = s.shapes.add_textbox(Inches(1.35), Inches(2.75), Inches(10.7), Inches(3.35))
    tf = txt.text_frame
    tf.word_wrap = True
    for i, line in enumerate(lines):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.text = line
        p.font.name = FONT
        p.font.size = Pt(30)
        p.font.bold = True
        p.font.color.rgb = TEXT
        p.space_after = Pt(10)

    add_source(s, "Compiled from Gallup, WHO, OneSignal, Frontiers (full citations in slide footers)")


def build():
    prs = Presentation()
    prs.slide_width = SLIDE_W
    prs.slide_height = SLIDE_H
    total = 8

    slide_cover(prs, 1, total)
    slide_global_distress(prs, 2, total)
    slide_who_need(prs, 3, total)
    slide_retention(prs, 4, total)
    slide_care_gap(prs, 5, total)
    slide_effect_sizes(prs, 6, total)
    slide_operating_loop(prs, 7, total)
    slide_close(prs, 8, total)

    out = Path(__file__).resolve().parents[1] / "public" / "Stillform_Executive_Deck.pptx"
    out.parent.mkdir(parents=True, exist_ok=True)
    prs.save(out)
    print(f"Wrote {out}")


if __name__ == "__main__":
    build()
