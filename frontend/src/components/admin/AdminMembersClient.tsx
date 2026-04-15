"use client";

import { useEffect, useState } from "react";
import MemberForm from "./MemberForm";
import MembersTable from "./MembersTable";

interface Member {
  id: string;
  name: string;
  domain: string;
  role: string;
}

interface FormData {
  name: string;
  domain: string;
  role: string;
}

export default function AdminMembersClient() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"add" | "view">("view");
  const [sortBy, setSortBy] = useState<"domain" | "role">("domain");

  // Fetch all members
  const fetchMembers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/members", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch members");
      }

      setMembers(result.data || []);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch members");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission (add or update)
  const handleFormSubmit = async (formData: FormData) => {
    try {
      setIsSubmitting(true);
      setError("");

      if (editingMember) {
        // Update member
        const response = await fetch(`/api/members/${editingMember.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (!result.success) {
          throw new Error(result.error || "Failed to update member");
        }

        setMembers((prev) =>
          prev.map((m) => (m.id === editingMember.id ? result.data : m))
        );
        setSuccessMessage("Member updated successfully!");
        setEditingMember(null);
        setActiveTab("view");
      } else {
        // Create new member
        const response = await fetch("/api/members", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (!result.success) {
          throw new Error(result.error || "Failed to create member");
        }

        setMembers((prev) => [...prev, result.data]);
        setSuccessMessage("Member added successfully!");
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

  // Handle delete member
  const handleDeleteMember = async (id: string) => {
    if (!confirm("Are you sure you want to delete this member?")) {
      return;
    }

    try {
      setIsDeletingId(id);
      const response = await fetch(`/api/members/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || "Failed to delete member");
      }

      setMembers((prev) => prev.filter((m) => m.id !== id));
      setSuccessMessage("Member deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete member");
    } finally {
      setIsDeletingId(null);
    }
  };

  // Handle edit member
  const handleEditMember = (member: Member) => {
    setEditingMember(member);
    setActiveTab("add");
  };

  // Handle cancel edit
  const handleCancel = () => {
    setEditingMember(null);
    setError("");
  };

  // Group members by domain
  const membersByDomain = members.reduce((acc, member) => {
    if (!acc[member.domain]) {
      acc[member.domain] = [];
    }
    acc[member.domain].push(member);
    return acc;
  }, {} as Record<string, Member[]>);

  // Group members by role
  const membersByRole = members.reduce((acc, member) => {
    if (!acc[member.role]) {
      acc[member.role] = [];
    }
    acc[member.role].push(member);
    return acc;
  }, {} as Record<string, Member[]>);

  // Get sorted keys
  const sortedDomains = Object.keys(membersByDomain).sort();
  const sortedRoles = Object.keys(membersByRole).sort();

  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <main className="members-container">
      <div className="members-wrapper">
        <div className="members-header">
          <div className="members-title-section">
            <p className="members-label">Avyakta Admin</p>
            <h1>Members Management</h1>
            <p>Add, view, update, and delete club members and their roles.</p>
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
            {editingMember ? "✏️ Edit Member" : "➕ Add Member"}
          </button>
          <button
            className={`tab-button ${activeTab === "view" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("view");
              setEditingMember(null);
            }}
          >
            👥 View Members ({members.length})
          </button>
        </div>

        <div className="members-content">
          {/* Add/Edit Section */}
          {activeTab === "add" && (
            <div className="section add-section">
              <MemberForm
                member={editingMember || undefined}
                onSubmit={handleFormSubmit}
                onCancel={handleCancel}
                isLoading={isSubmitting}
              />
            </div>
          )}

          {/* View Section */}
          {activeTab === "view" && (
            <div className="section view-section">
              {/* Sorting Options */}
              <div className="sort-controls">
                <label htmlFor="sort-select">Sort by:</label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "domain" | "role")}
                  className="sort-select"
                >
                  <option value="domain">Domain</option>
                  <option value="role">Role</option>
                </select>
              </div>

              {/* Members Display */}
              <div className="members-by-category">
                {sortBy === "domain" ? (
                  // Sort by Domain
                  sortedDomains.map((domain) => (
                    <div key={domain} className="category-section">
                      <h3 className="category-title">
                        🏢 {domain} ({membersByDomain[domain].length})
                      </h3>
                      <MembersTable
                        members={membersByDomain[domain]}
                        onEdit={handleEditMember}
                        onDelete={handleDeleteMember}
                        isDeleting={isDeletingId}
                      />
                    </div>
                  ))
                ) : (
                  // Sort by Role
                  sortedRoles.map((role) => (
                    <div key={role} className="category-section">
                      <h3 className="category-title">
                        👤 {role} ({membersByRole[role].length})
                      </h3>
                      <MembersTable
                        members={membersByRole[role]}
                        onEdit={handleEditMember}
                        onDelete={handleDeleteMember}
                        isDeleting={isDeletingId}
                      />
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .members-container {
          min-height: 100vh;
          padding: 20px;
          background: linear-gradient(135deg, #f0f4f8 0%, #f5f0e8 50%, #f0f4f8 100%);
        }

        .members-wrapper {
          max-width: 1200px;
          margin: 0 auto;
        }

        .members-header {
          background: white;
          border-radius: 8px;
          padding: 30px;
          margin-bottom: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .members-title-section {
          margin: 0;
        }

        .members-label {
          margin: 0;
          font-size: 12px;
          font-weight: 600;
          color: #6b7280;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .members-header h1 {
          margin: 8px 0 12px 0;
          font-size: 32px;
          font-weight: 700;
          color: #1f2937;
        }

        .members-header p {
          margin: 0;
          font-size: 16px;
          color: #6b7280;
        }

        .tabs-container {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
          background: white;
          padding: 16px;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .tab-button {
          padding: 12px 20px;
          border: 2px solid #e5e7eb;
          background: white;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tab-button:hover {
          border-color: #3b82f6;
          color: #3b82f6;
        }

        .tab-button.active {
          background: #3b82f6;
          border-color: #3b82f6;
          color: white;
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

        .members-content {
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

        .section {
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

        .add-section {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .view-section {
          animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .loading-state,
        .empty-state {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 60px 20px;
          text-align: center;
          color: #6b7280;
        }

        .sort-controls {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          background: white;
          padding: 16px;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .sort-controls label {
          font-weight: 600;
          color: #1f2937;
          font-size: 14px;
        }

        .sort-select {
          padding: 8px 12px;
          border: 2px solid #e5e7eb;
          border-radius: 6px;
          background: white;
          font-size: 14px;
          font-weight: 500;
          color: #1f2937;
          cursor: pointer;
          transition: border-color 0.2s;
        }

        .sort-select:hover {
          border-color: #3b82f6;
        }

        .sort-select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .members-by-category {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .category-section {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .category-title {
          margin: 0 0 16px 0;
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          padding-bottom: 12px;
          border-bottom: 2px solid #e5e7eb;
        }

        @media (max-width: 768px) {
          .members-container {
            padding: 12px;
          }

          .members-header {
            padding: 20px;
            margin-bottom: 16px;
          }

          .members-header h1 {
            font-size: 24px;
          }

          .members-header p {
            font-size: 14px;
          }

          .tabs-container {
            flex-direction: column;
          }

          .tab-button {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}
