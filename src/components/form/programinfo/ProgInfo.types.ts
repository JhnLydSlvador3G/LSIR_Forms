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

const IntegerFieldSchema = z.preprocess(
  (value) => {
    if (value === '' || value === null || value === undefined) return undefined
    if (typeof value === 'string') return Number(value)
    return value
  },
  z.number({ error: 'Required' }).int('Must be a whole number'),
)

const CurriculumLoadEntryBaseSchema = z.object({
  year: z.number().int().min(1).max(5),
  first_sem: IntegerFieldSchema,
  second_sem: IntegerFieldSchema,
})

const CurriculumEntryBaseSchema = z.object({
  loads: z.array(CurriculumLoadEntryBaseSchema).length(5),
})

export type CurriculumLoadEntry = {
  year: number
  first_sem: number | ''
  second_sem: number | ''
}

export type CurriculumEntry = {
  loads: CurriculumLoadEntry[]
}

const ProgInfoBaseSchema = z.object({
  lawSchoolId: z.string(),
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
  if (values.lawSchoolId.trim().length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['lawSchoolId'],
      message: 'Required',
    })
  }

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

  if (values.lebApprovalDate.trim().length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['lebApprovalDate'],
      message: 'LEB Approval Date is required',
    })
  }

  if (values.curricula.length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['curricula'],
      message: 'At least one semestral academic load is required',
    })
  }
})

const DraftCurriculumLoadEntrySchema = z.object({
  year: z.number().int().min(1).max(5),
  first_sem: z.union([z.number().int('Must be a whole number'), z.literal('')]),
  second_sem: z.union([z.number().int('Must be a whole number'), z.literal('')]),
})

const DraftCurriculumEntrySchema = z.object({
  loads: z.array(DraftCurriculumLoadEntrySchema).length(5),
})

export const ProgInfoDraftSchema = z.object({
  lawSchoolId: z.string(),
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

export const STEP_FIELDS = [
  ['lawProgramClassification', 'doctorateProgram'],
  ['programType', 'governmentAuthority', 'validity', 'locationSite', 'recognitionStatus', 'recognitionNumber', 'permitNumber'],
  ['startMonth', 'endMonth'],
  ['curricularSchedule'],
  ['programDuration'],
  ['classOperatingFrom', 'classOperatingTo'],
  ['lebApprovalDate', 'curricula'],
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

export type ProgInfoFormData = {
  lawSchoolId: string
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

export const ProgramInfoSubmissionSchema = z.object({
  id: z.string(),
  submittedAt: z.string(),
  data: ProgInfoSchema,
})

export type ProgramInfoSubmission = z.infer<typeof ProgramInfoSubmissionSchema>

export const progInfoDefaultValues: ProgInfoFormData = {
  lawSchoolId: '',
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
