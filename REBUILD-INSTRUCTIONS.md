# Star-Web: Rebuild instructions and every user instruction

**Purpose:** If this project is ever deleted or lost, this document contains every instruction the user (Ed) has given about the project so it can be rebuilt without having to repeat them. Follow this document and the project will match what was requested.

**Stack:** React + Vite (frontend), Supabase (backend, database, auth). No separate Express server. Use Supabase's built-in auth for email and phone verification—no SendGrid/Twilio.

---

## Rule #1 (user rule)

**Do not change anything that affects how the website looks to the user without asking the user (Ed) for permission.** If a change would alter layout, copy, icons, sizes, search bar, or any visible/UX decision, ask first: "Ed, to do X I need to change Y. Do you approve?" Only proceed if the user approves.

**Do not run destructive commands (e.g. `rm -rf`) on project or document folders without confirming exactly which path and warning that if the folder is synced (e.g. iCloud), the sync copy will be removed too.**

---

## Project location and Git

- **Project path:** `~/Documents/Cursor/Star/Star-Web` (or iCloud: Documents → Cursor → Star → Star-Web). On Mac, Documents may be iCloud-synced—deleting the local folder can delete the iCloud copy too.
- **Git:** Initialize a Git repository, make an initial commit, and push to GitHub under the **Star-App-PT** organization so work is never lost again. User does not want to lose 100+ hours of work again.

---

## Global / Header

- **Logo:** Use the full wordmark logo: `Star-App-Logo-Transp.png` in `/public/assets/`. Logo height: **52px** (was adjusted from larger sizes; user asked for 50% smaller twice then 25% increase → 52px).
- **Header:** Border-bottom (1px solid gray). On worker flow routes use a **minimal header** (logo + language + optional menu only; no categories, no "Become a Star" in nav on those routes). Worker routes: `/worker/signup`, `/worker/profile/intro`, `/worker/profile/skill`, `/worker/profile/cleaner`, `/worker/profile`.
- **Language selector (globe):** A **globe symbol** that works as a **dropdown menu** with three options: **English**, **Português**, **Español** (display codes: ENG, PTG, ES). User selects language and the whole site switches (i18n). Dropdown closes on outside click and when an option is selected. Show a checkmark or indicator on the active language.
- **Become a Star:** Link/button in header (when not minimal) to worker signup. Blue pill style, same as primary CTAs.

---

## Home page

- **Search bar:** Single row, white background, rounded pill shape, **subtle shadow**. Three fields with vertical dividers between them:
  - **Where** – placeholder: "Select your location"
  - **When** – placeholder: "Select your dates"
  - **Who** – placeholder: "Select your worker"
  Red or blue **circular search button** with magnifying glass on the right. Bar should be vertically centered; arrow next to "Select your worker" **closer to the text** (not too far right). Search bar width: user asked for 50% increase from 560px → 840px.
