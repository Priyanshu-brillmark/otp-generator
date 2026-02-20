# OTP Generator

Generate a 6-digit OTP and send it by email. Verify the OTP in the same session.

**Using GitHub Pages?** See **[DEPLOY-STEPS.md](DEPLOY-STEPS.md)** for step-by-step backend deployment (e.g. Render) and wiring the frontend to it.

## Run locally

```bash
npm install
cp .env.example .env   # then edit .env with your SMTP (e.g. Gmail App Password)
npm start
```

Open http://localhost:3000 and use the form.

## GitHub Pages

**GitHub Pages only serves static files.** It does not run the Node server, so “GET OTP” will fail with “Failed to send OTP. Start the server and set .env (SMTP).” until you use a backend elsewhere.

To make it work when the frontend is on GitHub Pages:

1. **Deploy the backend** (e.g. [Render](https://render.com), [Railway](https://railway.app), or [Fly.io](https://fly.io)).
   - Use the same `server.js` and set `SMTP_USER`, `SMTP_PASS`, etc. in the host’s environment variables.
2. **Point the frontend at that backend:** in `config.js`, set  
   `window.OTP_API_BASE = 'https://your-app.onrender.com';`  
   (use your real backend URL, no trailing slash).
3. Commit and push so GitHub Pages serves the updated `config.js`. “GET OTP” will then call your deployed backend and send the email.

If you run the app locally with `npm start`, you can leave `config.js` with an empty `OTP_API_BASE`; the app will use the same origin (localhost).

## Gmail

Use an [App Password](https://myaccount.google.com/apppasswords), not your normal Gmail password. Put it in `.env` as `SMTP_PASS`.
