# 🌿 AVYAKTA – The Living Traditions

Official website for **Avyakta**, designed and developed by the technical team.

---

## 🚀 Tech Stack

* **Frontend:** React (Vite)
* **Backend / DB:** Supabase
* **CI/CD:** GitHub Actions (CI Pipeline)
* **Node.js Version:** `v24.x`

---

## 📁 Project Structure

```bash
AVYAKTA-The-Living-Traditions/
│
├── frontend/        # React + Vite application
├── .github/         # CI workflow
└── README.md
```

---

## 👥 Team Structure & Responsibilities

### 🧩 Team 1 – Core Pages & Structure

**Suhith, Arrham, Preksha**

* Layout (Navbar, Footer, Routing)
* Home Page
* About Page
* Admin Dashboard
* Base Styling

---

### 📊 Team 2 – Recruitment + Data Flow

**Teja, Vrushabendra, Navyashree**

* Recruitment Form UI (Page)
* Form Validation
* Supabase Integration
* Data Storage & Structure

---

### 🎨 Team 3 – Events, Gallery & UI Enhancement

**Naman, Akhil, Nikita**

* Events Page
* Event Details Page
* Gallery
* Animations & Responsiveness
* Members Page
* Registrations

---

## 🌐 Development Workflow

### 🔹 Branching Strategy

* `main` → Production-ready code
* `dev` → Active development branch
* `feature/*` → Individual feature branches

---

### 🔹 Rules

* ❌ No direct push to `main`
* ❌ No direct push to `dev` (recommended)
* ✅ All changes via Pull Requests (PRs)
* ✅ At least 1 approval before merge
* ✅ CI checks must pass before merging

---

## ⚙️ CI Pipeline (GitHub Actions)

The project uses a **CI pipeline** to ensure code quality and prevent breaking changes.

### 🔄 Trigger:

* Runs on every **Pull Request** to `dev` and `main`

### 🛠 Steps:

1. Checkout repository
2. Setup Node.js (v24)
3. Install dependencies
4. Run lint checks
5. Build project

### ✅ Purpose:

* Catch errors early
* Enforce coding standards
* Ensure build stability

---

## 🧹 Code Quality

* ESLint → Code linting
* Prettier → Code formatting

Run locally:

```bash
npm run lint
npm run format
```

---

## 🛠 Setup Instructions

```bash
# Clone the repository
git clone https://github.com/Praneeth1265/AVYAKTA-The-Living-Traditions

# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

---

## 📌 Important Notes

* Ensure Node.js version `v24.x` is installed
* Do NOT commit `node_modules/`
* Follow folder structure and team boundaries
* Write clean, modular, and reusable code

---

## 🤝 Contribution Guidelines

1. Create a new branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make changes and commit using proper commit message conventions:

   ```bash
   git commit -m "FEAT: added feature description"
   ```

   Common commit types:

   * `FEAT:` → for new features
   * `FIX:` → for bug fixes
   * `DOCS:` → for documentation changes
   * `STYLE:` → for formatting (no logic change)
   * `REFACTOR:` → for code improvements without changing behavior
   * `TEST:` → for adding or updating tests

3. Push to GitHub:

   ```bash
   git push origin feature/your-feature-name
   ```

4. Create a Pull Request → `dev`

---

✨ *Building tradition through technology.*
