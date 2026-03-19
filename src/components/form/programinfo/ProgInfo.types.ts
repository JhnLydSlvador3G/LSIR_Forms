import { z } from 'zod'

// Note: These are lookup constants. They define the valid/allowed values used by
// both the UI and the schemas.
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

export const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const

export type Day = typeof DAYS[number]

export const RECOGNITION_STATUSES = [
  'GP I',
  'GP II',
  'GP III',
  'GR',
] as const

export type RecognitionStatus = typeof RECOGNITION_STATUSES[number]

//Note: Base schema for each curriculum entry
const CurriculumEntryBaseSchema = z.object({
  lebApprovalDate: z.string(),
  firstYearFirstSem: z.string(),
  firstYearSecondSem: z.string(),
  secondYearFirstSem: z.string(),
  secondYearSecondSem: z.string(),
  thirdYearFirstSem: z.string(),
  thirdYearSecondSem: z.string(),
  fourthYearFirstSem: z.string(),
  fourthYearSecondSem: z.string(),
  fifthYearFirstSem: z.string(),
  fifthYearSecondSem: z.string(),
  totalAcademicLoadFirstSem: z.string(),
  totalAcademicLoadSecondSem: z.string(),
})

export type CurriculumEntry = z.infer<typeof CurriculumEntryBaseSchema>

// Note: A single strict schema by itself would validate the entire form at once,
// which is not ideal for a wizard flow because it can block navigation too early.
//
// Validation is therefore split into two layers:
// 1) ProgInfoDraftSchema supports lenient in-progress editing so users are not
//    blocked while filling out later steps.
// 2) ProgInfoSchema is the strict final validation gate used on submit for the
//    complete payload.
//
// STEP_FIELDS complements both schemas by defining which fields belong to each
// wizard step, so light step validation can check only the current section
// instead of the whole form at once.
const ProgInfoBaseSchema = z.object({
  programType: z.enum(['extension', 'branch']),
  permitNumber: z.string().min(1, 'Permit number is required'),
  governmentAuthority: z.string(),
  validity: z.string(),
  locationSite: z.string(),
  recognitionStatus: z.enum(RECOGNITION_STATUSES).or(z.literal('')),
  recognitionNumber: z.string(),
  startMonth: z.enum(MONTHS, { error: 'Required' }),
  endMonth: z.enum(MONTHS, { error: 'Required' }),
  classOperatingFrom: z.enum(DAYS, { error: 'Required' }),
  classOperatingTo: z.enum(DAYS, { error: 'Required' }),
  curricularSchedule: z.enum(CURRICULAR_SCHEDULES, { error: 'Required' }),
  programDuration: z.enum(['online', 'hybrid']),
  curricula: z.array(CurriculumEntryBaseSchema),
})

export const ProgInfoSchema = ProgInfoBaseSchema.superRefine((values, ctx) => {
  const requireCurriculumValue = (
    value: string,
    curriculumIndex: number,
    field: keyof CurriculumEntry,
    label: string,
  ) => {
    if (value.trim().length > 0) return
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['curricula', curriculumIndex, field],
      message: `${label} is required`,
    })
  }

  if (values.locationSite.trim().length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['locationSite'],
      message: 'Location/Site is required',
    })
  }

  if (values.programType === 'extension') {
    if (values.governmentAuthority.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['governmentAuthority'],
        message: 'Government Authority is required',
      })
    }

    if (values.validity.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['validity'],
        message: 'Validity is required',
      })
    }
  }

  if (values.programType === 'branch') {
    if (!values.recognitionStatus) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['recognitionStatus'],
        message: 'Recognition Status is required',
      })
    }

    if (values.recognitionNumber.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['recognitionNumber'],
        message: 'Recognition Number is required',
      })
    }
  }

  if (values.curricula.length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['curricula'],
      message: 'At least one curriculum entry is required',
    })
  }

  values.curricula.forEach((curriculum, index) => {
    requireCurriculumValue(
      curriculum.lebApprovalDate,
      index,
      'lebApprovalDate',
      'LEB Approval Date',
    )
    requireCurriculumValue(
      curriculum.firstYearFirstSem,
      index,
      'firstYearFirstSem',
      'First Year Level - 1st Sem',
    )
    requireCurriculumValue(
      curriculum.firstYearSecondSem,
      index,
      'firstYearSecondSem',
      'First Year Level - 2nd Sem',
    )
    requireCurriculumValue(
      curriculum.secondYearFirstSem,
      index,
      'secondYearFirstSem',
      'Second Year Level - 1st Sem',
    )
    requireCurriculumValue(
      curriculum.secondYearSecondSem,
      index,
      'secondYearSecondSem',
      'Second Year Level - 2nd Sem',
    )
    requireCurriculumValue(
      curriculum.thirdYearFirstSem,
      index,
      'thirdYearFirstSem',
      'Third Year Level - 1st Sem',
    )
    requireCurriculumValue(
      curriculum.thirdYearSecondSem,
      index,
      'thirdYearSecondSem',
      'Third Year Level - 2nd Sem',
    )
    requireCurriculumValue(
      curriculum.fourthYearFirstSem,
      index,
      'fourthYearFirstSem',
      'Fourth Year Level - 1st Sem',
    )
    requireCurriculumValue(
      curriculum.fourthYearSecondSem,
      index,
      'fourthYearSecondSem',
      'Fourth Year Level - 2nd Sem',
    )
    requireCurriculumValue(
      curriculum.fifthYearFirstSem,
      index,
      'fifthYearFirstSem',
      'Fifth Year Level - 1st Sem',
    )
    requireCurriculumValue(
      curriculum.fifthYearSecondSem,
      index,
      'fifthYearSecondSem',
      'Fifth Year Level - 2nd Sem',
    )
    requireCurriculumValue(
      curriculum.totalAcademicLoadFirstSem,
      index,
      'totalAcademicLoadFirstSem',
      'Total academic load - 1st Sem',
    )
    requireCurriculumValue(
      curriculum.totalAcademicLoadSecondSem,
      index,
      'totalAcademicLoadSecondSem',
      'Total academic load - 2nd Sem',
    )
  })
})

