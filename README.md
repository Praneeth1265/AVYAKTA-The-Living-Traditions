# IRA - The AVYAKTA Chapter 
## AVYAKTA – The Living Traditions

A culturally rooted, vibrant website for Avyakta - a cultural multi-domain club that brings together students passionate about performing arts, design, technology, event management, and more.

---

## Tech Stack

- **Framework**: Next.js 14+ (App Router) with TypeScript (.tsx)
- **Styling**: Tailwind CSS
- **Animations**: CSS transitions
- **Backend/DB**: Supabase (PostgreSQL + Auth + Storage)
- **Forms**: React Hook Form + validation (regex + logic)
- **CI/CD**: GitHub Actions
- **Node.js**: v24.x
- Backend logic is handled using Next.js API routes (App Router)
---

## Project Structure

```
AVYAKTA-The-Living-Traditions/
│
├── frontend/                      # Next.js application
│   ├── src/
│   │   ├── app/                  # Next.js App Router (pages + routing)
│   │   │   ├── layout.tsx       # Root layout (required)
│   │   │   ├── page.tsx         # Home Page
│   │   │   ├── about/
│   │   │   │   └── page.tsx
│   │   │   ├── about-ira/
│   │   │   │   └── page.tsx
│   │   │   ├── recruitment/
│   │   │   │   └── page.tsx
│   │   │   ├── events/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx
│   │   │   ├── gallery/
│   │   │   │   └── page.tsx
│   │   │   ├── members/
│   │   │   │   └── page.tsx
│   │   │   ├── registrations/
│   │   │   │   └── page.tsx
│   │   │   ├── history/
│   │   │   │   └── page.tsx
│   │   │   └── avyakta-control/
│   │   │       └── [hash]/      # Dynamic hidden admin route
│   │   │           ├── page.tsx
│   │   │           └── dashboard/
│   │   │               ├── page.tsx
│   │   │               ├── announcements/
│   │   │               ├── recruitment/
│   │   │               ├── events/
│   │   │               ├── gallery/
│   │   │               ├── members/
│   │   │               └── users/
│   │   ├── app/api/             # Next.js API routes (backend logic)
│   │   │   ├── recruitment/
│   │   │   │   └── route.ts     # POST - submit applications
│   │   │   ├── events/
│   │   │   │   └── route.ts     # CRUD - events
│   │   │   ├── gallery/
│   │   │   │   └── route.ts     # GET, POST - images
│   │   │   ├── members/
│   │   │   │   └── route.ts     # GET, POST - members
│   │   │   ├── announcements/
│   │   │   │   └── route.ts     # GET, POST - announcements
│   │   │   └── admin/
│   │   │       └── recruits/
│   │   │           └── route.ts # GET, PATCH - admin recruit actions
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
│   │   │   ├── supabase/        # Supabase client & config
│   │   │   └── utils/           # Helper functions
│   │   │
│   │   ├── hooks/               # Custom React hooks
│   │   ├── styles/              # Global styles
│   │   └── assets/
│   │       ├── icons/           # Custom SVG icons (diya, rangoli)
│   │       └── patterns/        # SVG patterns (paisley, jaali)
│   │
│   ├── public/
│   │   └── images/
│   │
│   ├── .env.local               # Environment variables (DO NOT COMMIT)
│   ├── tailwind.config.js
│   ├── next.config.js
│   └── package.json
│
├── .github/
│   └── workflows/
│       └── ci.yml               # CI Pipeline
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

| Branch | Purpose | Protection |
|--------|---------|------------|
| `main` | Production-ready code | Protected |
| `dev` | Integration layer | Protected |
| `team/1-core-structure` | Team 1 integration | Protected (min approvals=2)|
| `team/2-recruitment-data` | Team 2 integration | Protected (min approvals=2)|
| `team/3-events-gallery-ux` | Team 3 integration | Protected (min approvals=2)|
| `feature/*` | Individual work | Not protected |

### Workflow

1. Create feature branch from your team branch:
   ```bash
   git checkout team/1-core-structure
   git checkout -b feature/navbar
   ```

2. Work and commit:
   ```bash
   git commit -m "feat: add navbar component"
   git push origin feature/navbar
   ```

3. Create PR → your team branch (e.g., `team/1-core-structure`)

4. After review, create PR → `dev`

### Rules

- No direct push to protected branches
- All changes via PRs
- CI checks must pass before merging
- Strictly don't make changes in CI Pipeline

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

Note: The main application is inside the `frontend/` folder.

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

- Node.js v24.x required
- Do NOT commit `node_modules/` 
- Follow the project structure
- Write clean, modular code
- Use only TypeScript (.tsx / .ts). Do not use .js or .jsx files
- Supabase keys and environment variables must be stored in .env.local and never committed
- Authentication and role-based access (admin/domain heads) will be handled using Supabase Auth

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
