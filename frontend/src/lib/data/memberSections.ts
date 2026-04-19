export type MemberSectionKey =
  | "founders"
  | "faculty-advisors"
  | "previous-heads"
  | "previous-members"
  | "current-core-team";

export type MemberCard = {
  id: string;
  name: string;
  designation: string;
  section: MemberSectionKey;
  photoUrl: string;
  bio: string;
};

export const memberSectionOrder: Array<{
  key: MemberSectionKey;
  title: string;
}> = [
  { key: "founders", title: "Founders" },
  { key: "faculty-advisors", title: "Faculty Advisors" },
  { key: "previous-heads", title: "Previous Heads" },
  { key: "previous-members", title: "Previous Members" },
  { key: "current-core-team", title: "Current Core Team" },
];
