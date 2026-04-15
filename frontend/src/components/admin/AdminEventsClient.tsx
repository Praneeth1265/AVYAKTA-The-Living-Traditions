"use client";

import { useEffect, useState } from "react";
import EventForm, { EventFormData } from "./EventForm";
import EventDetailsPanel from "./EventDetailsPanel";

interface EventSlug {
  id: string;
  event_id: string;
  title: string;
  more_description: string | null;
  image_url: string | null;
}

interface Poster {
  id: string;
  event_id: string;
  title: string;
  poster_image_url: string;
}

interface Event {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  date: string | null;
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
  const [activeTab, setActiveTab] = useState<"add" | "view">("view");

  // Fetch all events
  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/events", {
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

      setEvents(result.data || []);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch events");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission (add or update)
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

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (!result.success) {
          throw new Error(result.error || "Failed to update event");
        }

        setEvents((prev) =>
          prev.map((e) => (e.id === editingEvent.id ? result.data : e))
        );
        if (selectedEvent?.id === editingEvent.id) {
          setSelectedEvent(result.data);
        }
        setSuccessMessage("Event updated successfully!");
        setEditingEvent(null);
        setActiveTab("view");
      } else {
        // Create new event
        const response = await fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (!result.success) {
          throw new Error(result.error || "Failed to create event");
        }

        setEvents((prev) => [result.data, ...prev]);
        setSuccessMessage("Event created successfully!");
        setActiveTab("view");
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete event
  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event and all related data?")) {
      return;
    }

    try {
      setIsDeletingId(id);
      const response = await fetch(`/api/events/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || "Failed to delete event");
      }

      setEvents((prev) => prev.filter((e) => e.id !== id));
      if (selectedEvent?.id === id) {
        setSelectedEvent(null);
      }
      setSuccessMessage("Event deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete event");
    } finally {
      setIsDeletingId(null);
    }
  };

  // Handle edit event
  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setSelectedEvent(null);
    setActiveTab("add");
  };

  // Handle cancel edit
  const handleCancel = () => {
    setEditingEvent(null);
    setError("");
  };

  // Handle slug add
  const handleAddSlug = async (slug: Omit<EventSlug, "id" | "event_id">) => {
    if (!selectedEvent) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/events/${selectedEvent.id}/slugs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(slug),
      });

      if (!response.ok) throw new Error("Failed to add slug");

      const result = await response.json();
      if (!result.success) throw new Error(result.error);

      const updatedEvent: Event = {
        ...selectedEvent,
        event_slug: [...(selectedEvent.event_slug || []), result.data],
      };

      setSelectedEvent(updatedEvent);
      setEvents((prev) =>
        prev.map((e) => (e.id === selectedEvent.id ? updatedEvent : e))
      );

      setSuccessMessage("Event information added successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add slug");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle slug update
  const handleUpdateSlug = async (
    slugId: string,
    data: Partial<EventSlug>
  ) => {
    if (!selectedEvent) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/events/${selectedEvent.id}/slugs`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slugId, ...data }),
      });

      if (!response.ok) throw new Error("Failed to update slug");

      const result = await response.json();
      if (!result.success) throw new Error(result.error);

      const updatedEvent: Event = {
        ...selectedEvent,
        event_slug: (selectedEvent.event_slug || []).map((s) =>
          s.id === slugId ? result.data : s
        ),
      };

      setSelectedEvent(updatedEvent);
      setEvents((prev) =>
        prev.map((e) => (e.id === selectedEvent.id ? updatedEvent : e))
      );

      setSuccessMessage("Event information updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update slug");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle slug delete
  const handleDeleteSlug = async (slugId: string) => {
    if (!confirm("Delete this event information?")) return;

    if (!selectedEvent) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/events/${selectedEvent.id}/slugs`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slugId }),
      });

      if (!response.ok) throw new Error("Failed to delete slug");

      const result = await response.json();
      if (!result.success) throw new Error(result.error);

      const updatedEvent: Event = {
        ...selectedEvent,
        event_slug: (selectedEvent.event_slug || []).filter((s) => s.id !== slugId),
      };

      setSelectedEvent(updatedEvent);
      setEvents((prev) =>
        prev.map((e) => (e.id === selectedEvent.id ? updatedEvent : e))
      );

      setSuccessMessage("Event information deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete slug");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle poster add
  const handleAddPoster = async (poster: Omit<Poster, "id" | "event_id">) => {
    if (!selectedEvent) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/events/${selectedEvent.id}/posters`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(poster),
      });

      if (!response.ok) throw new Error("Failed to add poster");

      const result = await response.json();
      if (!result.success) throw new Error(result.error);

      const updatedEvent: Event = {
        ...selectedEvent,
        posters: [...(selectedEvent.posters || []), result.data],
      };

      setSelectedEvent(updatedEvent);
      setEvents((prev) =>
        prev.map((e) => (e.id === selectedEvent.id ? updatedEvent : e))
      );

      setSuccessMessage("Poster added successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add poster");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle poster update
  const handleUpdatePoster = async (
    posterId: string,
    data: Partial<Poster>
  ) => {
    if (!selectedEvent) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/events/${selectedEvent.id}/posters`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ posterId, ...data }),
      });

      if (!response.ok) throw new Error("Failed to update poster");

      const result = await response.json();
      if (!result.success) throw new Error(result.error);

      const updatedEvent: Event = {
        ...selectedEvent,
        posters: (selectedEvent.posters || []).map((p) =>
          p.id === posterId ? result.data : p
        ),
      };

      setSelectedEvent(updatedEvent);
      setEvents((prev) =>
        prev.map((e) => (e.id === selectedEvent.id ? updatedEvent : e))
      );

      setSuccessMessage("Poster updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update poster");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle poster delete
  const handleDeletePoster = async (posterId: string) => {
    if (!confirm("Delete this poster?")) return;

    if (!selectedEvent) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/events/${selectedEvent.id}/posters`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ posterId }),
      });

      if (!response.ok) throw new Error("Failed to delete poster");

      const result = await response.json();
      if (!result.success) throw new Error(result.error);

      const updatedEvent: Event = {
        ...selectedEvent,
        posters: (selectedEvent.posters || []).filter((p) => p.id !== posterId),
      };

      setSelectedEvent(updatedEvent);
      setEvents((prev) =>
        prev.map((e) => (e.id === selectedEvent.id ? updatedEvent : e))
      );

      setSuccessMessage("Poster deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete poster");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <main className="events-container">
      <div className="events-wrapper">
        <div className="events-header">
          <div className="events-title-section">
            <p className="events-label">Avyakta Admin</p>
            <h1>Events Management</h1>
            <p>Create, manage, and organize club events with detailed information and posters.</p>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {successMessage && (
          <div className="alert alert-success">{successMessage}</div>
        )}

        {/* Tabs */}
        <div className="tabs-container">
          <button
            className={`tab-button ${activeTab === "add" ? "active" : ""}`}
            onClick={() => setActiveTab("add")}
          >
            {editingEvent ? "✏️ Edit Event" : "➕ Add Event"}
          </button>
          <button
            className={`tab-button ${activeTab === "view" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("view");
              setEditingEvent(null);
            }}
          >
            📅 View Events ({events.length})
          </button>
        </div>

        <div className="events-content">
          {/* Add/Edit Section */}
          {activeTab === "add" && (
            <div className="section add-section">
              <EventForm
                event={editingEvent || undefined}
                onSubmit={handleFormSubmit}
                onCancel={handleCancel}
                isLoading={isSubmitting}
              />
            </div>
          )}

          {/* View Section */}
          {activeTab === "view" && (
            <div className="section view-section">
              <div className="events-grid">
                <div className="events-list">
                  <h3>Your Events</h3>
                  {isLoading ? (
                    <p className="loading">Loading events...</p>
                  ) : events.length === 0 ? (
                    <p className="empty-state">No events created yet. Create one to get started!</p>
                  ) : (
                    <div className="events-item-list">
                      {events.map((event) => (
                        <div
                          key={event.id}
                          className={`event-item ${selectedEvent?.id === event.id ? "selected" : ""}`}
                          onClick={() => setSelectedEvent(event)}
                        >
                          <div className="event-item-content">
                            <h4>{event.title}</h4>
                            {event.date && (
                              <p className="event-date">
                                📅 {new Date(event.date).toLocaleDateString()}
                              </p>
                            )}
                            <p className="event-info">
                              ℹ️ {event.event_slug?.length || 0} info items • 🖼️ {event.posters?.length || 0} posters
                            </p>
                          </div>
                          <div className="event-item-actions">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditEvent(event);
                              }}
                              className="btn-action btn-edit"
                              disabled={isDeletingId === event.id}
                            >
                              ✏️
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteEvent(event.id);
                              }}
                              className="btn-action btn-delete"
                              disabled={isDeletingId === event.id}
                            >
                              {isDeletingId === event.id ? "..." : "🗑️"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {selectedEvent && (
                  <div className="event-details">
                    <EventDetailsPanel
                      event={selectedEvent}
                      onAddSlug={handleAddSlug}
                      onUpdateSlug={handleUpdateSlug}
                      onDeleteSlug={handleDeleteSlug}
                      onAddPoster={handleAddPoster}
                      onUpdatePoster={handleUpdatePoster}
                      onDeletePoster={handleDeletePoster}
                      isLoading={isSubmitting}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .events-container {
          min-height: 100vh;
          padding: 20px;
          background: linear-gradient(
            135deg,
            #f0f4f8 0%,
            #f5f0e8 50%,
            #f0f4f8 100%
          );
        }

        .events-wrapper {
          max-width: 1400px;
          margin: 0 auto;
        }

        .events-header {
          margin-bottom: 32px;
        }

        .events-label {
          margin: 0;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #9ca3af;
        }

        .events-title-section h1 {
          margin: 4px 0 8px 0;
          font-size: 32px;
          font-weight: 700;
          color: #1f2937;
        }

        .events-title-section p {
          margin: 0;
          font-size: 16px;
          color: #6b7280;
        }

        .alert {
          padding: 12px 16px;
          border-radius: 6px;
          margin-bottom: 16px;
          font-size: 14px;
          font-weight: 500;
        }

        .alert-error {
          background-color: #fee2e2;
          border: 1px solid #fca5a5;
          color: #991b1b;
        }

        .alert-success {
          background-color: #dcfce7;
          border: 1px solid #86efac;
          color: #166534;
        }

        .tabs-container {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
        }

        .tab-button {
          padding: 12px 20px;
          background-color: white;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          color: #6b7280;
        }

        .tab-button:hover {
          border-color: #d1d5db;
          background-color: #f9fafb;
        }

        .tab-button.active {
          background-color: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        .events-content {
          display: flex;
          gap: 20px;
        }

        .section {
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .add-section {
          flex: 1;
          padding: 24px;
        }

        .view-section {
          flex: 1;
          padding: 0;
        }

        .events-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          min-height: 600px;
        }

        .events-list {
          border-right: 1px solid #e5e7eb;
          padding: 20px;
          display: flex;
          flex-direction: column;
        }

        .events-list h3 {
          margin: 0 0 16px 0;
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
        }

        .loading,
        .empty-state {
          text-align: center;
          color: #9ca3af;
          font-size: 14px;
          padding: 20px;
        }

        .events-item-list {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .event-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: #f9fafb;
          border: 2px solid transparent;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .event-item:hover {
          background: #f3f4f6;
          border-color: #e5e7eb;
        }

        .event-item.selected {
          background: #eff6ff;
          border-color: #3b82f6;
        }

        .event-item-content {
          flex: 1;
          min-width: 0;
        }

        .event-item-content h4 {
          margin: 0 0 4px 0;
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .event-date {
          margin: 0 0 2px 0;
          font-size: 12px;
          color: #6b7280;
        }

        .event-info {
          margin: 0;
          font-size: 11px;
          color: #9ca3af;
        }

        .event-item-actions {
          display: flex;
          gap: 6px;
          margin-left: 8px;
        }

        .btn-action {
          padding: 6px 8px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          transition: all 0.2s;
        }

        .btn-edit {
          background-color: #dbeafe;
          color: #1e40af;
        }

        .btn-edit:hover {
          background-color: #bfdbfe;
        }

        .btn-delete {
          background-color: #fee2e2;
          color: #991b1b;
        }

        .btn-delete:hover {
          background-color: #fecaca;
        }

        .btn-action:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .event-details {
          padding: 20px;
          display: flex;
          flex-direction: column;
        }

        @media (max-width: 1024px) {
          .events-grid {
            grid-template-columns: 1fr;
          }

          .events-list {
            border-right: none;
            border-bottom: 1px solid #e5e7eb;
            max-height: 300px;
          }
        }

        @media (max-width: 768px) {
          .events-container {
            padding: 12px;
          }

          .events-title-section h1 {
            font-size: 24px;
          }

          .events-grid {
            gap: 12px;
          }

          .events-list {
            padding: 12px;
          }

          .event-details {
            padding: 12px;
          }

          .add-section {
            padding: 12px;
          }
        }
      `}</style>
    </main>
  );
}
