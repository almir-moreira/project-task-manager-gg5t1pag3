export const getStatusColor = (status: string | null): string => {
  if (!status) return 'bg-slate-200 text-slate-800 border-slate-300'
  switch (status) {
    case 'Past Due':
    case 'Rejected':
      return 'bg-red-600 text-white border-transparent'
    case 'Done':
      return 'bg-emerald-500 text-white border-transparent'
    case 'In Progress':
      return 'bg-blue-600 text-white border-transparent'
    case 'On Hold':
      return 'bg-amber-500 text-white border-transparent'
    case 'SPM Clearance':
    case 'Head Clearance':
    case 'Head Approval':
    case 'CPO Approval':
    case 'SG Approval':
      return 'bg-purple-600 text-white border-transparent'
    case 'To Do':
      return 'bg-slate-200 text-slate-800 border-slate-300'
    default:
      return 'bg-slate-100 text-slate-800 border-slate-200'
  }
}

export const getStageStatusColor = (displayStatus: string): string => {
  const lower = displayStatus.toLowerCase()
  if (lower === 'done' || lower === 'completed')
    return 'bg-emerald-500 text-white border-transparent'
  if (lower === 'preparation' || lower === 'planning')
    return 'bg-slate-200 text-slate-800 border-slate-300'
  if (lower.includes('feedback')) return 'bg-blue-600 text-white border-transparent'
  if (lower === 'review') return 'bg-purple-600 text-white border-transparent'
  if (lower.includes('approval')) return 'bg-indigo-600 text-white border-transparent'
  return 'bg-slate-100 text-slate-800 border-slate-200'
}
