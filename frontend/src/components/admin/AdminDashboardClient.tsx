"use client";

import { useRouter } from "next/navigation";

export default function AdminDashboardClient() {
  const router = useRouter();

  return (
    <main
      className="dashboard-container"
      style={{
        background:
          "linear-gradient(135deg, #f0f4f8 0%, #f5f0e8 50%, #f0f4f8 100%)",
        position: "relative",
      }}
    >
      <div className="dashboard-wrapper">
        <div className="dashboard-header">
          <div className="dashboard-title-section">
            <p className="dashboard-label">Avyakta Admin</p>
            <h1>Admin Dashboard</h1>
            <p>Manage events, members, registrations, and content from here.</p>
          </div>

          <button
            type="button"
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              router.push("/auth/login");
            }}
            className="dashboard-logout-btn"
          >
            Logout
          </button>
        </div>

        <div className="dashboard-grid">
          {[
            {
              title: "Events",
              description: "Create and manage upcoming events and schedules.",
              className: "dashboard-card-events",
            },
            {
              title: "Members",
              description: "Track members and their roles inside the club.",
              className: "dashboard-card-members",
            },
            {
              title: "Registrations",
              description: "Review registrations and control submissions.",
              className: "dashboard-card-registrations",
            },
          ].map((card) => (
            <section
              key={card.title}
              className={`dashboard-card ${card.className}`}
            >
              <h2>{card.title}</h2>
              <p>{card.description}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
