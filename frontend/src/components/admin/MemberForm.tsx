"use client";

import { useState } from "react";
import { RECRUITMENT_DOMAINS } from "../../lib/validators/recruitment";

interface FormData {
  name: string;
  domain: string;
  role: string;
  photo_url?: string;
}

interface MemberFormProps {
  member?: FormData & { id: string };
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function MemberForm({
  member,
  onSubmit,
  onCancel,
  isLoading = false,
}: MemberFormProps) {
  const [formData, setFormData] = useState<FormData>(
    member
      ? { name: member.name, domain: member.domain, role: member.role, photo_url: member.photo_url }
      : { name: "", domain: "", role: "", photo_url: "" }
  );
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(member?.photo_url || null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    try {
      setIsUploading(true);
      setError("");

      // Show preview while uploading
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to server
      const formDataToSend = new FormData();
      formDataToSend.append("file", file);
      formDataToSend.append("memberId", member?.id || "new");

      const response = await fetch("/api/members/upload", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload image");
      }

      const result = await response.json();
      setFormData((prev) => ({ ...prev, photo_url: result.photo_url }));
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image");
      setPhotoPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim() || !formData.domain.trim() || !formData.role.trim()) {
      setError("All fields are required");
      return;
    }

    try {
      await onSubmit(formData);
      if (!member) {
        setFormData({ name: "", domain: "", role: "", photo_url: "" });
        setPhotoPreview(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return (
    <div className="member-form">
      <h3>{member ? "Edit Member" : "Add New Member"}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter member name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="domain">Domain *</label>
          <select
            id="domain"
            name="domain"
            value={formData.domain}
            onChange={handleSelectChange}
            required
          >
            <option value="">Select a domain</option>
            {RECRUITMENT_DOMAINS.map((domain) => (
              <option key={domain} value={domain}>
                {domain}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="role">Role *</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleSelectChange}
            required
          >
            <option value="">Select a role</option>
            <option value="domain_head">Domain Head</option>
            <option value="members">Members</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="photo">Photo (Optional)</label>
          <input
            type="file"
            id="photo"
            accept="image/*"
            onChange={handlePhotoUpload}
            disabled={isUploading}
            className="file-input"
          />
          <small className="file-hint">Accepted: JPG, PNG, GIF, WebP (Max 5MB)</small>
          {photoPreview && (
            <div className="photo-preview">
              <small>Preview:</small>
              <img src={photoPreview} alt="Member preview" />
            </div>
          )}
          {isUploading && <div className="uploading">⏳ Uploading image...</div>}
        </div>

        {error && <div className="form-error">{error}</div>}

        <div className="form-actions">
          <button type="submit" disabled={isLoading || isUploading} className="btn-primary">
            {isLoading ? "Saving..." : member ? "Update Member" : "Add Member"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading || isUploading}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>

      <style jsx>{`
        .member-form {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .member-form h3 {
          margin: 0 0 16px 0;
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          margin-bottom: 6px;
          font-weight: 500;
          color: #374151;
          font-size: 14px;
        }

        .form-group input {
          width: 100%;
          padding: 10px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          font-family: inherit;
          transition: border-color 0.2s;
        }

        .form-group input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-group select {
          width: 100%;
          padding: 10px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          font-family: inherit;
          transition: border-color 0.2s;
          background-color: white;
          cursor: pointer;
        }

        .form-group select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-error {
          color: #dc2626;
          font-size: 13px;
          margin-bottom: 12px;
          padding: 8px 12px;
          background-color: #fee2e2;
          border-radius: 4px;
          border-left: 3px solid #dc2626;
        }

        .photo-preview {
          margin-top: 12px;
          padding: 12px;
          background-color: #f9fafb;
          border-radius: 6px;
          border: 1px dashed #d1d5db;
        }

        .photo-preview small {
          display: block;
          margin-bottom: 8px;
          color: #6b7280;
          font-size: 12px;
          font-weight: 500;
        }

        .photo-preview img {
          max-width: 100%;
          max-height: 150px;
          border-radius: 4px;
          object-fit: cover;
        }

        .file-input {
          width: 100%;
          padding: 10px;
          border: 2px dashed #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          background-color: #fafafa;
        }

        .file-input:hover:not(:disabled) {
          border-color: #3b82f6;
          background-color: #eff6ff;
        }

        .file-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background-color: #f3f4f6;
        }

        .file-hint {
          display: block;
          margin-top: 6px;
          color: #6b7280;
          font-size: 12px;
        }

        .uploading {
          margin-top: 12px;
          padding: 10px 12px;
          background-color: #fef3c7;
          border-radius: 6px;
          color: #92400e;
          font-size: 13px;
          border-left: 3px solid #f59e0b;
          font-weight: 500;
        }

        .form-actions {
          display: flex;
          gap: 10px;
          margin-top: 16px;
        }

        .btn-primary,
        .btn-secondary {
          padding: 10px 16px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          flex: 1;
        }

        .btn-primary {
          background-color: #3b82f6;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background-color: #2563eb;
        }

        .btn-primary:disabled {
          background-color: #9ca3af;
          cursor: not-allowed;
        }

        .btn-secondary {
          background-color: #e5e7eb;
          color: #374151;
        }

        .btn-secondary:hover:not(:disabled) {
          background-color: #d1d5db;
        }

        .btn-secondary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
