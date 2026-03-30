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

export const LAW_PROGRAM_CLASSIFICATIONS = [
  'juris-doctor',
  'master-of-laws',
  'doctorate',
] as const

export type LawProgramClassification = typeof LAW_PROGRAM_CLASSIFICATIONS[number]

export const DOCTORATE_PROGRAM_OPTIONS = [
  'Doctor in Civil Law',
  'Doctor in Juridical Science',
  'Others',
] as const

export type DoctorateProgramOption = typeof DOCTORATE_PROGRAM_OPTIONS[number]

// Note: Helper scalar schema for number-only semestral load inputs.
const IntegerFieldSchema = z.preprocess(
  (value) => {
    if (value === '' || value === null || value === undefined) return undefined
    if (typeof value === 'string') return Number(value)
    return value
  },
  z.number({ error: 'Required' }).int('Must be a whole number')
)

// Note: Nested curriculum schemas. Read from smallest unit to larger unit.
const CurriculumLoadEntryBaseSchema = z.object({
  year: z.number().int().min(1).max(5),
  first_sem: IntegerFieldSchema,
  second_sem: IntegerFieldSchema,
})

const CurriculumEntryBaseSchema = z.object({
  loads: z.array(CurriculumLoadEntryBaseSchema).length(5),
})

// Note: Whole-form schemas. `ProgInfoBaseSchema` defines the full shape;
// `ProgInfoSchema` adds final custom validation rules.
// A single strict schema by itself would validate the entire form at once,
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
  lawProgramClassification: z.enum(LAW_PROGRAM_CLASSIFICATIONS),
  doctorateProgram: z.enum(DOCTORATE_PROGRAM_OPTIONS).or(z.literal('')),
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
  lebApprovalDate: z.string(),
  curricula: z.array(CurriculumEntryBaseSchema),
})


export const ProgInfoSchema = ProgInfoBaseSchema.superRefine((values, ctx) => {
  if (values.lawProgramClassification === 'doctorate' && !values.doctorateProgram) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['doctorateProgram'],
      message: 'Doctorate program is required',
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

  if (values.lebApprovalDate.trim().length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['lebApprovalDate'],
      message: 'LEB Approval Date is required',
    })
  }
})

// Note: Exported TypeScript types that mirror the form's in-memory shape.
export type CurriculumLoadEntry = {
  year: number
  first_sem: number | ''
  second_sem: number | ''
}

export type CurriculumEntry = {
  loads: CurriculumLoadEntry[]
}

// Note: These arrays drive the wizard logic by defining which fields belong to
// each step and which title should be shown for that step.
// Fields belonging to each step: used to scope light step validation on Next.
export const STEP_FIELDS = [
  ['lawProgramClassification', 'doctorateProgram'], // Step 0 - Law Program Classification
  ['programType', 'governmentAuthority', 'validity', 'locationSite', 'recognitionStatus', 'recognitionNumber', 'permitNumber'], // Step 1 - Program Offered
  ['startMonth', 'endMonth'],                // Step 2 - Academic Calendar
  ['curricularSchedule'],                    // Step 3 - Curricular Schedule
  ['programDuration'],                       // Step 4 - Program Duration
  ['classOperatingFrom', 'classOperatingTo'], // Step 5 - Class Operating Schedule
  ['lebApprovalDate', 'curricula'],          // Step 6 - Curriculum
] as const

export const STEP_TITLES = [
  'Law Program Classification',
  'Program Offered',
  'Academic Calendar',
  'Curricular Schedule',
  'Program Duration',
  'Class Operating Schedule',
  'Curriculum',
] as const

// Note: This is the in-memory TypeScript shape of the form data.
export type ProgInfoFormData = {
  lawProgramClassification: LawProgramClassification | ''
  doctorateProgram: DoctorateProgramOption | ''
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
  lebApprovalDate: string
  curricula: CurriculumEntry[]
}

const DraftCurriculumLoadEntrySchema = z.object({
  year: z.number().int().min(1).max(5),
  first_sem: z.union([z.number().int('Must be a whole number'), z.literal('')]),
  second_sem: z.union([z.number().int('Must be a whole number'), z.literal('')]),
})

const DraftCurriculumEntrySchema = z.object({
  loads: z.array(DraftCurriculumLoadEntrySchema).length(5),
})

// LENIENT SCHEMA: used during editing so incomplete later-step fields do not
// block progress while the form is still being filled out.
// This schema matches the in-memory form state exactly, including '' placeholders.
export const ProgInfoDraftSchema = z.object({
  lawProgramClassification: z.enum(LAW_PROGRAM_CLASSIFICATIONS).or(z.literal('')),
  doctorateProgram: z.enum(DOCTORATE_PROGRAM_OPTIONS).or(z.literal('')),
  programType: z.enum(['extension', 'branch']).or(z.literal('')),
  permitNumber: z.string(),
  governmentAuthority: z.string(),
  validity: z.string(),
  locationSite: z.string(),
  recognitionStatus: z.enum(RECOGNITION_STATUSES).or(z.literal('')),
  recognitionNumber: z.string(),
  startMonth: z.enum(MONTHS).or(z.literal('')),
  endMonth: z.enum(MONTHS).or(z.literal('')),
  classOperatingFrom: z.enum(DAYS).or(z.literal('')),
  classOperatingTo: z.enum(DAYS).or(z.literal('')),
  curricularSchedule: z.enum(CURRICULAR_SCHEDULES).or(z.literal('')),
  programDuration: z.enum(['online', 'hybrid']).or(z.literal('')),
  lebApprovalDate: z.string(),
  curricula: z.array(DraftCurriculumEntrySchema),
})

export const ProgramInfoSubmissionSchema = z.object({
  id: z.string(),
  submittedAt: z.string(),
  data: ProgInfoSchema,
})

export type ProgramInfoSubmission = z.infer<typeof ProgramInfoSubmissionSchema>

// Note: Default values used when the form is first initialized or reset.
export const progInfoDefaultValues: ProgInfoFormData = {
  lawProgramClassification: '',
  doctorateProgram: '',
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
  lebApprovalDate: '',
  curricula: [
    {
      loads: [
        { year: 1, first_sem: '', second_sem: '' },
        { year: 2, first_sem: '', second_sem: '' },
        { year: 3, first_sem: '', second_sem: '' },
        { year: 4, first_sem: '', second_sem: '' },
        { year: 5, first_sem: '', second_sem: '' },
      ],
    },
  ],
}
