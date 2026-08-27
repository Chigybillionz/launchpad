export interface ReadinessTask {
  id: string;
  title: string;
  description: string;
  estimatedEffort: string;
  completed: boolean;
}

export interface ReadinessDay {
  dayNumber: number;
  tasks: ReadinessTask[];
}

export interface ReadinessPlan {
  opportunityId: string;
  days: ReadinessDay[];
  generatedAt: string;
}
