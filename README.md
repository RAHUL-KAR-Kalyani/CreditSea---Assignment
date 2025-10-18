# Backend — Experian SoftPull MERN (Minimal)

This folder contains the Express + Mongoose backend for parsing Experian-style soft-pull XML and persisting extracted reports.

Main files:
- [app.js](backend/app.js) — Express app and middleware
- [server.js](backend/server.js) — DB connection and app startup
- Routes: [routes/upload.js](backend/routes/upload.js), [routes/reports.js](backend/routes/reports.js)
- Utils: [utils/xmlParser.js](backend/utils/xmlParser.js) (exports [`parseXmlString`](backend/utils/xmlParser.js) and [`extractFromParsed`](backend/utils/xmlParser.js))
- Model: [models/Report.js](backend/models/Report.js) (exports `Report` Mongoose model)

API Endpoints:
- GET /api/health — basic health check (see [app.js](backend/app.js))
- POST /api/upload — upload XML (multipart/form-data, field `file`) handled in [routes/upload.js](backend/routes/upload.js)
- GET /api/reports?page=0&limit=20 — list reports (see [routes/reports.js](backend/routes/reports.js))
- GET /api/reports/:id — fetch single report by id (see [routes/reports.js](backend/routes/reports.js))

Quick start:
1. cd into `backend`
2. npm install
3. set MONGO_URI and PORT in `.env` if needed
4. npm run dev (uses nodemon) or npm start

Notes:
- XML parsing is done by [`parseXmlString`](backend/utils/xmlParser.js) then normalized by [`extractFromParsed`](backend/utils/xmlParser.js) and saved to the `Report` model ([models/Report.js](backend/models/Report.js)).



# Backend Routes

This document describes the backend route modules.

1) routes/upload.js
- Path: POST `/api/upload`
- Accepts: multipart/form-data with field `file` (XML)
- Validations:
  - Basic extension check `.xml`
  - File size enforced via multer (5 MB)
- Flow:
  - Reads uploaded file, uses [`parseXmlString`](backend/utils/xmlParser.js) to parse XML
  - Normalizes with [`extractFromParsed`](backend/utils/xmlParser.js)
  - Persists to MongoDB via [models/Report.js](backend/models/Report.js)
  - Deletes temporary upload file
- See: [routes/upload.js](backend/routes/upload.js)

2) routes/reports.js
- GET `/api/reports?page=0&limit=20` — paginated listing (selects `name score totalAccounts createdAt`)
- GET `/api/reports/:id` — fetch single report by Mongo _id
- See: [routes/reports.js](backend/routes/reports.js)


# Utils — XML Parser

File: [utils/xmlParser.js](backend/utils/xmlParser.js)

Exports:
- [`parseXmlString`](backend/utils/xmlParser.js)(xml: string) => Promise<Object>
  - Uses `xml2js` to parse XML into JS objects.
- [`extractFromParsed`](backend/utils/xmlParser.js)(parsed: Object) => Object
  - Normalizes common Experian soft-pull structures into a simplified `report` object:
    - name, firstName, lastName, mobile, pan, dateOfBirth
    - score, scoreConfidence
    - totals: totalAccounts, activeAccounts, closedAccounts
    - outstanding: securedOutstanding, unsecuredOutstanding, totalOutstanding
    - inquiriesLast7Days
    - accounts[] with normalized fields and `raw`

Usage:
- Called from [routes/upload.js](backend/routes/upload.js) to build the document saved via [models/Report.js](backend/models/Report.js).


# Models — Mongoose Schemas

File: [models/Report.js](backend/models/Report.js)

- Defines `AccountSchema` (embedded, _id disabled) and `ReportSchema`.
- Fields captured:
  - Personal: name, firstName, lastName, mobile, pan, dateOfBirth
  - Score: score, scoreConfidence
  - Counts: totalAccounts, activeAccounts, closedAccounts
  - Outstanding amounts: securedOutstanding, unsecuredOutstanding, totalOutstanding
  - inquiriesLast7Days, accounts[], rawXml
  - createdAt defaulted to current date
- Indexes:
  - pan (for lookup)
  - createdAt (for sorting)

Usage:
- Created documents via `Report.create(...)` in [routes/upload.js](backend/routes/upload.js)


# Frontend — React + Vite

This folder contains the React SPA using Vite.

Main files:
- [index.html](frontend/index.html) — app entry
- [package.json](frontend/package.json)
- [src/main.jsx](frontend/src/main.jsx) — React entry mounting `<App />`
- [src/App.jsx](frontend/src/App.jsx) — routes and layout
- API client: [src/api.js](frontend/src/api.js) — wrapper for backend endpoints

Pages/components:
- [src/pages/UploadPage.jsx](frontend/src/pages/UploadPage.jsx) — upload XML UI
- [src/pages/ReportsList.jsx](frontend/src/pages/ReportsList.jsx) — list reports
- [src/pages/ReportView.jsx](frontend/src/pages/ReportView.jsx) — report details

API client details:
- Base: VITE_API_BASE or default `http://localhost:8000/api`
- Methods: `upload(file)`, `listReports(page, limit)`, `getReport(id)` — see [src/api.js](frontend/src/api.js)

Run:
1. cd frontend
2. npm install
3. npm run dev



# Frontend Pages

Files:
- [UploadPage.jsx](frontend/src/pages/UploadPage.jsx)
  - Allows selecting an XML file and posts it to POST `/api/upload` via the client in [src/api.js](frontend/src/api.js).
  - On success navigates to `/reports/:id`.

- [ReportsList.jsx](frontend/src/pages/ReportsList.jsx)
  - Fetches list from GET `/api/reports` using [src/api.js](frontend/src/api.js) and shows summary items.

- [ReportView.jsx](frontend/src/pages/ReportView.jsx)
  - Fetches GET `/api/reports/:id` via [src/api.js](frontend/src/api.js) and renders the normalized report fields and accounts.

Notes:
- The UI expects the backend to be reachable at VITE_API_BASE (configured in `frontend/.env`) or default `http://localhost:8000/api`.