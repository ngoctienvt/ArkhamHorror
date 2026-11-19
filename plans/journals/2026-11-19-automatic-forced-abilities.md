---
title: Automatic Forced abilities
date: 2026-11-19
summary: Auto-activate mandatory Forced abilities and show consequence-only log entries
---

# Automatic Forced abilities

Forced abilities now auto-activate independently of the optional autopilot setting. Engine unskippable-window metadata identifies conditional mandatory reactions. Multiple triggers still ask for order. Consequence automation uses the existing default-enabled policy; with autopilot disabled those acknowledgements can remain manual. Display filters standalone Forced activation announcements, preserving consequences and original stream/cursors/undo. Regression baseline failed as expected; final 71 related tests pass. Full npm test was interrupted during slow unrelated Vite SSR tests; no full-suite success claimed. Reviewer caught persistent Forced-state leakage; removed that state and added next-round encounter regression. No commit or service started.

> Historical work record — not durable authority. Prefer docs/specs/ADRs for current decisions.
