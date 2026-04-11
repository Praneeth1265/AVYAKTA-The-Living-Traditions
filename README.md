# AVYAKTA – The Living Traditions

A culturally rooted, vibrant website for Avyakta - a cultural multi-domain club that brings together students passionate about performing arts, design, technology, event management, and more.

---

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS with custom theme tokens
- **Animations**: Framer Motion + CSS transitions
- **Backend/DB**: Supabase (PostgreSQL + Auth + Storage)
- **Forms**: React Hook Form + Zod
- **CI/CD**: GitHub Actions
- **Node.js**: v24.x

---

## Project Structure

```
AVYAKTA-The-Living-Traditions/
│
├── frontend/                      # Next.js application
│   ├── src/
│   │   ├── app/                  # Next.js App Router pages
│   │   │   ├── page.tsx         # Home Page
│   │   │   ├── about/           # About / What is Avyakta
│   │   │   ├── about-ira/       # About Club IRA (parent)
│   │   │   ├── recruitment/     # Recruitment form
│   │   │   ├── events/
│   │   │   │   ├── page.tsx     # Events listing
│   │   │   │   └── [slug]/      # Event detail pages
│   │   │   ├── gallery/         # Photo gallery
│   │   │   ├── members/         # Team members
│   │   │   ├── registrations/   # Volunteer/participant
│   │   │   ├── history/         # Timeline page
│   │   │   └── avyakta-control-[hash]/
│   │   │       ├── page.tsx     # Admin login
│   │   │       └── dashboard/    # Admin dashboard
│   │   │           ├── announcements/
│   │   │           ├── recruitment/
│   │   │           ├── events/
│   │   │           ├── gallery/
│   │   │           ├── members/
│   │   │           └── users/
│   │   │
│   │   ├── components/
│   │   │   ├── layout/          # Navbar, Footer, MobileMenu
│   │   │   ├── home/            # Hero, Announcements, Domains, etc.
│   │   │   ├── events/          # EventCard, EventFilter
│   │   │   ├── gallery/         # ImageGrid, Lightbox
│   │   │   ├── members/         # MemberCard, MemberModal
│   │   │   ├── forms/           # RecruitmentForm, RegistrationForm
│   │   │   ├── ui/              # Button, Card, Modal, Input, etc.
│   │   │   └── shared/          # RangoliDivider, MandalaLoader, etc.
│   │   │
│   │   ├── lib/
│   │   │   ├── supabase/        # Supabase client & types
│   │   │   └── utils/           # Helper functions
│   │   │
│   │   ├── hooks/               # Custom React hooks
│   │   ├── types/               # TypeScript definitions
│   │   ├── styles/              # Global styles
│   │   └── assets/
│   │       ├── icons/            # Custom SVG icons (diya, rangoli)
│   │       └── patterns/         # SVG patterns (paisley, jaali)
│   │
│   ├── public/
│   │   └── images/
│   │
│   ├── .env.local               # Environment variables
│   ├── tailwind.config.ts
│   ├── next.config.js
│   └── package.json
│
├── frontend-vite/                # Old Vite project (reference)
├── .github/
│   └── workflows/
│       └── ci.yml              # CI Pipeline
│
└── README.md
```

---

## Pages Overview

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Hero, Announcements, About, Timeline, Domains, Events |
| `/about` | About | Mission, Vision, Domains, Why Join |
| `/about-ira` | About IRA | Parent club information |
| `/recruitment` | Recruitment | Application form with domain selection |
| `/events` | Events | Horizontal scroll carousel with filters |
| `/events/[slug]` | Event Detail | Full event information |
| `/gallery` | Gallery | Masonry layout with lightbox |
| `/members` | Members | Team grid with modal popups |
| `/registrations` | Registrations | Volunteer/participant signup |
| `/history` | History | Animated timeline page |
| `/avyakta-control-[hash]` | Admin | Hidden admin dashboard |

### Page-specific Notes

- **Home**: Includes announcements popup (recruitment/events), a timeline/history scroll, and a subtle line linking to the About IRA page.
- **Members**: Sections for founders, faculty advisors, previous heads, and previous members. Hover animation on images; click opens a popup with name, designation, and a short description/quote.
- **Recruitment**: Starts with a short ethics statement, followed by domain descriptions. Form includes name, SRN, branch, class, section, domain interest, and experience. A dynamic links section lets users add multiple links with a type dropdown + URL field.
- **Gallery**: Event-wise image groups. Users scroll through events and view all images for a selected event.
- **Events**: Scroll-based layout for past, present, and future events. Past events show a "View Gallery" option; upcoming events show a Register/Volunteer button.
- **Admin (`/avyakta-control-[hash]`)**: Not linked in public navigation. Accessed only by typing the URL directly. Navigation flow: `Homepage → Hidden URL → Login → Dashboard`.

---

## Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| Bronze Gold | #92791B | Headings, CTAs, borders |
| Emerald Green | #1B5E3B | Nav highlights, success states |
| Charcoal Black | #1C1C1C | Body text, footer |
| Dull Olive Yellow | #737955 | Subheadings, captions |
| Deep Crimson | #8B1A1A | Alerts, tags, accents |
| Muted Warm White | #F5F0E8 | Backgrounds, cards |
| Gold Light | #C9A84C | Hover glows, icon highlights |

---

## Typography

- **Display**: Cormorant Garamond (serif) - headings, titles
- **Body**: Inter / DM Sans (sans-serif) - paragraphs, labels
- **Accent**: Playfair Display Italic - quotes, bios

---

## Indian Design Elements

