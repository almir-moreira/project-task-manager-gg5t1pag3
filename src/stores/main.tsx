import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Task, TaskStatus, User, AuditLog } from '@/lib/types'
import { mockTasks, mockUsers } from '@/lib/mock-data'

interface AppContextType {
  tasks: Task[]
  users: User[]
  currentUser: User
  updateTaskStatus: (taskId: string, newStatus: TaskStatus) => void
  addTaskHistory: (taskId: string, action: string) => void
}

const AppContext = createContext<AppContextType | null>(null)

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [users] = useState<User[]>(mockUsers)

  // Mock current logged-in user
  const currentUser = users[0]

  const updateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId && task.status !== newStatus) {
          addTaskHistory(taskId, `Status changed to ${newStatus}`)
          return { ...task, status: newStatus }
        }
        return task
      }),
    )
  }

  const addTaskHistory = (taskId: string, action: string) => {
    const log: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: currentUser.id,
      action,
    }
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, history: [log, ...task.history] } : task,
      ),
    )
  }

  return (
    <AppContext.Provider value={{ tasks, users, currentUser, updateTaskStatus, addTaskHistory }}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) throw new Error('useAppContext must be used within AppProvider')
  return context
}
