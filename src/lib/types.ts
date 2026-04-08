export type TaskStatus =
  | 'To Do'
  | 'In Progress'
  | 'On Hold'
  | 'SPM Clearance'
  | 'Head Clearance'
  | 'CPO Approval'
  | 'SG Approval'
  | 'Rejected'
  | 'Done'

export interface User {
  id: string
  name: string
  email: string
  role: string
  programme: string
  avatar?: string
}

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  category: string
  location: string
  projectOwnerId: string
  assigneeId: string
  startDate: string
  dueDate: string
  programme: string
  project: string
  type: string
  priority: string
  costEstimated: number
  inBudget: boolean
  history: AuditLog[]
}

export interface AuditLog {
  id: string
  timestamp: string
  userId: string
  action: string
}
