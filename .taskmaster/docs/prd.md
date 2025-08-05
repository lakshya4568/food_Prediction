
# Updated PRD – Feature Expansion (CI/CD \& Security Testing Deferred)

Below is a focused backlog to extend NutriVision’s **UI, routing, and AI-driven nutrition intelligence** while keeping the existing food-detection pipeline untouched. Each *big task* is followed by its *smaller, actionable subtasks* and a **priority tag** (P0 = must, P1 = should, P2 = nice-to-have).

## 1. Global Health Context Engine *(P0)*

- Design user profile schema to store age, gender, activity level, allergies, and chronic conditions.
- Build middleware to inject profile data into every nutrition API request.
- Implement adaptive portion / nutrient targets derived from WHO \& ICMR guidelines.


## 2. Multi-Route Frontend Expansion *(P0)*

- Add `/dashboard`, `/planner`, `/grocery`, `/health-docs`, `/settings` React Router routes.
- Create lazy-loaded page bundles with `React.lazy` + Suspense skeletons.
- Protect routes with basic auth guard (localStorage token).


## 3. Micro-Interaction Library *(P1)*

- Animate file-drop zones with Tailwind `scale-in` and shimmer loaders.
- Add haptic-like button feedback (`active:translate-y-1`) for mobile.
- Show contextual toast confirmations via Radix UI or custom hook.


## 4. Nutrition API Integration Layer *(P0)*

- Wrap USDA FoodData Central + Edamam Micronutrients in a single `/nutri` backend endpoint.
- Cache frequent look-ups in Redis for 1 h to cut latency.
- Normalize responses to common macro/micro JSON schema.


## 5. Health Rating Algorithm *(P1)*

- Develop scoring formula combining calories, macros, sodium, and user goals.
- Return grade (A-E) plus color code to frontend.
- Expose `/rating` endpoint consumed by meal cards.


## 6. Medical Document Uploader \& Parser *(P0)*

- Build drag-and-drop PDF/PNG uploader capped at 10 MB.
- Use OCR (Tesseract via WASM) for images; pdfminer for PDFs.
- Pipe extracted text to Gemini function for key medical entities (diagnoses, meds).
- Store structured JSON (FHIR-lite) in user profile.


## 7. Seamless Food-Detection Bridging *(P0)*

- Keep existing ViT endpoint path unchanged.
- On successful classify, automatically chain to Nutrition API and Health Rating and unify response.
- Emit consolidated JSON to UI: `{food, macros, micros, rating, flags}`.


## 8. Grocery List Generator v2 *(P1)*

- Aggregate ingredients across scheduled meals for the week.
- Group by aisle and optimize quantities (kg, g).
- Offer export to CSV and shareable link.


## 9. Offline-First Enhancements *(P2)*

- Cache health-doc parse results in IndexedDB.
- Queue failed `/nutri` \& `/rating` posts for background sync.


## 10. UX Polish \& Accessibility Sweep *(P1)*

- Audit color contrast on new pages; tweak Tailwind palette where needed.
- Implement keyboard navigation for uploader and planner grids.
- Add ARIA live regions for loading states.


### Next Steps

1. Sprint-plan P0 items first (Tasks 1, 2, 4, 6, 7).
2. Parallelize frontend and backend squads on shared API contracts.
3. Reserve a design pass for Task 3 \& 10 once core flows stabilize.

This roadmap keeps engineering tightly scoped to *feature growth* while postponing CI/CD and security testing for a future phase.

<div style="text-align: center">⁂</div>

[^1]: eslint.config.js

[^2]: index.html

[^3]: package.json

[^4]: package-lock.json

[^5]: postcss.config.js

[^6]: README.md

[^7]: tailwind.config.js

[^8]: vite.config.js

