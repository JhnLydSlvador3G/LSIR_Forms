import { z } from 'zod'

//Note: These are lookup const (constants) They're the actual list of valid/allowed values. 
//The as const makes TypeScript treat them as fixed/readonly so their values can be used as types.
//For Validation and UI Rendering
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

//Note: Single schema validating all fields at once blocks navigation between steps.
/* STRICT SCHEMA — used only on final Submit
export const ProgInfoSchema = z.object({
  programType: z.enum(['extension', 'branch']),
  permitNumber: z.string().min(1, 'Permit number is required'),
  startMonth: z.enum(MONTHS, { error: 'Required' }),
  endMonth: z.enum(MONTHS, { error: 'Required' }),
  curricularSchedule: z.enum(CURRICULAR_SCHEDULES, { error: 'Required' }),
  programDuration: z.enum(['online', 'hybrid']),
})
*/

//Note: Solution — Two schemas:
//STRICT SCHEMA — used only on final Submit
export const ProgInfoSchema = z.object({
  programType: z.enum(['extension', 'branch']),
  permitNumber: z.string().min(1, 'Permit number is required'),
  startMonth: z.enum(MONTHS, { error: 'Required' }),
  endMonth: z.enum(MONTHS, { error: 'Required' }),
  curricularSchedule: z.enum(CURRICULAR_SCHEDULES, { error: 'Required' }),
  programDuration: z.enum(['online', 'hybrid']),
})

//LENIENT SCHEMA — used on onChange so nothing blocks mid-form
export const ProgInfoDraftSchema = ProgInfoSchema.partial()

//Note: These are configuration constants specific to the wizard. Plain data arrays that drive the wizard logic (which fields to validate per step, what title to show).
// Fields belonging to each step — used for per-step validation on Next
export const STEP_FIELDS = [
  ['programType', 'permitNumber'],           // Step 0 — Program Offered
  ['startMonth', 'endMonth'],                // Step 1 — Academic Calendar
  ['curricularSchedule'],                    // Step 2 — Curricular Schedule
  ['programDuration'],                       // Step 3 — Program Duration
] as const

export const STEP_TITLES = [
  'Program Offered',
  'Academic Calendar',
  'Curricular Schedule',
  'Program Duration',
] as const

//Note: This is the actual TypeScript type representing the form data structure. 
//It describes the shape of the form's data in memory — what fields exist and what types they can hold. 
export type ProgInfoFormData = {
  programType: 'extension' | 'branch' | ''
  permitNumber: string
  startMonth: Month | ''
  endMonth: Month | ''
  curricularSchedule: CurricularSchedule | ''
  programDuration: 'online' | 'hybrid' | ''
}

//This is an initial state constant that matches the ProgInfoFormData type, used to initialize the form with default values.
//It defines what the form looks like when it first loads or gets reset. 
//it's for initialization and reset:
export const progInfoDefaultValues: ProgInfoFormData = {
  programType: '',
  permitNumber: '',
  startMonth: '',
  endMonth: '',
  curricularSchedule: '',
  programDuration: '',
}
