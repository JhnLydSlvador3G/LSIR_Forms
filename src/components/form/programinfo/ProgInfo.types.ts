import { z } from 'zod'

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const

export type Month = typeof MONTHS[number]

export const CURRICULAR_SCHEDULES = [
  'Semestral',
  'Trimestral with Compulsory Summer Term',
  'Summer',
] as const

export type CurricularSchedule = typeof CURRICULAR_SCHEDULES[number]

export const ProgInfoSchema = z.object({
  programType: z.enum(['extension', 'branch']),
  permitNumber: z.string().min(1, 'Permit number is required'),
  startMonth: z.enum(MONTHS, { error: 'Required' }),
  endMonth: z.enum(MONTHS, { error: 'Required' }),
  curricularSchedule: z.enum(CURRICULAR_SCHEDULES, { error: 'Required' }),
})

export const ProgInfoDraftSchema = z.object({
  programType: z.enum(['extension', 'branch']).optional(),
  permitNumber: z.string().optional(),
  startMonth: z.enum(MONTHS).optional(),
  endMonth: z.enum(MONTHS).optional(),
  curricularSchedule: z.enum(CURRICULAR_SCHEDULES).optional(),
})

export type ProgInfoFormData = {
  programType: 'extension' | 'branch' | undefined
  permitNumber: string
  startMonth: Month | ''
  endMonth: Month | ''
  curricularSchedule: CurricularSchedule | ''
}

export const progInfoDefaultValues: ProgInfoFormData = {
  programType: undefined,
  permitNumber: '',
  startMonth: '',
  endMonth: '',
  curricularSchedule: '',
}
