export enum TechCategory {
  Frontend = 'frontend',
  Backend = 'backend',
  Database = 'database',
  DevOps = 'devops',
  Other = 'other'
}

export enum TechDifficulty {
  Beginner = 'beginner',
  Intermediate = 'Intermediate',
  Advanced = 'advanced'
}

export enum Status {
  NotStarted = 'not-started',
  InProgress = 'in-progress',
  Completed = 'completed'
}

export interface Technology {
  id: number,
  title: string,
  status: Status,
  notes: string,
  description: string,
  category: TechCategory,
  difficulty: TechDifficulty,
  deadline?: Date,
  resources: string[]
}