# 🚂 Creating the Railway One-Click Template

Quick guide to publish Claw Control as a Railway template.

---

## Step 1: Deploy to Your Railway Account First

1. Go to [railway.app](https://railway.app) and login
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select `gokuclaw-adarsh/claw-control`
4. Railway will auto-detect the monorepo structure

### Configure Services:

**Service 1: Backend**
- Root directory: `packages/backend`
- Start command: `npm run migrate && npm start`
- Add env vars:
  ```
  DATABASE_URL=${{Postgres.DATABASE_URL}}
  PORT=3001
  ```

**Service 2: Frontend**
- Root directory: `packages/frontend`
- Build command: `npm run build`
- Start command: `npm run preview`
- Add env var:
  ```
  VITE_API_URL=https://${{Backend.RAILWAY_PUBLIC_DOMAIN}}
  ```

**Service 3: Postgres**
- Click **"+ New"** → **"Database"** → **"PostgreSQL"**
- That's it - Railway handles the rest

---

## Step 2: Verify It Works

1. Wait for all 3 services to deploy (2-3 min)
2. Click the Frontend domain link
3. You should see the Claw Control dashboard
4. Test: Create a task, it should appear in real-time

---

## Step 3: Create the Template

1. In your Railway project, click **Settings** (gear icon)
2. Scroll down to **"Template"** section
3. Click **"Create Template"**
4. Fill in:
   - **Name:** `Claw Control`
   - **Description:** `Kanban for AI Agents - coordinate your AI team with style`
   - **Icon:** Upload the lobster emoji or logo
   - **Repo:** `gokuclaw-adarsh/claw-control`

5. Click **"Publish Template"**

---

## Step 4: Get Your Template URL

After publishing, you'll get a URL like:
```
https://railway.app/template/claw-control
```

Or with your custom slug:
```
https://railway.app/template/XXXXX
```

---

## Step 5: Add Deploy Button to README

The button markdown is already in the README:
```markdown
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/YOUR-TEMPLATE-ID)
```

Just replace `YOUR-TEMPLATE-ID` with your actual template ID/slug.

---

## Quick Reference: Env Vars

| Variable | Service | Value |
|----------|---------|-------|
| `DATABASE_URL` | Backend | `${{Postgres.DATABASE_URL}}` (auto) |
| `PORT` | Backend | `3001` |
| `VITE_API_URL` | Frontend | `https://${{Backend.RAILWAY_PUBLIC_DOMAIN}}` |
| `API_KEY` | Backend | (optional) Set if you want auth |

---

## Estimated Cost

- **Free tier:** $5 credit/month (enough for testing)
- **Hobby:** ~$5/month
- **Pro:** ~$20/month (higher traffic)

---

## Troubleshooting

**Backend won't start:**
- Check DATABASE_URL is connected to Postgres
- Run `npm run migrate` manually in Railway shell

**Frontend shows "Cannot connect":**
- Verify VITE_API_URL points to backend domain
- Make sure backend is running first

**Database connection failed:**
- Wait 30s for Postgres to initialize
- Check the Postgres service is healthy

---

*Time to complete: ~10 minutes*
