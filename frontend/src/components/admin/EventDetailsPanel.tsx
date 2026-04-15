"use client";

import React, { useState, useEffect } from "react";

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

interface EventDetailsPanelProps {
  event: Event;
  onAddSlug: (slug: Omit<EventSlug, "id" | "event_id">) => Promise<void>;
  onUpdateSlug: (slugId: string, data: Partial<EventSlug>) => Promise<void>;
  onDeleteSlug: (slugId: string) => Promise<void>;
  onAddPoster: (poster: Omit<Poster, "id" | "event_id">) => Promise<void>;
  onUpdatePoster: (posterId: string, data: Partial<Poster>) => Promise<void>;
  onDeletePoster: (posterId: string) => Promise<void>;
  isLoading: boolean;
}

export default function EventDetailsPanel({
  event,
  onAddSlug,
  onUpdateSlug,
  onDeleteSlug,
  onAddPoster,
  onUpdatePoster,
  onDeletePoster,
  isLoading,
}: EventDetailsPanelProps) {
  const [activeTab, setActiveTab] = useState<"slugs" | "posters">("slugs");
  const [slugFormData, setSlugFormData] = useState({
    title: "",
    more_description: "",
    image_url: "",
  });
  const [posterFormData, setPosterFormData] = useState({
    title: "",
    poster_image_url: "",
  });
  const [editingSlugId, setEditingSlugId] = useState<string | null>(null);
  const [editingPosterId, setEditingPosterId] = useState<string | null>(null);
  const [slugImagePreview, setSlugImagePreview] = useState<string>("");
  const [posterImagePreview, setPosterImagePreview] = useState<string>("");

  const handleSlugImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setSlugImagePreview(base64);
        setSlugFormData((prev) => ({
          ...prev,
          image_url: base64,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePosterImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPosterImagePreview(base64);
        setPosterFormData((prev) => ({
          ...prev,
          poster_image_url: base64,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSlug = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slugFormData.title) return;

    try {
      if (editingSlugId) {
        await onUpdateSlug(editingSlugId, slugFormData);
        setEditingSlugId(null);
      } else {
        await onAddSlug(slugFormData);
      }

      setSlugFormData({
        title: "",
        more_description: "",
        image_url: "",
      });
      setSlugImagePreview("");
    } catch (error) {
      console.error("Error saving slug:", error);
    }
  };

  const handleAddPoster = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!posterFormData.title || !posterFormData.poster_image_url) return;

    try {
      if (editingPosterId) {
        await onUpdatePoster(editingPosterId, posterFormData);
        setEditingPosterId(null);
      } else {
        await onAddPoster(posterFormData);
      }

      setPosterFormData({
        title: "",
        poster_image_url: "",
      });
      setPosterImagePreview("");
    } catch (error) {
      console.error("Error saving poster:", error);
    }
  };

  const handleEditSlug = (slug: EventSlug) => {
    setEditingSlugId(slug.id);
    setSlugFormData({
      title: slug.title,
      more_description: slug.more_description || "",
      image_url: slug.image_url || "",
    });
    setSlugImagePreview(slug.image_url || "");
  };

  const handleEditPoster = (poster: Poster) => {
    setEditingPosterId(poster.id);
    setPosterFormData({
      title: poster.title,
      poster_image_url: poster.poster_image_url,
    });
    setPosterImagePreview(poster.poster_image_url);
  };

  const handleCancelEdit = () => {
    setEditingSlugId(null);
    setEditingPosterId(null);
    setSlugFormData({
      title: "",
      more_description: "",
      image_url: "",
    });
    setPosterFormData({
      title: "",
      poster_image_url: "",
    });
    setSlugImagePreview("");
    setPosterImagePreview("");
  };

  return (
    <div className="event-details-panel">
      <div className="details-header">
        <h3>📋 Event Details</h3>
        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === "slugs" ? "active" : ""}`}
            onClick={() => setActiveTab("slugs")}
          >
            Event Information ({event.event_slug?.length || 0})
          </button>
          <button
            className={`tab-btn ${activeTab === "posters" ? "active" : ""}`}
            onClick={() => setActiveTab("posters")}
          >
            Posters ({event.posters?.length || 0})
          </button>
        </div>
      </div>

      {/* Slugs Section */}
      {activeTab === "slugs" && (
        <div className="details-section">
          <form onSubmit={handleAddSlug} className="detail-form">
            <h4>{editingSlugId ? "Edit Event Information" : "Add Event Information"}</h4>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="slug-title">Title *</label>
                <input
                  id="slug-title"
                  type="text"
                  value={slugFormData.title}
                  onChange={(e) =>
                    setSlugFormData((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  placeholder="Event information title"
                  required
                  disabled={isLoading}
                  maxLength={256}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="slug-desc">Description</label>
                <textarea
                  id="slug-desc"
                  value={slugFormData.more_description}
                  onChange={(e) =>
                    setSlugFormData((prev) => ({
                      ...prev,
                      more_description: e.target.value,
                    }))
                  }
                  placeholder="Detailed description"
                  rows={3}
                  disabled={isLoading}
                  maxLength={2048}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="slug-image">Image</label>
                <input
                  id="slug-image"
                  type="file"
                  accept="image/*"
                  onChange={handleSlugImageChange}
                  disabled={isLoading}
                  className="file-input"
                />
                {slugImagePreview && (
                  <div className="image-preview-small">
                    <img src={slugImagePreview} alt="Slug preview" />
                  </div>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                disabled={isLoading || !slugFormData.title}
                className="btn-save"
              >
                {isLoading ? "Saving..." : editingSlugId ? "Update" : "Add"}
              </button>
              {editingSlugId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={isLoading}
                  className="btn-cancel"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="items-list">
            <h4>Event Information Items</h4>
            {event.event_slug && event.event_slug.length > 0 ? (
              <div>
                {event.event_slug.map((slug) => (
                  <div key={slug.id} className="item-card">
                    <div className="item-header">
                      <h5>{slug.title}</h5>
                      <div className="item-actions">
                        <button
                          onClick={() => handleEditSlug(slug)}
                          className="btn-small btn-edit"
                          disabled={isLoading}
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => onDeleteSlug(slug.id)}
                          className="btn-small btn-delete"
                          disabled={isLoading}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    {slug.more_description && (
                      <p className="item-desc">{slug.more_description}</p>
                    )}
                    {slug.image_url && (
                      <img
                        src={slug.image_url}
                        alt={slug.title}
                        className="item-image"
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-state">No event information added yet</p>
            )}
          </div>
        </div>
      )}

      {/* Posters Section */}
      {activeTab === "posters" && (
        <div className="details-section">
          <form onSubmit={handleAddPoster} className="detail-form">
            <h4>{editingPosterId ? "Edit Poster" : "Add Poster"}</h4>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="poster-title">Poster Title *</label>
                <input
                  id="poster-title"
                  type="text"
                  value={posterFormData.title}
                  onChange={(e) =>
                    setPosterFormData((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  placeholder="Poster title"
                  required
                  disabled={isLoading}
                  maxLength={256}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="poster-image">Poster Image *</label>
                <input
                  id="poster-image"
                  type="file"
                  accept="image/*"
                  onChange={handlePosterImageChange}
                  disabled={isLoading}
                  className="file-input"
                />
                {posterImagePreview && (
                  <div className="image-preview-small">
                    <img src={posterImagePreview} alt="Poster preview" />
                  </div>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                disabled={isLoading || !posterFormData.title || !posterFormData.poster_image_url}
                className="btn-save"
              >
                {isLoading ? "Saving..." : editingPosterId ? "Update" : "Add"}
              </button>
              {editingPosterId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={isLoading}
                  className="btn-cancel"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="items-list">
            <h4>Event Posters</h4>
            {event.posters && event.posters.length > 0 ? (
              <div className="posters-grid">
                {event.posters.map((poster) => (
                  <div key={poster.id} className="poster-card">
                    <img
                      src={poster.poster_image_url}
                      alt={poster.title}
                      className="poster-image"
                    />
                    <div className="poster-info">
                      <h5>{poster.title}</h5>
                      <div className="poster-actions">
                        <button
                          onClick={() => handleEditPoster(poster)}
                          className="btn-small btn-edit"
                          disabled={isLoading}
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => onDeletePoster(poster.id)}
                          className="btn-small btn-delete"
                          disabled={isLoading}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-state">No posters added yet</p>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .event-details-panel {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .details-header {
          border-bottom: 1px solid #e5e7eb;
          padding: 16px;
        }

        .details-header h3 {
          margin: 0 0 12px 0;
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
        }

        .tabs {
          display: flex;
          gap: 8px;
        }

        .tab-btn {
          padding: 8px 12px;
          background-color: #f3f4f6;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          color: #6b7280;
        }

        .tab-btn.active {
          background-color: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        .details-section {
          padding: 16px;
        }

        .detail-form {
          background: #f9fafb;
          padding: 12px;
          border-radius: 6px;
          margin-bottom: 20px;
          border: 1px solid #e5e7eb;
        }

        .detail-form h4 {
          margin: 0 0 12px 0;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }

        .form-row {
          display: flex;
          gap: 12px;
          margin-bottom: 12px;
        }

        .form-row .form-group {
          flex: 1;
          margin-bottom: 0;
        }

        .form-group {
          margin-bottom: 12px;
        }

        label {
          display: block;
          margin-bottom: 4px;
          font-size: 13px;
          font-weight: 500;
          color: #374151;
        }

        input[type="text"],
        input[type="file"],
        textarea {
          width: 100%;
          padding: 8px 10px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          font-size: 13px;
          font-family: inherit;
          transition: border-color 0.2s;
        }

        input[type="text"]:focus,
        textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
        }

        input[type="file"] {
          padding: 8px;
          cursor: pointer;
        }

        textarea {
          resize: vertical;
          min-height: 60px;
        }

        .image-preview-small {
          margin-top: 8px;
          max-width: 100px;
        }

        .image-preview-small img {
          max-width: 100%;
          height: auto;
          border-radius: 4px;
          object-fit: cover;
        }

        .form-actions {
          display: flex;
          gap: 8px;
          margin-top: 12px;
        }

        .btn-save,
        .btn-cancel {
          flex: 1;
          padding: 8px 12px;
          border: none;
          border-radius: 4px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-save {
          background-color: #10b981;
          color: white;
        }

        .btn-save:hover:not(:disabled) {
          background-color: #059669;
        }

        .btn-save:disabled {
          background-color: #9ca3af;
          cursor: not-allowed;
        }

        .btn-cancel {
          background-color: #e5e7eb;
          color: #374151;
        }

        .btn-cancel:hover:not(:disabled) {
          background-color: #d1d5db;
        }

        .items-list {
          margin-top: 20px;
        }

        .items-list h4 {
          margin: 0 0 12px 0;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }

        .empty-state {
          text-align: center;
          padding: 20px;
          color: #9ca3af;
          font-size: 13px;
          background: #f9fafb;
          border-radius: 6px;
        }

        .item-card {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          padding: 12px;
          margin-bottom: 8px;
        }

        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
        }

        .item-header h5 {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
        }

        .item-actions {
          display: flex;
          gap: 6px;
        }

        .btn-small {
          padding: 4px 8px;
          border: none;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-edit {
          background-color: #dbeafe;
          color: #1e40af;
        }

        .btn-edit:hover:not(:disabled) {
          background-color: #bfdbfe;
        }

        .btn-delete {
          background-color: #fee2e2;
          color: #991b1b;
        }

        .btn-delete:hover:not(:disabled) {
          background-color: #fecaca;
        }

        .btn-small:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .item-desc {
          margin: 0 0 8px 0;
          font-size: 13px;
          color: #6b7280;
          white-space: pre-wrap;
          word-break: break-word;
        }

        .item-image {
          max-width: 100%;
          max-height: 150px;
          border-radius: 4px;
          object-fit: cover;
        }

        .posters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 12px;
        }

        .poster-card {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          overflow: hidden;
        }

        .poster-image {
          width: 100%;
          height: 150px;
          object-fit: cover;
        }

        .poster-info {
          padding: 8px;
        }

        .poster-info h5 {
          margin: 0 0 6px 0;
          font-size: 12px;
          font-weight: 600;
          color: #1f2937;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .poster-actions {
          display: flex;
          gap: 4px;
        }

        @media (max-width: 768px) {
          .posters-grid {
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          }

          .form-row {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
