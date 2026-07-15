export type { TravelAuthorization } from './travel-authorizations'

export {
  getTravelAuthorizations,
  getTravelAuthorization,
  createTravelAuthorization,
  updateTravelAuthorization,
} from './travel-authorizations'

export function toDateInput(value: string | null): string {
  if (!value) return ''
  const d = new Date(value)
  if (isNaN(d.getTime())) return ''
  return d.toISOString().slice(0, 10)
}

export function fromDateInput(value: string): string | null {
  if (!value) return null
  return new Date(value).toISOString()
}
