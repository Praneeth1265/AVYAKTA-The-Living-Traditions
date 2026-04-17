"use client";

import { useEffect, useState } from "react";

interface Event {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  date: string | null;
  registration_enabled?: boolean;
  payment_image_required?: boolean;
}

export default function EventRegistrationsClient() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch all events
  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/events?ts=" + Date.now(), {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch events");
      }

      console.log("Events fetched:", result.data);
      setEvents(result.data || []);
      setError("");
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch events");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle toggle registration
  const handleToggleRegistration = async (event: Event) => {
    try {
      setIsSubmitting(true);
      const newStatus = !event.registration_enabled;

      console.log(`Toggling registration for event ${event.id} to ${newStatus}`);

      const response = await fetch(`/api/events/${event.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registration_enabled: newStatus,
        }),
      });

      const result = await response.json();
      console.log("API Response:", result);

      if (!response.ok) {
        throw new Error(result.error || "Failed to toggle registration");
      }
      if (!result.success) {
        throw new Error(result.error || "Failed to toggle registration");
      }

      setSuccessMessage(
        `Registration ${newStatus ? "enabled" : "disabled"} for ${event.title}`
      );

      // Refetch all events to ensure we have the latest data
      await fetchEvents();
      
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error toggling registration:", err);
      setError(
        err instanceof Error ? err.message : "Failed to toggle registration"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <main className="registrations-container">
      <div className="registrations-wrapper">
        <div className="registrations-header">
          <div className="registrations-title-section">
            <p className="registrations-label">Avyakta Admin</p>
            <h1>Event Registrations Management</h1>
            <p>Enable or disable event registrations for each event.</p>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {successMessage && (
          <div className="alert alert-success">{successMessage}</div>
        )}

        <div className="registrations-content">
          <div className="registrations-section">
            {isLoading ? (
              <p className="loading">Loading events...</p>
            ) : events.length === 0 ? (
              <p className="empty-state">No events found. Create an event first.</p>
            ) : (
              <div className="registrations-grid">
                {events.filter((e) => e?.id).map((event) => (
                  <div
                    key={event.id}
                    className={`registration-card ${event.registration_enabled ? "enabled" : "disabled"}`}
                  >
                    <div className="card-header">
                      <div className="card-title-section">
                        <h3>{event.title}</h3>
                        {event.date && (
                          <p className="card-date">
                            📅 {new Date(event.date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className={`status-indicator ${event.registration_enabled ? "active" : ""}`}>
                        {event.registration_enabled ? "🔵" : "⭕"}
                      </div>
                    </div>

                    <div className="card-body">
                      <div className="current-status">
                        <span className="status-label">Current Status:</span>
                        <span
                          className={`status-value ${event.registration_enabled ? "enabled" : "disabled"}`}
                        >
                          {event.registration_enabled ? "📝 OPEN" : "🔒 CLOSED"}
                        </span>
                      </div>

                      {event.description && (
                        <p className="card-description">{event.description}</p>
                      )}
                    </div>

                    <div className="card-footer">
                      <button
                        onClick={() => handleToggleRegistration(event)}
                        className={`btn-toggle ${event.registration_enabled ? "close" : "open"}`}
                        disabled={isSubmitting}
                      >
                        {event.registration_enabled ? (
                          <>🔒 Close Registration</>
                        ) : (
                          <>📝 Open Registration</>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .registrations-container {
          min-height: 100vh;
          padding: 20px;
          background: linear-gradient(135deg, #f0f4f8 0%, #f5f0e8 50%, #f0f4f8 100%);
        }

        .registrations-wrapper {
          max-width: 1200px;
          margin: 0 auto;
        }

        .registrations-header {
          background: white;
          padding: 30px;
          margin-bottom: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .registrations-title-section {
          margin: 0;
        }

        .registrations-label {
          margin: 0 0 8px 0;
          font-size: 12px;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .registrations-header h1 {
          margin: 0 0 8px 0;
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
        }

        .registrations-header p {
          margin: 0;
          color: #6b7280;
          font-size: 14px;
        }

        .alert {
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-weight: 500;
        }

        .alert-error {
          background-color: #fee2e2;
          color: #991b1b;
          border-left: 4px solid #dc2626;
        }

        .alert-success {
          background-color: #dcfce7;
          color: #166534;
          border-left: 4px solid #16a34a;
        }

        .registrations-content {
          animation: fadeIn 0.3s ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .registrations-section {
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .loading,
        .empty-state {
          text-align: center;
          color: #9ca3af;
          font-size: 14px;
          padding: 40px 20px;
        }

        .registrations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
        }

        .registration-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          border-left: 4px solid;
        }

        .registration-card.enabled {
          border-left-color: #10b981;
          background: linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%);
        }

        .registration-card.disabled {
          border-left-color: #ef4444;
          background: linear-gradient(135deg, #ffffff 0%, #fef2f2 100%);
        }

        .registration-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e5e7eb;
        }

        .card-title-section {
          flex: 1;
        }

        .card-header h3 {
          margin: 0 0 6px 0;
          font-size: 16px;
          font-weight: 700;
          color: #1f2937;
        }

        .card-date {
          margin: 0;
          font-size: 13px;
          color: #6b7280;
        }

        .status-indicator {
          font-size: 24px;
          line-height: 1;
          animation: pulse 2s infinite;
        }

        .status-indicator.active {
          color: #10b981;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .card-body {
          margin-bottom: 16px;
        }

        .current-status {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          padding: 12px;
          background: #f9fafb;
          border-radius: 6px;
        }

        .status-label {
          font-weight: 600;
          color: #6b7280;
          font-size: 13px;
        }

        .status-value {
          font-weight: 700;
          font-size: 14px;
          padding: 4px 12px;
          border-radius: 4px;
        }

        .status-value.enabled {
          background-color: #dcfce7;
          color: #166534;
        }

        .status-value.disabled {
          background-color: #fee2e2;
          color: #991b1b;
        }

        .card-description {
          margin: 0;
          font-size: 13px;
          color: #6b7280;
          line-height: 1.5;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .card-footer {
          display: flex;
          gap: 8px;
        }

        .btn-toggle {
          flex: 1;
          padding: 12px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .btn-toggle.open {
          background-color: #dcfce7;
          color: #166534;
          border: 2px solid #86efac;
        }

        .btn-toggle.open:hover:not(:disabled) {
          background-color: #bbf7d0;
          border-color: #4ade80;
          transform: translateY(-2px);
        }

        .btn-toggle.close {
          background-color: #fee2e2;
          color: #991b1b;
          border: 2px solid #fca5a5;
        }

        .btn-toggle.close:hover:not(:disabled) {
          background-color: #fecaca;
          border-color: #f87171;
          transform: translateY(-2px);
        }

        .btn-toggle:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .registrations-container {
            padding: 12px;
          }

          .registrations-header {
            padding: 20px;
          }

          .registrations-header h1 {
            font-size: 22px;
          }

          .registrations-grid {
            grid-template-columns: 1fr;
          }

          .card-footer {
            flex-direction: column;
          }

          .btn-toggle {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}
