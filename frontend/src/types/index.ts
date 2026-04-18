export interface Member {
  id: string;
  name: string;
  domain: string;
  role: string;
}

export interface HistoryMilestone {
  id: string;
  year: string;
  title: string;
  description: string;
  is_ira_milestone?: boolean;
}
