import { TaskStatus } from './types'

export const getStatusColor = (status: TaskStatus | string): string => {
  switch (status) {
    case 'Past Due':
      return 'bg-red-600 text-white border-transparent hover:bg-red-700'
    case 'Rejected':
      return 'bg-orange-600 text-white border-transparent hover:bg-orange-700'
    case 'Done':
      return 'bg-emerald-500 text-white border-transparent hover:bg-emerald-600'
    case 'In Progress':
      return 'bg-blue-600 text-white border-transparent hover:bg-blue-700'
    case 'On Hold':
      return 'bg-amber-500 text-white border-transparent hover:bg-amber-600'
    case 'To Do':
      return 'bg-slate-200 text-slate-800 border-slate-300 hover:bg-slate-300'
    default:
      return 'bg-blue-100 text-blue-800 border-transparent hover:bg-blue-200'
  }
}