// LENIENT SCHEMA: used during editing so incomplete later-step fields do not
// block progress while the form is still being filled out.
// performs light validation on the current step only, allowing other fields to be empty.
export const ProgInfoDraftSchema = ProgInfoBaseSchema.partial()

// Note: These arrays drive the wizard logic by defining which fields belong to
// each step and which title should be shown for that step.
// Fields belonging to each step: used to scope light step validation on Next.
export const STEP_FIELDS = [
  ['programType', 'governmentAuthority', 'validity', 'locationSite', 'recognitionStatus', 'recognitionNumber', 'permitNumber'], // Step 0 - Program Offered
  ['startMonth', 'endMonth'],                // Step 1 - Academic Calendar
  ['curricularSchedule'],                    // Step 2 - Curricular Schedule
  ['programDuration'],                       // Step 3 - Program Duration
  ['classOperatingFrom', 'classOperatingTo'], // Step 4 - Class Operating Schedule
  ['curricula'],                             // Step 5 - Curriculum
] as const

export const STEP_TITLES = [
  'Program Offered',
  'Academic Calendar',
  'Curricular Schedule',
  'Program Duration',
  'Class Operating Schedule',
  'Curriculum',
] as const

// Note: This is the in-memory TypeScript shape of the form data.
export type ProgInfoFormData = {
  programType: 'extension' | 'branch' | ''
  permitNumber: string
  governmentAuthority: string
  validity: string
  locationSite: string
  recognitionStatus: RecognitionStatus | ''
  recognitionNumber: string
  startMonth: Month | ''
  endMonth: Month | ''
  classOperatingFrom: Day | ''
  classOperatingTo: Day | ''
  curricularSchedule: CurricularSchedule | ''
  programDuration: 'online' | 'hybrid' | ''
  curricula: CurriculumEntry[]
}

// Note: Default values used when the form is first initialized or reset.
export const progInfoDefaultValues: ProgInfoFormData = {
  programType: '',
  permitNumber: '',
  governmentAuthority: '',
  validity: '',
  locationSite: '',
  recognitionStatus: '',
  recognitionNumber: '',
  startMonth: '',
  endMonth: '',
  classOperatingFrom: '',
  classOperatingTo: '',
  curricularSchedule: '',
  programDuration: '',
  curricula: [
    {
      lebApprovalDate: '',
      firstYearFirstSem: '',
      firstYearSecondSem: '',
      secondYearFirstSem: '',
      secondYearSecondSem: '',
      thirdYearFirstSem: '',
      thirdYearSecondSem: '',
      fourthYearFirstSem: '',
      fourthYearSecondSem: '',
      fifthYearFirstSem: '',
      fifthYearSecondSem: '',
      totalAcademicLoadFirstSem: '',
      totalAcademicLoadSecondSem: '',
    },
  ],
}
