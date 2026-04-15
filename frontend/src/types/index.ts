export interface Member {
  id: string;
  name: string;
  designation: string;
  section: "founders" | "faculty" | "previous_heads" | "previous_members" | "current_core";
  quote?: string;
  image_url?: string;
  year?: string;
  domain?: string;
}

export interface HistoryMilestone {
  id: string;
  year: string;
  title: string;
  description: string;
  is_ira_milestone?: boolean;
}

export interface RegistrationFormData {
  name: string;
  srn: string;
  semester: string;
  branch: string;
  section: string;
  links: string;
  availability: string;
  experience: string;
  why_you: string;
  why_us: string;
}
