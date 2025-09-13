# Mutual Fund Portfolio Tracker - Backend (Minimal)

## Features
- User signup / login (JWT + bcrypt)
- Add/list/remove holdings
- Get current portfolio holdings and current values (uses `fund_latest_nav`)
- Get NAV history for a scheme (from mfapi.in or saved history)
- Daily cron job fetches latest NAV for schemes present in portfolios

## Tech
- Node.js, Express, Mongoose (MongoDB Atlas)
- Axios for external API
- JWT for auth
- node-cron (cron.CronJob) for scheduled NAV updates

## Quick setup
1. Clone project and `cd` into it.
2. Create `.env` from `.env.example` and fill `MONGO_URI` and `JWT_SECRET`.
3. `npm install`
4. `npm run dev` (or `npm start`)

## Important notes
- To compute accurate profit/loss you should store `purchaseNav` or `investedAmount` when adding a holding. Current implementation stores `units` only. Add `purchaseNav` field in `Portfolio` and pass it when calling `/portfolio/add` to get investedValue calculations.
- Rate limiting is basic. Harden further for production.
- For MF master list we fetch from `https://api.mfapi.in/mf` and filter; consider caching.

## Example calls
- Signup:
  - `POST /api/auth/signup` { name, email, password }
- Login:
  - `POST /api/auth/login` { email, password }
- Add holding:
  - `POST /api/portfolio/add` Header: `Authorization: Bearer <token>` Body: { "schemeCode":152075, "units":100.5 }
- List holdings:
  - `GET /api/portfolio/list` (auth header)
- Get NAV history:
  - `GET /api/funds/152075/nav`

