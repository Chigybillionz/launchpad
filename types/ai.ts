export interface ReadinessPlan {
  id: string;
  userId: string;
  opportunityId: string;
  summary: string;
  strengths: string[];
  missingSkills: string[];
  recommendations: string[];
  timeline: ReadinessStep[];
  createdAt: string;
}

export interface ReadinessStep {
  week: number;
  title: string;
  description: string;
  resources: string[];
}



export interface CareerAssistantMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}
