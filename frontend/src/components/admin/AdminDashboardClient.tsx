"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminMembersClient from "./AdminMembersClient";
import AdminEventsClient from "./AdminEventsClient";
import RecruitmentStatsClient from "./RecruitmentStatsClient";
import EventRegistrationsClient from "./EventRegistrationsClient";

export default function AdminDashboardClient() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<
    "members" | "events" | "recruitment" | "registrations"
  >("members");

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth/login");
  };

  return (
    <div className="dashboard-layout">
      <header className="dashboard-top-bar">
        <div className="topbar-content">
          <div className="topbar-left">
            <h1 className="topbar-title">Avyakta Admin</h1>
            <nav className="topbar-nav">
              <button
                className={`nav-btn ${activeSection === "members" ? "active" : ""}`}
                onClick={() => setActiveSection("members")}
              >
                👥 Members
              </button>
              <button
                className={`nav-btn ${activeSection === "events" ? "active" : ""}`}
                onClick={() => setActiveSection("events")}
              >
                📅 Events
              </button>
              <button
                className={`nav-btn ${activeSection === "registrations" ? "active" : ""}`}
                onClick={() => setActiveSection("registrations")}
              >
                🔐 Registrations
              </button>
              <button
                className={`nav-btn ${activeSection === "recruitment" ? "active" : ""}`}
                onClick={() => setActiveSection("recruitment")}
              >
                💼 Recruitment
              </button>
            </nav>
          </div>
          <button type="button" onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        {activeSection === "members" && <AdminMembersClient />}
        {activeSection === "events" && <AdminEventsClient />}
        {activeSection === "registrations" && <EventRegistrationsClient />}
        {activeSection === "recruitment" && <RecruitmentStatsClient />}
      </main>

      <style jsx>{`
        .dashboard-layout {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        .dashboard-top-bar {
          background: white;
          border-bottom: 1px solid #e5e7eb;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .topbar-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 16px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .topbar-left {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .topbar-title {
          margin: 0;
          font-size: 20px;
          font-weight: 700;
          color: #1f2937;
          white-space: nowrap;
        }

        .topbar-nav {
          display: flex;
          gap: 12px;
          margin: 0;
        }

        .nav-btn {
          padding: 8px 16px;
          background-color: transparent;
          color: #6b7280;
          border: 2px solid transparent;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .nav-btn:hover {
          color: #3b82f6;
          border-color: #3b82f6;
        }

        .nav-btn.active {
          background-color: #eff6ff;
          color: #3b82f6;
          border-color: #3b82f6;
        }

        .btn-logout {
          padding: 10px 20px;
          background-color: #ef4444;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
          white-space: nowrap;
        }

        .btn-logout:hover {
          background-color: #dc2626;
        }

        .dashboard-main {
          flex: 1;
        }

        @media (max-width: 768px) {
          .topbar-content {
            padding: 12px 16px;
            flex-direction: column;
            gap: 12px;
          }

          .topbar-left {
            gap: 16px;
            width: 100%;
            flex-direction: column;
          }

          .topbar-title {
            font-size: 18px;
          }

          .topbar-nav {
            width: 100%;
            flex-wrap: wrap;
          }

          .nav-btn {
            flex: 1;
            min-width: 120px;
          }

          .btn-logout {
            padding: 8px 16px;
            font-size: 13px;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
