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
| Team 1 - Core & Structure | Teja, Arrham, Preksha | Layout, Navbar, Footer, Home, About, Admin |
| Team 2 - Recruitment & Data | Suhith, Vrushabendra, Navyashree | Forms, Supabase, Domain Head Dashboard |
| Team 3 - Events, Gallery & UX | Naman, Akhil, Nikita | Events, Gallery, Members, History, Animations |

---

## Branching Strategy

- `main` → Production-ready code
- `dev` → Active development
- `feature/*` → Individual features

### Rules

- No direct push to `main` or `dev`
- All changes via Pull Requests
- CI checks must pass before merging

---

## CI Pipeline

The CI pipeline runs on every PR to `dev` and `main`:

1. Checkout code
2. Setup Node.js v24
3. Install dependencies (`npm ci`)
4. Run lint checks
5. Check formatting (Prettier)
6. Run unit tests
7. Build project
8. Install Playwright
9. Start app
10. Run E2E tests

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

- Node.js v24.x required
- Do NOT commit `node_modules/`
- Follow the project structure
- Write clean, modular code

---

*A branch of Club IRA*

*Building tradition through technology.*
