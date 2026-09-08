# Backchannel Chat — Setup Guide

A backchannel chat tool for the classroom. Teachers create rooms and post in
dark-blue bubbles; students join rooms and post in light-grey bubbles. Google
sign-in is limited to your personal Gmail and every `@glenbrook225.org` account.

---

## 1. What was built

All files live in `chat/` (already in your GitHub Pages repo):

| File | Purpose |
| --- | --- |
| `index.html` | Single page: login, home (create/join), and room views |
| `style.css` | iMessage-style bubbles (teacher = blue, student = grey) |
| `app.js` | All Firebase logic (auth, roles, rooms, messages, edit/delete) |
| `firebase-config.js` | **Edit me** — your Firebase keys + owner Gmail |
| `firestore.rules` | **Deploy me** — server-side access rules |
| `firestore.indexes.json` | **Deploy me** — required query indexes |

URLs: `https://mmacfadden.com/chat/` (home) and `https://mmacfadden.com/chat/knfep` (a room).

---

## 2. One-time Firebase console setup

1. **Firebase** → Build → **Authentication** → Settings → **Authorized domains**.
   Add `mmacfadden.com` (your personal Gmail must already be signed in as an
   approved test user for the auth provider).
2. **Firebase** → Build → **Firestore Database** → **Rules** tab.
   Paste the contents of `firestore.rules` and click **Publish**.
   (The owner email `mikemacfadden@gmail.com` is already baked into the rules and
   `firebase-config.js` — no placeholder editing needed.)
3. **Firebase** → Build → **Firestore Database** → **Indexes** tab.
   Click **Add index** and create the two composer indexes below.
4. Make sure you upgrade the project to the **Blaze (pay-as-you-go) plan** in
   Firebase Console → Project settings → Usage and billing. Authentication and
   Firestore stay free at classroom scale; the rules engine / indexes require it.

   **Required indexes (description / collection → Fields):**
   - Collection ID `rooms`, Field `createdAt` DESC.
   - Collection ID `messages`, Field `createdAt` ASC.

5. **Google Cloud Console** (same Google account) → **APIs & Services** →
   **OAuth consent screen**:
   - App type: **External** (a personal Gmail means it is external by default).
   - Add your personal Gmail to **Test users** (plus any students you want to
     test with — a Gmail + school account works best).
6. **Google Cloud Console** → **Credentials** → your **OAuth 2.0 Client ID** →
   **Authorized JavaScript origins**: add
   `https://mmacfadden.com` (and optionally `http://localhost:8080` to test locally).

---

## 3. Deploy

This repo publishes the `public/` folder to GitHub Pages at `mmacfadden.com`:

1. Commit everything in `public/chat/`.
2. Push to `main` (your normal flow — `php_to_html_converter.sh` is unrelated to
   this static app; `chat/` is plain HTML/JS and Page builds it as-is).
3. Confirm `https://mmacfadden.com/chat/` loads (you may need to clear cache).
4. **First sign-in:** log in with your OWNER Gmail. You'll see a
   "First-time setup" card — click **Create access document**. That seeds the
   `settings/access` document with your Gmail as the admin.
5. Anyone with `@glenbrook225.org` can now sign in. Gmail accounts you add in
   the **Manage access** panel (admin-only) are also allowed.

---

## 4. Deployment options for rules/indexes (pick one)

- **Option A — Firebase CLI (recommended).**
  ```bash
  npm install -g firebase-tools
  firebase login
  firebase init   # only select Firestore → use the project id backchannel-chat-d0d9c
  firebase deploy --only firestore:rules,firestore:indexes
  ```
- **Option B — Manual:** paste `firestore.rules` into the Firestore **Rules**
  tab and click through the two **Indexes** from the index tab (see step 2).

---

## 5. How roles work

| Who | Where they come from | Bubbles | Can |
| --- | --- | --- | --- |
| Owner | Your personal Gmail (in `BACKCHANNEL_ADMIN_EMAILS`) | Blue | Create rooms, edit/delete any message in rooms they created, manage access |
| Teacher | `letter-name@glenbrook225.org` | Blue | Create rooms, edit/delete any message in rooms they created |
| Student | `123456@glenbrook225.org` | Grey | Join rooms, post, edit/delete **their own** messages |

Notes:
- Role detection is checked BOTH in the browser and enforced again by
  `firestore.rules` (so a student can't forge a teacher bubble or mess with
  other students' messages).
- Anyone not on the allowed list signs out automatically with an explanation.

---

## 6. That's it

If a room ever shows "Could not load rooms" on a teacher's home screen, the
Firestore indexes from step 2/4 haven't been created yet for your project.
Double-check the Compiler indexes exist under Firestore → Indexes.