- **Rangoli Dividers**: SVG geometric star/petal dividers between sections
- **Mandala Loader**: Full-screen rotating mandala on page load
- **Paisley Backgrounds**: Tiled patterns at 4-6% opacity
- **Jaali Overlays**: Geometric lattice on images
- **Diya Icons**: Custom lamp icons for domains
- **Kolam Border**: Animated border on hero section

---

## Supabase Schema

| Table | Purpose |
|-------|---------|
| `announcements` | Home popup content |
| `events` | Event listings |
| `recruitment_applications` | Applicant data |
| `registrations` | Event participation |
| `gallery_images` | Gallery photos |
| `members` | Team profiles |
| `history_milestones` | Timeline entries |
| `domain_heads` | Domain head accounts |

---

## Development

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Lint
npm run lint

# Format
npx prettier --write .
```

---

## Team Responsibilities

| Team | Members | Tasks |
|------|---------|-------|
| Team 1 - Core & Structure | Suhith, Arrham, Preksha | Layout, Navbar, Footer, Home, About, Admin |
| Team 2 - Recruitment & Data | Teja, Vrushabendra, Navyashree | Forms, Supabase, Domain Head Dashboard |
| Team 3 - Events, Gallery & UX | Naman, Akhil, Nikita | Events, Gallery, Members, History, Animations |

---

## Branching Strategy

| Branch | Purpose | Protection | Merge Approvals |
|--------|---------|------------|------------------|
| `main` | Production (final release) | Codeowner approval | Codeowner |
| `dev` | Integration & testing | Protected | Tech leads |
| `team/1-core-structure` | Team 1 integration | Protected | Min. 2 approvals |
| `team/2-recruitment-data` | Team 2 integration | Protected | Min. 2 approvals |
| `team/3-events-gallery-ux` | Team 3 integration | Protected | Min. 2 approvals |
| `feature/*` | Individual feature work | Not protected | — |

### Workflow

```
feature/* → PR → team branch → PR → dev → (tech leads) → main
```

1. Create a feature branch from your team branch:
   ```bash
   git checkout team/1-core-structure
   git checkout -b feature/navbar
   ```

2. Work and commit:
   ```bash
   git commit -m "feat: add navbar component"
   git push origin feature/navbar
   ```

3. Open PR → your team branch (requires **2 approvals**).

4. Team branch → PR → `dev` (handled by tech leads).

5. `dev` → `main` after integration testing (codeowner approval required).

### Rules

- No direct pushes to protected branches.
- All changes go through PRs.
- **Do not** merge directly between team branches — cross-team integration happens only via `dev`.
- CI checks must pass before any merge.
- Testing happens at the `dev` integration stage, not in isolation.

---

## CI Pipeline

The CI pipeline runs on every PR to protected branches:

1. Checkout code
2. Setup Node.js v24
3. Install dependencies
4. Run lint checks
5. Check formatting (Prettier)
6. Run unit tests
7. Build project
8. Run E2E tests

---

## Setup Instructions

```bash
# Clone the repository
git clone https://github.com/Praneeth1265/AVYAKTA-The-Living-Traditions

# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Run development server
npm run dev
```

---

## Important Notes

- Node.js v24.x required.
- Do NOT commit `node_modules/` or `.env.local`.
- Follow the project structure and use `.tsx` files throughout (TypeScript strict mode).
- Write clean, modular code.

---

## API Routes

| Endpoint | Methods | Description |
|----------|---------|-------------|
| `/api/recruitment` | `POST` | Submit recruitment application |
| `/api/events` | `GET, POST, PATCH, DELETE` | Manage events |
| `/api/gallery` | `GET, POST` | Fetch/upload gallery images |
| `/api/members` | `GET, POST` | Fetch/add members |
| `/api/announcements` | `GET, POST` | Fetch/create announcements |
| `/api/admin/recruits` | `GET, PATCH` | Domain heads view/update recruit status |

---

## Admin Dashboard

The dashboard is embedded within the same Next.js app — **not** a separate deployment. It is hidden from public navigation and accessed only via a secret URL known to admins.

### Access & Roles

| Role | Access | Active Period |
|------|--------|---------------|
| Tech (main admin) | Full dashboard — all data, all domains | Always |
| Domain Head | Own domain recruits only | Recruitment season only |

### Domain Head Capabilities

- View recruits for their domain.
- Edit recruit details.
- Delete entries.
- Update status: `selected` / `rejected` / `pending`.

### Authentication & Security

- Credentials are **never hardcoded**. Passwords are hashed; each domain head sets their own password.
- Route protection is enforced on all `/dashboard/*` routes.
- Domain heads are redirected to their scoped view after login; they cannot access other domains' data.
- Outside of recruitment season, only the tech/admin login is active.

---

## Form Validation Rules

Applied to both the Recruitment and Registration/Volunteer forms:

| Rule | Details |
|------|---------|
| Required fields | No field may be empty |
| Type checking | String, number enforced per field |
| SRN format | Regex pattern validation |
| Email format | Standard email regex |
| Phone number | Format + length validation |
| Min/Max length | Enforced per field |
| Allowed values | Dropdowns restricted to valid options |
| Links section | Each entry must be a valid URL; number of links is dynamic |

---

## Commit Message Format

```
type: description
```

**Types:**
- `feat` - New features
- `fix` - Bug fixes
- `docs` - Documentation
- `style` - Formatting
- `refactor` - Code improvements
- `test` - Tests
- `ci` - CI changes

---

*A branch of Club IRA*

*Building tradition through technology.*
