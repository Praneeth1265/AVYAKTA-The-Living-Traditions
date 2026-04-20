"use client";

interface Member {
  id: string;
  name: string;
  domain: string;
  role: string;
  photo_url?: string;
}

interface MembersTableProps {
  members: Member[];
  onEdit: (member: Member) => void;
  onDelete: (id: string) => Promise<void>;
  isDeleting?: string | null;
}

export default function MembersTable({
  members,
  onEdit,
  onDelete,
  isDeleting = null,
}: MembersTableProps) {
  return (
    <div className="members-table-container">
      {members.length === 0 ? (
        <div className="empty-state">
          <p>No members in this domain yet.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="members-table">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id}>
                  <td className="photo-cell">
                    {member.photo_url ? (
                      <img
                        src={member.photo_url}
                        alt={member.name}
                        className="member-photo"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="photo-placeholder">📷</div>
                    )}
                  </td>
                  <td className="name-cell">{member.name}</td>
                  <td className="role-cell">
                    <span className="role-badge">{member.role}</span>
                  </td>
                  <td className="actions-cell">
                    <div className="actions">
                      <button
                        onClick={() => onEdit(member)}
                        className="btn-edit"
                        disabled={isDeleting === member.id}
                        title="Edit member"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => onDelete(member.id)}
                        disabled={isDeleting === member.id}
                        className="btn-delete"
                        title="Delete member"
                      >
                        {isDeleting === member.id
                          ? "🗑️ Deleting..."
                          : "🗑️ Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style jsx>{`
        .members-table-container {
          width: 100%;
        }

        .empty-state {
          text-align: center;
          padding: 30px 20px;
          color: #9ca3af;
          font-size: 14px;
        }

        .table-wrapper {
          overflow-x: auto;
        }

        .members-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }

        .members-table thead {
          background-color: #f3f4f6;
          border-bottom: 2px solid #e5e7eb;
        }

        .members-table th {
          padding: 12px;
          text-align: left;
          font-weight: 600;
          color: #374151;
        }

        .members-table td {
          padding: 12px;
          border-bottom: 1px solid #e5e7eb;
          color: #1f2937;
        }

        .members-table tbody tr:hover {
          background-color: #f9fafb;
        }

        .name-cell {
          font-weight: 500;
        }

        .photo-cell {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px 12px;
        }

        .member-photo {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #dbeafe;
        }

        .photo-placeholder {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f3f4f6;
          border-radius: 50%;
          font-size: 20px;
          border: 2px solid #e5e7eb;
        }

        .role-cell {
          display: flex;
          align-items: center;
        }

        .role-badge {
          display: inline-block;
          padding: 4px 12px;
          background-color: #dbeafe;
          color: #1e40af;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }

        .actions-cell {
          display: flex;
          justify-content: flex-end;
        }

        .actions {
          display: flex;
          gap: 8px;
        }

        .btn-edit,
        .btn-delete {
          padding: 8px 12px;
          border: none;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .btn-edit {
          background-color: #3b82f6;
          color: white;
        }

        .btn-edit:hover:not(:disabled) {
          background-color: #2563eb;
          transform: translateY(-2px);
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
        }

        .btn-edit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-delete {
          background-color: #ef4444;
          color: white;
        }

        .btn-delete:hover:not(:disabled) {
          background-color: #dc2626;
          transform: translateY(-2px);
          box-shadow: 0 2px 8px rgba(220, 38, 38, 0.3);
        }

        .btn-delete:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .members-table th,
          .members-table td {
            padding: 10px 8px;
            font-size: 12px;
          }

          .btn-edit,
          .btn-delete {
            padding: 6px 10px;
            font-size: 11px;
          }

          .actions {
            flex-direction: column;
            gap: 6px;
          }
        }
      `}</style>
    </div>
  );
}
