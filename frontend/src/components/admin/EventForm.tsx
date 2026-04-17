"use client";

import React, { useState, useEffect } from "react";
import { compressImage, validateImage } from "../../lib/utils/imageOptimizer";

interface Event {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  date: string | null;
  registration_enabled?: boolean;
  payment_image_required?: boolean;
}

interface EventFormProps {
  event?: Event;
  onSubmit: (formData: EventFormData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export interface EventFormData {
  title: string;
  description: string;
  image_url: string;
  date: string;
  registration_enabled?: boolean;
  payment_image_required?: boolean;
}

export default function EventForm({
  event,
  onSubmit,
  onCancel,
  isLoading,
}: EventFormProps) {
  const [formData, setFormData] = useState<EventFormData>({
    title: event?.title || "",
    description: event?.description || "",
    image_url: event?.image_url || "",
    date: event?.date || "",
    registration_enabled: event?.registration_enabled ?? true,
    payment_image_required: event?.payment_image_required ?? false,
  });
  const [imagePreview, setImagePreview] = useState<string>(
    event?.image_url || ""
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string>("");
  const [isCompressing, setIsCompressing] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      registration_enabled: e.target.checked,
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageError("");
      setIsCompressing(true);

      try {
        // Validate image
        const validation = validateImage(file, 10);
        if (!validation.valid) {
          setImageError(validation.error || "Invalid image");
          setIsCompressing(false);
          return;
        }

        // Compress image
        const compressed = await compressImage(file, {
          maxWidth: 1920,
          maxHeight: 1920,
          quality: 0.7,
          maxSizeKB: 300,
        });

        setImageFile(file);
        setImagePreview(compressed);
        setFormData((prev) => ({
          ...prev,
          image_url: compressed,
        }));
      } catch (error) {
        setImageError(
          error instanceof Error ? error.message : "Failed to process image"
        );
      } finally {
        setIsCompressing(false);
      }
    }
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    if (!event) {
      setFormData({
        title: "",
        description: "",
        image_url: "",
        date: "",
        registration_enabled: true,
        payment_image_required: false,
      });
      setImagePreview("");
      setImageFile(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="event-form">
      <h2>{event ? "Edit Event" : "Create New Event"}</h2>

      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          id="title"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Event title"
          required
          disabled={isLoading}
          maxLength={256}
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Event description"
          rows={4}
          disabled={isLoading}
          maxLength={2048}
        />
      </div>

      <div className="form-group">
        <label htmlFor="date">Date</label>
        <input
          id="date"
          type="date"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
          disabled={isLoading}
        />
      </div>

      <div className="form-group checkbox-group">
        <label htmlFor="registration_enabled">
          <input
            id="registration_enabled"
            type="checkbox"
            checked={formData.registration_enabled ?? true}
            onChange={handleToggleChange}
            disabled={isLoading}
            className="checkbox-input"
          />
          <span>Enable Registration for this Event</span>
        </label>
      </div>

      <div className="form-group checkbox-group">
        <label htmlFor="payment_image_required">
          <input
            id="payment_image_required"
            type="checkbox"
            checked={formData.payment_image_required ?? false}
            onChange={(e) => setFormData((prev) => ({ ...prev, payment_image_required: e.target.checked }))}
            disabled={isLoading || !formData.registration_enabled}
            className="checkbox-input"
          />
          <span>Require Payment Proof for Registration</span>
        </label>
      </div>

      <div className="form-group">
        <label htmlFor="image">Event Cover Image</label>
        <div className="image-upload-group">
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={isLoading || isCompressing}
            className="file-input"
          />
          {imageError && (
            <p className="help-text" style={{ color: "#dc2626" }}>
              ⚠️ {imageError}
            </p>
          )}
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
              <button
                type="button"
                onClick={() => {
                  setImagePreview("");
                  setImageFile(null);
                  setImageError("");
                  setFormData((prev) => ({
                    ...prev,
                    image_url: "",
                  }));
                }}
                disabled={isLoading || isCompressing}
                className="btn-remove-image"
              >
                ✕ Remove Image
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="form-actions">
        <button
          type="submit"
          disabled={isLoading || isCompressing}
          className="btn-submit"
        >
          {isLoading ? "Saving..." : event ? "Update Event" : "Create Event"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading || isCompressing}
          className="btn-cancel"
        >
          Cancel
        </button>
      </div>

      <style jsx>{`
        .event-form {
          background: white;
          padding: 24px;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        h2 {
          margin: 0 0 20px 0;
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
        }

        h3 {
          margin: 16px 0 12px 0;
          font-size: 16px;
          font-weight: 600;
          color: #374151;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .checkbox-group {
          display: flex;
          align-items: center;
        }

        .checkbox-group label {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 0;
        }

        .checkbox-input {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        label {
          display: block;
          margin-bottom: 6px;
          font-weight: 500;
          color: #374151;
          font-size: 14px;
        }

        input[type="text"],
        input[type="date"],
        textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          font-family: inherit;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }

        input[type="text"]:focus,
        input[type="date"]:focus,
        textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        input:disabled,
        textarea:disabled {
          background-color: #f3f4f6;
          cursor: not-allowed;
        }

        .image-upload-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .file-input {
          padding: 0;
          border: 2px dashed #d1d5db;
          cursor: pointer;
          padding: 20px;
          text-align: center;
          background-color: #fafafa;
        }

        .file-input:hover:not(:disabled) {
          border-color: #3b82f6;
          background-color: #f0f9ff;
        }

        .image-preview {
          display: flex;
          flex-direction: column;
          gap: 12px;
          align-items: center;
        }

        .image-preview img {
          max-width: 200px;
          max-height: 200px;
          border-radius: 6px;
          object-fit: cover;
        }

        .btn-remove-image {
          padding: 8px 12px;
          background-color: #ef4444;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .btn-remove-image:hover:not(:disabled) {
          background-color: #dc2626;
        }

        .btn-remove-image:disabled {
          background-color: #9ca3af;
          cursor: not-allowed;
        }

        .help-text {
          margin-top: 6px;
          font-size: 12px;
          color: #6b7280;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }

        .btn-submit,
        .btn-cancel {
          flex: 1;
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-submit {
          background-color: #3b82f6;
          color: white;
        }

        .btn-submit:hover:not(:disabled) {
          background-color: #2563eb;
        }

        .btn-submit:disabled {
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

        .btn-cancel:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </form>
  );
}
