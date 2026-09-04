# FCA Refugee Support Program — Beneficiary Registration System

A two-page system (landing page + beneficiary registration form) built for the
FCA refugee support program, per `assessment/Rules.txt` and
`assessment/style_guide.txt`.

- **Frontend:** Pug template (server-rendered) + CSS + vanilla JS (form validation + submission)
- **Backend:** Node.js + Express (routes, models, view engine)
- **Database:** MongoDB (via Mongoose)

## Project structure

Everything lives in one folder — the Express server, the API code, and the
frontend files all sit side by side:

server.js → main server file (Express + Pug)

config/db.js → MongoDB connection

models/Beneficiary.js → database schema and validation

controllers/beneficiaryController.js → logic for handling requests

routes/beneficiaryRoutes.js → API routes

views/index.pug → landing page + registration form

css/style.css → styles (green theme)

js/app.js → form validation and submit logic

assets/fca-logo.jpg → logo image

package.json → project dependencies

.env.example → sample environment variables

The Express server sets `views` (relative to `server.js`) as its Pug views
directory and renders `index.pug` for any non-API route; `css`, `js`, and
`assets` are served as static files straight from the project root.

## Setup

1. **Install MongoDB** locally, or create a free cluster on MongoDB Atlas.

2. *Configure environment variables*
   cp .env.example .env

   Edit `.env` and set `MONGO_URI` to your local or Atlas connection string.

3. *Install dependencies*
   npm install

4. *Run the server*

 npm run dev  

5. Open **http://localhost:5000** in your browser. Express serves the
   frontend and the API from the same server, so no separate frontend
   server is needed.

## Validation rules implemented

Enforced on both the client (`js/app.js`, for instant feedback) and
the server (`models/Beneficiary.js`, so the rules hold regardless of
what calls the API):

- First name, last name, place of birth: required, minimum 2 characters.
- Date of birth: required, must be before the date of registration (today).
- Gender: horizontal radio buttons, defaults to Female.
- Nationality, marital status, settlement camp: required dropdowns with the
  exact option lists from `Rules.txt`.
- Date of joining settlement camp: required, must be after the date of
  registration (today).
- The form cannot be submitted while any field is empty or invalid.
- On success: fields and borders reset to default and a success banner
  appears at the top of the form. Closing the banner also resets the form.

## A note on one validation case

`assessment/form images/4. Invalid fields on submission.PNG` shows a date of
joining settlement camp of `2090/01/01` marked as **invalid**, even though
that date is after the date of registration. `Rules.txt` only specifies that
this date must be *after* the date of registration — it doesn't mention an
upper bound — so the code follows the written rule exactly (any date after
today is accepted). If an upper bound (e.g. "no more than N years from
today") was intended, let me know the intended limit and I'll add it to both
the client and server validation.

## API

| Method | Endpoint              | Description           
| POST   | `/api/beneficiaries`  | Register a new beneficiary          
| GET    | `/api/beneficiaries`  | List all registered beneficiaries
