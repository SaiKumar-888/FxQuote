# OpenFX Assignment

How to run
1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Build app: `npm run build`


Key design decisions
- Built as a route-based flow (`/quote`, `/confirm`, `/status`) to keep each screen focused and reduce prop drilling.
- Used TanStack Query for API state management:
  - manual quote fetch on button click,
  - mutation for payment submit,
  - polling for transaction status updates.
- Added mocked API layer without backend dependency.
- Used Tailwind CSS utilities



Note: I have used AI for some enhancements.