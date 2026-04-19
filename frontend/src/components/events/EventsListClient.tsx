"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Event {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  date: string | null;
  venue?: string | null;
  registration_status?: boolean;
}

export default function EventsListClient() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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
      if (!result.success) throw new Error(result.error || "Failed to fetch events");

      // Ensure registration_status defaults to true if undefined
      const eventsWithDefaults = (result.data || []).map((event: Event) => ({
        ...event,
        registration_status: event.registration_status !== undefined ? event.registration_status : true,
      }));

      console.log("Fetched events with status:", eventsWithDefaults);
      setEvents(eventsWithDefaults);
      setError("");
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch events");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  if (isLoading) {
    return (
      <main className="events-page-container">
        <div className="events-wrapper">
          <p className="loading">Loading events...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="events-page-container">
        <div className="events-wrapper">
          <div className="alert alert-error">{error}</div>
        </div>
      </main>
    );
  }

  return (
    <main className="events-page-container">
      <div className="events-wrapper">
        <div className="events-page-header">
          <h1>📅 Events</h1>
          <p>Explore our upcoming events and register now</p>
        </div>

        {events.length === 0 ? (
          <div className="empty-state">
            <p>No events available at the moment</p>
          </div>
        ) : (
          <div className="events-grid">
            {events.map((event) => (
              <div
                key={event.id}
                className="event-card"
              >
                {event.image_url && (
                  <div className="event-image">
                    <img src={event.image_url} alt={event.title} />
                  </div>
                )}

                <div className="event-content">
                  <h3>{event.title}</h3>

                  {event.date && (
                    <p className="event-date">
                      📅 {new Date(event.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  )}

                  {event.venue && (
                    <p className="event-venue">📍 {event.venue}</p>
                  )}

                  {event.description && (
                    <p className="event-description">{event.description}</p>
                  )}

                  <div className="event-footer">
                    <Link
                      href={`/events/${event.id}`}
                      className="btn-view-event"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .events-page-container {
          min-height: 100vh;
          padding: 20px;
          background: linear-gradient(135deg, #f0f4f8 0%, #f5f0e8 50%, #f0f4f8 100%);
        }

        .events-wrapper {
          max-width: 1200px;
          margin: 0 auto;
        }

        .events-page-header {
          margin-bottom: 32px;
        }

        .events-page-header h1 {
          margin: 0 0 8px 0;
          font-size: 36px;
          font-weight: 700;
          color: #1f2937;
        }

        .events-page-header p {
          margin: 0;
          font-size: 16px;
          color: #6b7280;
        }

        .empty-state {
          text-align: center;
          padding: 48px 20px;
          color: #6b7280;
        }

        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }

        .event-card {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        .event-card:hover {
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }

        .event-image {
          width: 100%;
          height: 200px;
          overflow: hidden;
          background: #f3f4f6;
        }

        .event-image {
          position: relative;
        }

        .event-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .event-content {
          padding: 16px;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }

        .event-content h3 {
          margin: 0 0 8px 0;
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
        }

        .event-date,
        .event-venue {
          margin: 4px 0;
          font-size: 13px;
          color: #6b7280;
        }

        .event-description {
          margin: 8px 0;
          font-size: 13px;
          color: #6b7280;
          line-height: 1.5;
          flex-grow: 1;
        }

        .event-footer {
          margin-top: 12px;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .btn-view-event {
          padding: 8px 12px;
          font-size: 13px;
          font-weight: 600;
          border: none;
          border-radius: 4px;
          background: #3b82f6;
          color: white;
          cursor: pointer;
          text-decoration: none;
          text-align: center;
          transition: all 0.2s ease;
        }

        .btn-view-event:hover {
          background: #2563eb;
        }

        .loading {
          text-align: center;
          padding: 40px 20px;
          color: #6b7280;
        }

        .alert-error {
          padding: 12px 16px;
          background: #fee2e2;
          color: #991b1b;
          border-radius: 4px;
          margin-bottom: 16px;
        }

        @media (max-width: 768px) {
          .events-grid {
            grid-template-columns: 1fr;
          }

          .events-page-header h1 {
            font-size: 28px;
          }
        }
      `}</style>
    </main>
  );
}
