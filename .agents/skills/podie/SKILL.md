---
name: podie
description: Search, retrieve, and install UI components and templates from the PODIE library using the podie MCP server. Use whenever the user asks for PODIE components, modern animated UI, cards, inputs, carousels, or design templates.
---

# PODIE Component Library Skill

Use the `podie` MCP tools to find and integrate components from PODIE.

## Tools Available
1. `podie.search_catalog`: Search components and templates with keywords and category filters.
2. `podie.recommend_ui`: Get considered recommendations based on project stack and design needs.
3. `podie.get_component`: Retrieve raw component source code and file structure.
4. `podie.get_install_plan`: Get exact `shadcn add` installation command and instructions for the project's package manager.
5. `podie.report_installation`: Report installation status if telemetry was requested.

## Guidelines
- Inspect the local stack and design first (ReactJS, Tailwind CSS, Lucide / Phosphor icons, Framer Motion, GSAP).
- Keep private source code and secrets local. Send only high-level UI briefs when searching.
- Execute installation only under user instructions, convert any `.tsx` to clean `.jsx` to keep the codebase pure ReactJS, and verify with `npm run build`.
