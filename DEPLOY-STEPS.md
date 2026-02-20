# Step-by-step: Make OTP work on GitHub Pages

Your frontend is at **priyanshu-brillmark.github.io/otp-generator**. To send OTP by email, you need the Node backend running on a host that supports env vars (e.g. Render). Follow these steps.

---

## Part 1: Deploy the backend on Render (free)

### Step 1: Push your code to GitHub

Make sure your **otp-generator** repo is pushed to GitHub (e.g. `https://github.com/Priyanshu-brillmark/otp-generator`).

- Do **not** push `.env`. It should be in `.gitignore`.
- Render will read env vars from its dashboard, not from `.env`.

### Step 2: Sign up / log in to Render

1. Go to [https://render.com](https://render.com).
2. Sign up or log in (e.g. with GitHub).

### Step 3: Create a new Web Service

1. Click **Dashboard** → **New +** → **Web Service**.
2. Connect your GitHub account if needed.
3. Select the repo: **Priyanshu-brillmark/otp-generator** (or your repo name).
4. Use these settings:
   - **Name:** e.g. `otp-generator` (any name you like).
   - **Region:** choose one close to you.
   - **Branch:** `main` (or your default branch).
   - **Runtime:** **Node**.
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance type:** **Free** (optional; free tier may spin down when idle).

Click **Create Web Service**.

### Step 4: Add environment variables on Render

After the service is created:

1. Open your service → **Environment** (left sidebar).
2. Add these variables (use **Add Environment Variable** for each):

| Key           | Value                          |
|---------------|---------------------------------|
| `SMTP_USER`   | Your Gmail address              |
| `SMTP_PASS`   | Your Gmail App Password (16 chars) |
| `SMTP_HOST`   | `smtp.gmail.com`                |
| `SMTP_PORT`   | `587`                           |
| `SMTP_FROM`   | Same as SMTP_USER (optional)    |
| `OTP_SUBJECT` | `Your OTP Code` (optional)      |

- For **SMTP_PASS**: use a [Gmail App Password](https://myaccount.google.com/apppasswords), not your normal password.
- Do **not** put quotes around values unless Render asks for them.

3. Save. Render will redeploy with the new env vars.

### Step 5: Get your backend URL

1. After deploy finishes, open your service.
2. At the top you’ll see something like: **https://otp-generator-xxxx.onrender.com**
3. Copy that URL (no trailing slash). This is your **backend URL**.

---

## Part 2: Point GitHub Pages at the backend

### Step 6: Set the backend URL in your project

1. On your PC, open **otp-generator/config.js**.
2. Set the backend URL:

```js
window.OTP_API_BASE = 'https://otp-generator-xxxx.onrender.com';
```

Replace `https://otp-generator-xxxx.onrender.com` with the URL from Step 5 (no trailing slash).

### Step 7: Push to GitHub

```bash
cd "c:\Users\pnain\Downloads\TEST\otp-generator"
git add config.js
git commit -m "Use deployed backend URL for GitHub Pages"
git push origin main
```

### Step 8: Wait for GitHub Pages

- If GitHub Pages is set to build from `main`, it may take 1–2 minutes to update.
- Open **https://priyanshu-brillmark.github.io/otp-generator/** and try **GET OTP** with your email.

---

## Checklist

- [ ] Repo pushed to GitHub (without `.env`)
- [ ] Render Web Service created and linked to repo
- [ ] Build: `npm install`, Start: `npm start`
- [ ] Env vars set on Render: `SMTP_USER`, `SMTP_PASS`, and optionally others
- [ ] Backend URL copied from Render (no trailing slash)
- [ ] `config.js` updated with that URL
- [ ] Changes pushed to GitHub
- [ ] Test GET OTP on the GitHub Pages site

---

## If something goes wrong

- **“Failed to send OTP”**  
  - Check that `config.js` has the correct backend URL (the Render URL).  
  - Open DevTools (F12) → Network, click GET OTP, and see if the request goes to `...onrender.com/send-otp` and what it returns.

- **Render: “Application failed to respond”**  
  - On Render, check **Logs** for errors.  
  - Ensure all env vars (especially `SMTP_USER` and `SMTP_PASS`) are set.

- **Gmail “Username and Password not accepted”**  
  - Use a Gmail **App Password**, not your normal password.  
  - Create one at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords) (2-Step Verification must be on).

- **Free tier spins down**  
  - Render’s free tier may sleep after ~15 minutes of no traffic. The first GET OTP after that can take 30–60 seconds while it wakes up.
