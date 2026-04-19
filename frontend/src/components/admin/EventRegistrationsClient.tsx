"use client";

import { useEffect, useState } from "react";

interface Event {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  date: string | null;
  venue?: string | null;
  registration_enabled?: boolean;
  registration_status?: boolean;
}

export default function EventRegistrationsClient() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/events?ts=" + Date.now(), {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      if (!response.ok) throw new Error("Failed to fetch events");

      const result = await response.json();
      if (!result.success)
        throw new Error(result.error || "Failed to fetch events");

      setEvents(result.data || []);
      setError("");
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch events");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleRegistration = async (event: Event) => {
    try {
      setTogglingId(event.id);
      const newStatus = !event.registration_status;

      // Immediately update UI
      setEvents((prev) =>
        prev.map((e) =>
          e.id === event.id ? { ...e, registration_status: newStatus } : e,
        ),
      );

      const response = await fetch(`/api/events/${event.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registration_status: newStatus,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        // Revert on error
        setEvents((prev) =>
          prev.map((e) =>
            e.id === event.id ? { ...e, registration_status: !newStatus } : e,
          ),
        );
        throw new Error(result.error || "Failed to toggle registration");
      }

      setSuccessMessage(
        `✅ Registration ${newStatus ? "opened" : "closed"} for ${event.title}`,
      );
      setTimeout(() => setSuccessMessage(""), 3000);

      // Re-fetch to verify server state
      setTimeout(() => {
        fetchEvents();
      }, 1000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to toggle registration",
      );
      setTimeout(() => setError(""), 3000);
    } finally {
      setTogglingId(null);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <main className="registrations-container">
      <div className="registrations-wrapper">
        <div className="registrations-header">
          <h1>📋 Event Registration Management</h1>
          <p>Enable or disable registrations for each event</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {successMessage && (
          <div className="alert alert-success">{successMessage}</div>
        )}

        <div className="events-table">
          {isLoading ? (
            <p className="loading">Loading events...</p>
          ) : events.length === 0 ? (
            <p className="empty-state">No events found</p>
          ) : (
            <div className="table-wrapper">
              <table className="events-list-table">
                <thead>
                  <tr>
                    <th>Event Title</th>
                    <th>Date</th>
                    <th>Venue</th>
                    <th>Registration Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr
                      key={event.id}
                      className={
                        event.registration_status ? "enabled" : "disabled"
                      }
                    >
                      <td className="event-title">{event.title}</td>
                      <td className="event-date">
                        {event.date
                          ? new Date(event.date).toLocaleDateString()
                          : "No date"}
                      </td>
                      <td className="event-venue">{event.venue || "TBA"}</td>
                      <td className="event-status">
                        <span
                          className={`status-badge ${event.registration_status ? "open" : "closed"}`}
                        >
                          {event.registration_status ? "✅ OPEN" : "❌ CLOSED"}
                        </span>
                      </td>
                      <td className="event-action">
                        <button
                          onClick={() => handleToggleRegistration(event)}
                          disabled={togglingId === event.id}
                          className={`btn-toggle ${event.registration_status ? "disable" : "enable"}`}
                        >
                          {togglingId === event.id
                            ? "..."
                            : event.registration_status
                              ? "🔒 Close"
                              : "🔓 Open"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .registrations-container {
          min-height: 100vh;
          padding: 20px;
          background: linear-gradient(
            135deg,
            #f0f4f8 0%,
            #f5f0e8 50%,
            #f0f4f8 100%
          );
        }

        .registrations-wrapper {
          max-width: 1200px;
          margin: 0 auto;
        }

        .registrations-header {
          margin-bottom: 24px;
        }

        .registrations-header h1 {
          margin: 0 0 8px 0;
          font-size: 32px;
          font-weight: 700;
          color: #1f2937;
        }

        .registrations-header p {
          margin: 0;
          font-size: 14px;
          color: #6b7280;
        }

        .alert {
          padding: 12px 16px;
          border-radius: 4px;
          margin-bottom: 16px;
          font-size: 13px;
          font-weight: 500;
        }

        .alert-error {
          background-color: #fee2e2;
          color: #991b1b;
          border: 1px solid #fecaca;
        }

        .alert-success {
          background-color: #dcfce7;
          color: #166534;
          border: 1px solid #86efac;
        }

        .events-table {
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .table-wrapper {
          overflow-x: auto;
        }

        .events-list-table {
          width: 100%;
          border-collapse: collapse;
        }

        .events-list-table thead {
          background: #f3f4f6;
          border-bottom: 2px solid #e5e7eb;
        }

        .events-list-table th {
          padding: 12px 16px;
          text-align: left;
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .events-list-table td {
          padding: 12px 16px;
          border-bottom: 1px solid #e5e7eb;
          font-size: 14px;
          color: #1f2937;
        }

        .events-list-table tbody tr:hover {
          background-color: #f9fafb;
        }

        .events-list-table tbody tr.enabled {
          background-color: #f0fdf4;
        }

        .events-list-table tbody tr.disabled {
          background-color: #fef2f2;
        }

        .event-title {
          font-weight: 600;
          color: #1f2937;
        }

        .event-date {
          color: #6b7280;
          font-size: 13px;
        }

        .event-status {
          text-align: center;
        }

        .status-badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
        }

        .status-badge.open {
          background-color: #dcfce7;
          color: #166534;
        }

        .status-badge.closed {
          background-color: #fee2e2;
          color: #991b1b;
        }

        .event-action {
          text-align: center;
        }

        .btn-toggle {
          padding: 8px 12px;
          border: none;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .btn-toggle.enable {
          background-color: #dcfce7;
          color: #166534;
          border: 1px solid #86efac;
        }

        .btn-toggle.enable:hover:not(:disabled) {
          background-color: #bbf7d0;
        }

        .btn-toggle.disable {
          background-color: #fee2e2;
          color: #991b1b;
          border: 1px solid #fecaca;
        }

        .btn-toggle.disable:hover:not(:disabled) {
          background-color: #fecaca;
        }

        .btn-toggle:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .loading,
        .empty-state {
          padding: 40px;
          text-align: center;
          color: #9ca3af;
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .registrations-wrapper {
            padding: 0;
          }

          .events-list-table {
            font-size: 12px;
          }

          .events-list-table th,
          .events-list-table td {
            padding: 8px 12px;
          }

          .btn-toggle {
            padding: 6px 10px;
            font-size: 11px;
          }
        }
      `}</style>
    </main>
  );
}
