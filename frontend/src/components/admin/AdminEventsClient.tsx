"use client";

import { useEffect, useState } from "react";
import EventForm, { EventFormData } from "./EventForm";

interface EventSlug {
  id: string;
  event_id: string;
  more_description: string | null;
  image_url: string | null;
}

interface Poster {
  id: string;
  event_id: string;
  poster_image_url: string;
}

interface Event {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  date: string | null;
  venue?: string | null;
  registration_enabled?: boolean;
  registration_status?: boolean;
  payment_image_required?: boolean;
  event_slug?: EventSlug[];
  posters?: Poster[];
}

export default function AdminEventsClient() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
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

      if (!response.ok) throw new Error("Failed to fetch events");

      const result = await response.json();
      if (!result.success) throw new Error(result.error || "Failed to fetch events");

      const filteredEvents = (result.data || []).filter((e: any) => e?.id);
      setEvents(filteredEvents);
      setError("");
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch events");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission
  const handleFormSubmit = async (formData: EventFormData) => {
    try {
      setIsSubmitting(true);
      setError("");

      if (editingEvent) {
        // Update event
        const response = await fetch(`/api/events/${editingEvent.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error || `HTTP error! status: ${response.status}`);
        }
        if (!result.success) {
          throw new Error(result.error || "Failed to update event");
        }

        setEvents((prev) =>
          prev
            .map((e) => (e?.id === editingEvent.id ? result.data : e))
            .filter((e) => e?.id)
        );
        setSelectedEvent(result.data);
        setSuccessMessage("✅ Event updated successfully!");
        setEditingEvent(null);
      } else {
        // Create new event
        const payload = {
          ...formData,
          title: formData.title.trim(),
          description: formData.description.trim(),
        };

        const response = await fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error || `HTTP error! status: ${response.status}`);
        }
        if (!result.success) {
          throw new Error(result.error || "Failed to create event");
        }

        setEvents((prev) => [result.data, ...prev]);
        setSelectedEvent(result.data);
        setSuccessMessage("✅ Event created successfully!");
      }

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete event
  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) {
      return;
    }

    try {
      setIsDeletingId(id);
      const response = await fetch(`/api/events/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to delete event");
      }

      setEvents((prev) => prev.filter((e) => e?.id !== id));
      if (selectedEvent?.id === id) {
        setSelectedEvent(null);
      }
      if (editingEvent?.id === id) {
        setEditingEvent(null);
      }

      setSuccessMessage("✅ Event deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete event");
    } finally {
      setIsDeletingId(null);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setEditingEvent(null);
  };

  // Handle edit
  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setSelectedEvent(event);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <main className="events-admin-container">
      <div className="events-admin-wrapper">
        <div className="events-admin-header">
          <div className="events-admin-title-section">
            <p className="events-admin-label">Avyakta Admin</p>
            <h1>📅 Events Management</h1>
            <p>Create and manage events with details, images, and registration settings.</p>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}

        <div className="events-admin-layout">
          {/* Left: Form */}
          <div className="events-admin-form-section">
            <div className="form-card">
              <EventForm
                event={editingEvent || undefined}
                onSubmit={handleFormSubmit}
                onCancel={handleCancel}
                isLoading={isSubmitting}
              />
            </div>
          </div>

          {/* Right: Events List */}
          <div className="events-admin-list-section">
            <div className="list-card">
              <div className="list-header">
                <h2>📋 Events List</h2>
                <span className="event-count">{events.length}</span>
              </div>

              {isLoading ? (
                <p className="loading">Loading events...</p>
              ) : events.length === 0 ? (
                <p className="empty-state">No events created yet. Create one using the form.</p>
              ) : (
                <div className="events-admin-item-list">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className={`events-admin-item ${selectedEvent?.id === event.id ? "selected" : ""}`}
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="events-admin-item-content">
                        <h4>{event.title}</h4>
                        <p className="event-date">
                          📅 {event.date ? new Date(event.date).toLocaleDateString() : "No date"}
                        </p>
                        <p className="event-desc">
                          {event.description ? event.description.substring(0, 60) + "..." : "No description"}
                        </p>
                      </div>

                      <div className="events-admin-item-actions">
                        <button
                          className="btn-edit"
                          onClick={() => handleEditEvent(event)}
                          disabled={editingEvent?.id === event.id}
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteEvent(event.id)}
                          disabled={isDeletingId === event.id}
                        >
                          {isDeletingId === event.id ? "⏳" : "🗑️"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Detail Panel */}
          {selectedEvent && !editingEvent && (
            <div className="events-details-section">
              <div className="details-card">
                <div className="details-header">
                  <h2>📋 Event Details</h2>
                  <button
                    className="btn-close-details"
                    onClick={() => setSelectedEvent(null)}
                  >
                    ✕
                  </button>
                </div>

                <div className="details-content">
                  {/* Basic Info */}
                  <div className="detail-section">
                    <h3>Basic Information</h3>
                    <div className="detail-item">
                      <label>Title:</label>
                      <p>{selectedEvent.title}</p>
                    </div>
                    <div className="detail-item">
                      <label>Description:</label>
                      <p>{selectedEvent.description || "No description"}</p>
                    </div>
                    <div className="detail-item">
                      <label>Date:</label>
                      <p>
                        📅{" "}
                        {selectedEvent.date
                          ? new Date(selectedEvent.date).toLocaleDateString()
                          : "No date set"}
                      </p>
                    </div>
                  </div>

                  {/* Cover Image */}
                  {selectedEvent.image_url && (
                    <div className="detail-section">
                      <h3>Cover Image</h3>
                      <img
                        src={selectedEvent.image_url}
                        alt={selectedEvent.title}
                        className="detail-image-preview"
                      />
                    </div>
                  )}

                  {/* Event Details (Slug) */}
                  {selectedEvent.event_slug && selectedEvent.event_slug.length > 0 && (
                    <div className="detail-section">
                      <h3>Event Details</h3>
                      {selectedEvent.event_slug.map((slug) => (
                        <div key={slug.id}>
                          <div className="detail-item">
                            <label>More Description:</label>
                            <p>{slug.more_description || "No additional description"}</p>
                          </div>
                          {slug.image_url && (
                            <div className="detail-item">
                              <label>Detail Images:</label>
                              <div className="image-grid">
                                {slug.image_url.split("|").map((url, idx) => (
                                  <img
                                    key={idx}
                                    src={url.trim()}
                                    alt={`Detail ${idx + 1}`}
                                    className="detail-grid-image"
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Posters */}
                  {selectedEvent.posters && selectedEvent.posters.length > 0 && (
                    <div className="detail-section">
                      <h3>Posters ({selectedEvent.posters.length})</h3>
                      <div className="image-grid">
                        {selectedEvent.posters.map((poster) => (
                          <img
                            key={poster.id}
                            src={poster.poster_image_url}
                            alt="Poster"
                            className="detail-grid-image"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="detail-actions">
                    <button
                      className="btn-edit-detail"
                      onClick={() => handleEditEvent(selectedEvent)}
                    >
                      ✏️ Edit Event
                    </button>
                    <button
                      className="btn-delete-detail"
                      onClick={() => handleDeleteEvent(selectedEvent.id)}
                      disabled={isDeletingId === selectedEvent.id}
                    >
                      {isDeletingId === selectedEvent.id ? "⏳ Deleting..." : "🗑️ Delete Event"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .events-admin-container {
          min-height: 100vh;
          padding: 20px;
          background: linear-gradient(135deg, #f0f4f8 0%, #f5f0e8 50%, #f0f4f8 100%);
        }

        .events-admin-wrapper {
          max-width: 1600px;
          margin: 0 auto;
        }

        .events-admin-header {
          margin-bottom: 24px;
        }

        .events-admin-title-section {
          margin-bottom: 16px;
        }

        .events-admin-label {
          margin: 0;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #6b7280;
        }

        .events-admin-title-section h1 {
          margin: 8px 0;
          font-size: 32px;
          font-weight: 700;
          color: #1f2937;
        }

        .events-admin-title-section p {
          margin: 4px 0 0 0;
          font-size: 14px;
          color: #6b7280;
        }

        .alert {
          padding: 12px 16px;
          border-radius: 6px;
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

        .events-admin-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          min-height: 800px;
        }

        .events-admin-form-section {
          display: flex;
          flex-direction: column;
        }

        .form-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .events-admin-list-section {
          display: flex;
          flex-direction: column;
        }

        .list-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .list-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #e5e7eb;
          background: #f9fafb;
        }

        .list-header h2 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
        }

        .event-count {
          display: inline-block;
          padding: 4px 10px;
          background-color: #3b82f6;
          color: white;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .loading,
        .empty-state {
          padding: 40px 20px;
          text-align: center;
          color: #9ca3af;
          font-size: 14px;
        }

        .events-admin-item-list {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 12px;
        }

        .events-admin-item {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          padding: 12px;
          background: #f9fafb;
          border: 2px solid transparent;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .events-admin-item:hover {
          background: #f3f4f6;
          border-color: #e5e7eb;
        }

        .events-admin-item.selected {
          background: #eff6ff;
          border-color: #3b82f6;
        }

        .events-admin-item-content {
          flex: 1;
          min-width: 0;
        }

        .events-admin-item-content h4 {
          margin: 0 0 4px 0;
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .event-date {
          margin: 0 0 2px 0;
          font-size: 12px;
          color: #6b7280;
        }

        .event-desc {
          margin: 0 0 6px 0;
          font-size: 12px;
          color: #9ca3af;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }

        .events-admin-item-actions {
          display: flex;
          gap: 6px;
        }

        .btn-edit,
        .btn-delete {
          padding: 6px 10px;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          background: white;
          border: 1px solid #d1d5db;
        }

        .btn-edit:hover:not(:disabled) {
          background: #eff6ff;
          border-color: #3b82f6;
        }

        .btn-delete:hover:not(:disabled) {
          background: #fee2e2;
          border-color: #fecaca;
        }

        .btn-edit:disabled,
        .btn-delete:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Detail Panel Styles */
        .events-details-section {
          grid-column: 2 / 3;
          grid-row: 2 / 3;
          overflow-y: auto;
          max-height: calc(100vh - 140px);
          padding: 0 12px;
        }

        .details-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          border: 1px solid #e5e7eb;
        }

        .details-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          border-bottom: 1px solid #e5e7eb;
          background: #f9fafb;
        }

        .details-header h2 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
        }

        .btn-close-details {
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          width: 32px;
          height: 32px;
          cursor: pointer;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .btn-close-details:hover {
          background: #f3f4f6;
          border-color: #9ca3af;
        }

        .details-content {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .detail-section {
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 12px;
        }

        .detail-section:last-of-type {
          border-bottom: none;
        }

        .detail-section h3 {
          margin: 0 0 12px 0;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .detail-item {
          margin-bottom: 10px;
        }

        .detail-item label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: #6b7280;
          margin-bottom: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .detail-item p {
          margin: 0;
          font-size: 14px;
          color: #1f2937;
          line-height: 1.5;
          word-break: break-word;
        }

        .detail-image-preview {
          width: 100%;
          max-height: 300px;
          object-fit: cover;
          border-radius: 6px;
          border: 1px solid #e5e7eb;
        }

        .image-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 8px;
          margin-top: 8px;
        }

        .detail-grid-image {
          width: 100%;
          height: 120px;
          object-fit: cover;
          border-radius: 4px;
          border: 1px solid #e5e7eb;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .detail-grid-image:hover {
          transform: scale(1.05);
        }

        .detail-actions {
          display: flex;
          gap: 8px;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #e5e7eb;
        }

        .btn-edit-detail,
        .btn-delete-detail {
          flex: 1;
          padding: 10px 12px;
          border: none;
          border-radius: 4px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-edit-detail {
          background: #3b82f6;
          color: white;
        }

        .btn-edit-detail:hover {
          background: #2563eb;
        }

        .btn-delete-detail {
          background: #ef4444;
          color: white;
        }

        .btn-delete-detail:hover:not(:disabled) {
          background: #dc2626;
        }

        .btn-delete-detail:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        @media (max-width: 1200px) {
          .events-admin-layout {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .events-details-section {
            grid-column: 1 / 2;
            grid-row: 3 / 4;
            max-height: 400px;
            margin-top: 12px;
          }
        }

        @media (max-width: 768px) {
          .events-admin-container {
            padding: 12px;
          }

          .events-admin-title-section h1 {
            font-size: 24px;
          }

          .events-admin-layout {
            min-height: auto;
          }

          .events-admin-item-list {
            max-height: 400px;
          }
        }
      `}</style>
    </main>
  );
}
