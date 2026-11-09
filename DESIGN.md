---
version: alpha
name: Quiztide
description: Design language for Quiztide.
colors:
  page-default: "#FFFFFF"
  surface-default: "#FFFFFF"
  surface-subtle: "#F5F5F5"
  fill-default: "#FFFFFF"
  fill-subtle: "#FAFAFA"
  fill-strong: "#F5F5F5"
  fill-inverse: "#151515"
  fill-accent: "#E5F0FF"
  content-primary: "#151515"
  content-secondary: "#757575"
  content-muted: "#A5A5A5"
  content-extra-muted: "#E5E5E5"
  content-inverse: "#FFFFFF"
  content-accent: "#1F78FF"
  color-line-default: "#EDEDED"
typography:
  mono:
    fontFamily: JetBrains Mono
  sans:
    fontFamily: Inter Variable
  h1:
    className: type-h1
    fontFamily: Inter Variable
    fontSize: text-4xl
    fontWeight: 450
    lineHeight: leading-tight
    letterSpacing: tracking-tight
  h2:
    className: type-h2
    fontFamily: Inter Variable
    fontSize: text-xl
    fontWeight: 450
    lineHeight: leading-tight
    letterSpacing: tracking-tight
  bodyMd:
    className: type-body-md
    fontFamily: Inter Variable
    fontSize: text-sm
    fontWeight: 400
    lineHeight: leading-normal
    letterSpacing: tracking-normal
  bodySm:
    className: type-body-sm
    fontFamily: Inter Variable
    fontSize: text-xs
    fontWeight: 400
    lineHeight: leading-normal
    letterSpacing: tracking-normal
  code:
    className: type-code
    fontFamily: JetBrains Mono
    fontSize: text-xs
    fontWeight: 400
    lineHeight: leading-normal
    letterSpacing: tracking-normal
---

## Overview

Quiet, editorial, and code-first. Quiztide should feel like a precise editorial assessment tool, not a noisy marketing site.

## Colors

- Use `page-default` for the page background and `surface-default` for standard surfaces.
- Use `surface-subtle`, `fill-subtle`, and `fill-strong` for restrained surface contrast.
- Use `content-primary`, `content-secondary`, `content-muted`, and `content-extra-muted` for text hierarchy.
- Use `color-line-default` for borders and dividers.
- Use `fill-inverse` and `content-inverse` for inverse controls and surfaces.
- Use `fill-accent` and `content-accent` for accent states.

## Typography

- Use Inter Variable for interface copy.
- Use JetBrains Mono for commands, code, counters, and technical identifiers.
- Use `text-4xl`, weight 450, `leading-tight`, and `tracking-tight` for H1.
- Use `text-xl`, weight 450, `leading-tight`, and `tracking-tight` for H2.
- Use `text-sm`, weight 400, `leading-normal`, and `tracking-normal` for body md.
- Use `text-xs`, weight 400, `leading-normal`, and `tracking-normal` for body sm.
- Use `text-xs`, weight 400, `leading-normal`, and `tracking-normal` for code.
- Use sentence case for labels and links.

## Layout

- Centered framed container with subtle borders.
- Center content, fill available width, and apply responsive padding.
- Use generous vertical spacing and light section boundaries.
- Use responsive grids for collections.
- Keep mobile padding consistent.

## Elevation & Depth

- Use white surfaces with `shadow-2xs`.
- On larger screens, use hairline borders `1px solid #EDEDED`.
- Keep elevation subtle.

## Shapes

- Use restrained rounded corners for cards, controls, dialogs, and code blocks.
- Use `fill-subtle` and `fill-strong` for hover states.

## Components

- Website buttons use primary, secondary, and ghost variants. Primary uses `fill-inverse` with `content-inverse`; secondary uses `fill-default`, `line-default`, and `fill-subtle` on hover; ghost uses `fill-strong` and switches from `content-secondary` to `content-primary` on hover.
- Scale on press feedback on buttons and options.
- Search uses a focused bar with keyboard navigation (`/`) and a clear empty state.

## Do's and Don'ts

- Provide visible focus states.
- Respect reduced motion.
- Give empty states one clear action.
- Do not use glow, gradients, or decorative color when neutral styling is sufficient.