- **Category tabs (below search bar):** Three tabs: **Cleaning**, **Repairs**, **Services**. Each has an **icon** (user had yellow glove icons; can use `icon-clean.png`, `icon-repair.png`, `icon-services.png` in `/public/assets/`). **Active tab:** dark underline and **soft shadow/elevation** so the tab strip looks like one **elevated plane** (shadow under the whole strip, not per-tab squares). First icon (Cleaning) flipped horizontally if needed to face the right way. Icons and labels **close together** (reduced gap). Tab strip = the "line with a shade" = **tab bar with drop shadow / elevation**.
- **Hero card:** "Continue searching for [category] in [city]" (e.g. Porto) with subtitle like "Aug 1 – Aug 3 · 2 guests" and a small **rounded thumbnail** of the first worker for that category.
- **Section: "Workers in [location]":** Horizontal scroll of **worker cards**. Ten workers per category (cleaners, handymen, services). Each card: **square image** (not rectangle), **Top rated** pill (top-left on image), **heart icon** (top-right) for favorites, below: **worker name** (first name only), **dates** (user's picked dates), **hourly price** (e.g. €28 / hour), **star rating** (e.g. ★ 4.89). Cards same font/size/formatting as other section.
- **Section: "Other workers in your area":** Six cards that are a **mix of workers from the other two categories** (random/shuffled). Seventh card = **"More..."** with **three overlapping square images** (one from each category) and the word "More" centered below. Clicking "More..." opens a page with a random selection of all available workers in the user's area.
- **Bottom CTA:** Short line of copy (e.g. "Are you a professional? Join STAR and get clients in your area.") and a blue **"Become a Star"** button linking to worker signup. Button blue (same as logo), not red.
- **Subcategories:** Under "Other workers in your area" there can be **subcategory pills** (e.g. Car detailing, Deep cleaning, Plumbing, Electrical, Hair, Massage) as **white pill buttons with a shade** so they look clickable. Clicking opens that subcategory's workers (behavior to wire when backend exists).
- **No workers in area:** If the user searches and there are **no workers in that location**, show a **modal** (popup): title like "We're not in your area... yet!", body text, buttons "Keep Browsing" and "Try another location". i18n for EN/PT/ES.
- **Favorites / heart:** If user is **not logged in** and taps the heart on a worker card, show a **login/signup modal** (Airbnb-style: "Log in or sign up", Welcome to Star, phone/country, Continue, or Google/Apple/Email/Facebook). Do not toggle favorite until logged in.
- **Language:** Site should **recognize user location/locale** and adapt display language where possible (browser language + i18n).

---

## Worker signup flow (pages and layout)

- **Order of pages:** Signup (landing) → Intro (Step 1) → Skill type (Step 2) → Cleaner page (if Cleaning) or main Profile (if Repairs/Services).
- **Layout alignment:** The **bottom horizontal line (divider)** and **Back/Continue (or Next) buttons** must be in the **exact same position** (or as close as possible) on consecutive pages (e.g. signup and intro, intro and skill type).
- **Typography:** User asked to **increase font sizes** on intro and signup for readability (step number, step title, step description). Do not over-do it (user said "that's too big" once); use reasonable sizes (e.g. step num 2rem, step title 1.6rem, step desc 1.05rem). Same treatment for Step 2 on the skill page.
- **Buttons:**
  - **Get started** (signup), **Continue**, **Next:** Blue pill, same colour and shape as each other.
  - **Back:** White pill with **subtle shadow** (user asked for "stroke line" then "soft shadow" instead of heavy border). Same style on all worker flow pages.
- **Signup page:** Three steps with icons (or images). "Get started" at bottom. Steps: (1) Tell us about your skill, (2) Make it stand out, (3) Finish and publish. **Worker images** in **circular frames** (border, shadow); images from project assets (e.g. worker-cleaner, worker-repair, worker-photographer). Tight layout so "Get started" is visible without scrolling; gap between divider and button increased (e.g. 24px).
- **Intro page (Step 1):** Heading "Tell us about your skill", body text about what we'll ask. **Continue** → goes to skill type page. **Back** → signup. Content width/padding aligned with signup (wrapper class for consistency).
- **Skill type page (Step 2):** Heading "Which of these best describes your skill?" Three options: **Cleaning**, **Repairs**, **Services** with **same images** as on signup page, **same size** for visual consistency. Heading **above** the cards; **Step 2** label **left-aligned** above heading. **Back** → intro. **Continue** → if Cleaning selected go to `/worker/profile/cleaner`, else `/worker/profile`. Continue disabled until one option selected.
- **Cleaner page:** Worker illustration **above** the heading (image left-aligned, 25% smaller than previous size, gap above image from top line). Heading: "Tell us more about you". Intro line: "Choose the cleaning services you offer. You can select more than one." **Profile photo** section (see below). **Your cleaning services:** hint "Click on every one that applies to you." (smaller font). Then **16 skill pills** (see cleaning skills list). Then **Other:** label "Other" + **text box** for extra skills. Then **Basic information** section: First name, Last name, Email, Phone number, Address, Address line 2 (optional), City, Postcode, Country, Date of birth. (Email and phone verification via Supabase come later; for now just form fields and state.) **Back** → skill type. **Continue** → profile. Skill pills and "Choose file" button **same visual size** (shared padding, font-size, border, etc.).
- **Repairs and Services pages:** Same structure as Cleaner page (image, heading, profile photo, specific sub-skills list, Other, Basic info, Back/Continue). Every change made to the Cleaner page should be **mirrored** on Repairs and Services so all three stay in sync.
- **Main Profile page:** For non-cleaner paths. Title "Tell us more about you", no "Step 1" label. Rest of profile form (skills, rates, etc.) as needed.

---

## Profile photo (worker profile and cleaner)

- **Placeholder:** Circular area. When no photo: **white silhouette** icon (person shape). No "no files chosen" text.
- **Choose file:** Custom **button** (same style as Back button: white pill, subtle shadow). Label from i18n (e.g. "Choose file"). Do not show native file input; hide it and use a label tied to it.
- **After file selected:** Open a **cropping modal** (use **react-easy-crop**). User can **zoom** and **drag** image; crop shape **circular**. **Zoom control** (e.g. range slider) **below** the image. **Cancel** and **Done** buttons. **Cancel** must **not** apply the photo (reset crop state, close modal, leave profile photo unchanged). **Done** applies the crop and sets the profile photo; preview updates immediately in the circular avatar.
- **Done button:** Must be visible (same row as Cancel if needed; ensure CSS does not hide it). **Cancel** styled like Back button (white pill, soft shadow).

---

## Cleaning skills (cleaner page)

Use these 16 labels (i18n keys under `workerProfileCleaner`):

1. Deep Cleaning  
2. Glass Cleaning  
3. Exit Cleaning  
4. Home Cleaning  
5. Bath Cleaning  
6. Kitchen Clean  
7. Fridge Detail  
8. Floor Cleaning  
9. Sofa Cleaning  
10. Work Cleaning  
11. Build Cleaning  
12. Host Cleaning  
13. Laundry Clean  
14. Patio Cleanup  
15. Car Valeting  
16. Auto Detailing  

Display as multi-select **pills**. Reduce **gap between pills** so they can fit in two rows if desired.

---

## Internationalization (i18n)

- **Languages:** **English (en)**, **Portuguese Portugal (pt-PT)**, **Spanish (es)**. All UI strings must have keys in `en.json`, `pt-PT.json`, `es.json`. Namespace: wrap locale JSON in `translation` for i18next (`resources: { en: { translation: en }, 'pt-PT': { translation: ptPT }, es: { translation: es } }`).
- Add keys for: common (back, continue, cancel, done, where, when, who), header (becomeAStar), home (title, subtitle, placeholders, category labels, section titles, topRated, more, ctaText, yourArea, continueSearching), workerProfile, workerProfileCleaner (all skill keys + other, basicInfoTitle, field labels/placeholders), workerSkill, workerSignup, loginModal, noWorkersModal, etc.

---

## Assets and paths

- **Logo:** `/public/assets/Star-App-Logo-Transp.png` (full wordmark). Fallback to `/star-logo-blue.svg` if missing.
- **Category icons (header / home):** `/public/assets/icon-clean.png`, `icon-repair.png`, `icon-services.png`. User may provide yellow glove icons or custom icons; replace these files.
- **Worker images (signup/skill/cleaner):** e.g. `worker-cleaner.png`, `worker-repair.png`, `worker-photographer.png`, or under `WorkerIcons/` or `src/assets/worker-signup/`. Use paths that Vite can resolve (e.g. under `src/` and import, or in `public/` and reference by path).

---

## Technical notes

- **Router:** React Router (BrowserRouter, Routes, Route). Routes: `/`, `/worker/signup`, `/worker/profile/intro`, `/worker/profile/skill`, `/worker/profile/cleaner`, `/worker/profile`, `/search`, `/workers`.
- **Vite:** Port 5173 in config so the app runs at `http://localhost:5173/`.
- **No visual/UX changes without user permission.** Add and extend only; change existing look/behavior only when the user (Ed) approves.

---

## Changelog of instructions (for rebuild)

1. Align bottom line and next button across signup and intro pages.  
2. Increase font sizes on intro/signup (step, title, body).  
3. Next page after intro = skill type: "Which of these best describes your skill?" with three categories (Cleaning, Repairs, Services), icons, horizontal line, Back/Continue.  
4. Continue button same look as Get started (blue pill).  
5. Back button: add stroke, then softer shadow (no heavy stroke).  
6. Skill page: use same images as signup; same size; center words under cards; heading on top; fix Next button.  
7. Cleaner page: remove top "Step 1", same top as previous page; heading "Tell us more about you"; profile photo in circle, immediate preview; remove "no files chosen", use white silhouette when empty; zoom below image; Cancel and Done in cropper; Cancel must not apply photo; Done visible; Cancel styled like Back; Choose file as button like Back; Choose file and skill pills same visual size.  
8. Add "Trending" then rename to "Choose file" next to Services on profile.  
9. Cleaner-specific page with image, heading, sub-skills (16), hint "Click on every one that applies to you"; add Other + text box; add Basic info (name, email, phone, address, dob); email/phone verification later with Supabase only.  
10. Logo: full wordmark, height 52px; tighten signup layout; gap above Get started; Step 2 on skill page, left-aligned; cleaner page: gap above image, image 25% smaller, left-aligned.  
11. Repairs and Services pages: same structure as Cleaner; keep all three in sync on every change.  
12. Home: search bar (Where/When/Who), category tabs with elevation/shadow, Workers in [location], worker cards (square, Top rated, heart), Other workers in your area (6 mixed + More card), Become a Star CTA; language dropdown (globe) with ENG, PTG, Spanish.  
13. **Document every instruction in this file so a full rebuild can be done from this document.**

---

## Implementation log (Cursor’s actions – what was actually done)

Use this section to know what exists in the repo and what was implemented, so a rebuild can repeat it.

1. **Project creation:** Vite + React app created at `~/Documents/Cursor/Star/Star-Web`. Dependencies: react, react-dom, react-router-dom, react-i18next, i18next, i18next-browser-languagedetector, react-easy-crop. Dev: @vitejs/plugin-react, vite. `vite.config.js` has `server.port: 5173`.
2. **i18n:** `src/i18n.js` wires i18next with LanguageDetector and initReactI18next. **Resources must be wrapped:** `resources: { en: { translation: en }, 'pt-PT': { translation: ptPT }, es: { translation: es } }` so that `t('home.title')` returns the string, not the key. Locale files in `src/i18n/locales/en.json`, `pt-PT.json`, `es.json`.
3. **Routes (App.jsx):** `/` (Home), `/search` (Search), `/workers` (Workers), `/worker/signup`, `/worker/profile/intro`, `/worker/profile/skill`, `/worker/profile/cleaner`, `/worker/profile`. Search and Workers are placeholder pages (title + Back) so links don’t 404.
4. **Header:** Logo (img with onError fallback to `/star-logo-blue.svg`). **Language dropdown:** globe icon + current code (ENG/PTG/ES) + chevron; button toggles dropdown; dropdown lists English, Português, Español; `i18n.changeLanguage(code)` on select; active option shown with checkmark; click-outside closes dropdown. Nav: language dropdown always visible; "Become a Star" link only when not minimal header. CSS: `.star-header__lang`, `__lang-btn`, `__lang-dropdown`, `__lang-option`, etc.
5. **Home page:** `Home.jsx` has search form (Where/When/Who), category tabs (cleaners/handymen/services), hero card, "Workers in Porto" horizontal scroll (10 worker cards per category from mock arrays CLEANERS, HANDYMEN, SERVICES), "Other workers in your area" (6 shuffled from other two categories + More card). Worker cards: square 220px image, Top rated pill, heart button (favorites in state), name/dates/price/rating. More card: three overlapping images + "More..." label, links to `/workers`. CTA block at bottom with text and "Become a Star" link. Mock images use picsum.photos URLs; can be replaced with local assets. `Home.css` has all styles (search bar, tabs, hero, cards, more card, CTA).
6. **Worker flow:** WorkerSignup (three steps, Get started → intro), WorkerProfileIntro (Step 1, Continue → skill), WorkerSkillType (Step 2, three options, Continue → cleaner or profile), WorkerProfileCleaner (image placeholder, profile photo upload without cropper in current rebuild, 16 skills, Other textarea, Basic info fields, Back/Continue), WorkerProfile (simple title + intro). Cleaner page does not use react-easy-crop in current rebuild; profile photo is single file input with preview (no crop modal). To restore cropper: add Cropper, crop state, applyCrop, and Cancel logic per REBUILD-INSTRUCTIONS.
7. **REBUILD-INSTRUCTIONS.md:** This file. Created so that every user instruction and every Cursor action is recorded for a full rebuild. User asked to add a document with "every single action" and "every single instruction" so nothing is lost again.
8. **Git:** Repo initialized, first commit made. Push to GitHub (Star-App-PT/Star-Web) failed because repo did not exist; user must create repo then run `git push -u origin main`.

When you add a new feature or change, add one line to this Implementation log (what you did) and, if it came from the user, one line to the Changelog of instructions above.

---

*Last updated when this file was created and when the Implementation log was added. Add any new user instructions and Cursor actions to this document as they happen.*
