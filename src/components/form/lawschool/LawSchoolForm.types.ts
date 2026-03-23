import { z } from 'zod'
import { AddressSchema } from '../address/AddressForm.type'
import type { StepConfig } from '@/hooks/useStepper'

// Law program offered (single choice)
export const lawProgramEnum = z.enum([
  '',
  'jurisDoctor',
  'masterOfLaws',
  'doctorate',
])

// Recognition status (single choice)
export const recognitionStatusEnum = z.enum([
  '',
  'govPermit1',
  'govPermit2',
  'govPermit3',
  'govRecognition',
  'others',
])

// Accreditation status (single choice)
export const accreditationStatusEnum = z.enum([
  '',
  'level1',
  'level2',
  'level3',
  'centerDevelopment',
  'centerExcellence',
  'deregulatedStatus',
  'autonomousStatus',
])

// Doctorate type (only when Doctorate is selected)
export const doctoralTypeEnum = z.enum([
  'doctorCivilLaw',
  'doctorJuridicalScience',
  'others',
])

// Nested schema for the Dean's degree details (Step 4).
export const deanDegreeSchema = z.object({
  highestDegreeType: z.string().min(1, 'Required'),
  rollNumber: z.string().min(1, 'Required'),
  yearsTeachingExp: z.string().min(1, 'Required'),
  yearsAdminExp: z.string().min(1, 'Required'),
})

// Nested schema for the Dean's "person" information (Step 3).
export const deanInfoSchema = z.object({
  firstName: z.string().min(1, 'Required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Required'),
  suffix: z.string().optional(),
  dateOfAppointment: z.string().min(1, 'Required'),
  email: z.string().email('Invalid Email'),
  mobileNumber: z
    .string()
    .trim()
    .nonempty('Required')
    .regex(/^(09|\+639)\d{9}$/, 'Invalid Number'),
})

// Full Dean schema used in the strict full-form submit validation.
export const deanSchema = deanInfoSchema.extend({
  degree: deanDegreeSchema,
})

export const LAW_SCHOOL_STEPS: StepConfig[] = [
  {
    title: 'General Information',
    fields: [
      'lawSchoolUnitName',
      'lawProgram',
      'recognitionStatus',
      'accreditationStatus',
      'email',
      'telNumber',
      'mobileNumber',
      'lawSchoolUnitNameOtherText',
      'doctoralType',
      'doctoralOtherText',
      'recognitionStatusOtherText',
    ],
  },
  {
    title: 'Mailing Address',
    fields: [
      'mailingAddress.street',
      'mailingAddress.barangay',
      'mailingAddress.cityMult',
      'mailingAddress.province',
      'mailingAddress.region',
      'mailingAddress.building',
      'mailingAddress.district',
    ],
  },
  {
    title: 'Law Dean',
    fields: [
      'dean.firstName',
      'dean.lastName',
      'dean.dateOfAppointment',
      'dean.email',
      'dean.mobileNumber',
      'dean.middleName',
      'dean.suffix',
    ],
  },
  {
    title: "Dean's Background",
    fields: [
      'dean.degree.highestDegreeType',
      'dean.degree.rollNumber',
      'dean.degree.yearsTeachingExp',
      'dean.degree.yearsAdminExp',
    ],
  },
]

export const LAW_SCHOOL_ADDRESS_FIELDS = {
  building: 'mailingAddress.building',
  street: 'mailingAddress.street',
  barangay: 'mailingAddress.barangay',
  district: 'mailingAddress.district',
  cityMult: 'mailingAddress.cityMult',
  province: 'mailingAddress.province',
  region: 'mailingAddress.region',
} as const

// Base schema for the Law School page (no cross-field superRefine here).
export const lawSchoolBaseSchema = z.object({
  mailingAddress: AddressSchema,
  email: z.string().email('Invalid Email'),
  telNumber: z.string().min(1, 'Required'),
  mobileNumber: z
    .string()
    .trim()
    .nonempty('Required')
    .regex(/^(09|\+639)\d{9}$/, 'Invalid Number'),
  lawSchoolUnitName: z.string().min(1, 'Required'),
  lawSchoolUnitNameOtherText: z.string().optional(),
  lawProgram: lawProgramEnum,
  doctoralType: doctoralTypeEnum.optional(),
  doctoralOtherText: z.string().optional(),
  recognitionStatus: recognitionStatusEnum,
  recognitionStatusOtherText: z.string().optional(),
  accreditationStatus: accreditationStatusEnum,
  dean: deanSchema,
})

const addRequiredIssue = (
  ctx: z.RefinementCtx,
  path: string[],
  message = 'Required',
) => {
  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    path,
    message,
  })
}

const applyLawSchoolConditionalRules = (
  data: z.infer<typeof lawSchoolBaseSchema>,
  ctx: z.RefinementCtx,
) => {
  if (data.lawProgram === '') {
    addRequiredIssue(ctx, ['lawProgram'])
  }

  if (data.recognitionStatus === '') {
    addRequiredIssue(ctx, ['recognitionStatus'])
  }

  if (data.accreditationStatus === '') {
    addRequiredIssue(ctx, ['accreditationStatus'])
  }

  if (data.lawProgram === 'doctorate') {
    if (!data.doctoralType) {
      addRequiredIssue(ctx, ['doctoralType'])
    }

    if (data.doctoralType === 'others' && !data.doctoralOtherText?.trim()) {
      addRequiredIssue(ctx, ['doctoralOtherText'], 'Please specify')
    }
  }

  if (
    data.recognitionStatus === 'others' &&
    !data.recognitionStatusOtherText?.trim()
  ) {
    addRequiredIssue(ctx, ['recognitionStatusOtherText'], 'Please specify')
  }

  if (
    data.lawSchoolUnitName === 'others' &&
    !data.lawSchoolUnitNameOtherText?.trim()
  ) {
    addRequiredIssue(ctx, ['lawSchoolUnitNameOtherText'], 'Please specify')
  }
}

// Strict schema for final submit (includes cross-field rules).
export const lawSchoolFormSchema = lawSchoolBaseSchema.superRefine(
  (data: z.infer<typeof lawSchoolBaseSchema>, ctx) => {
    applyLawSchoolConditionalRules(data, ctx)
  },
)

// Lenient draft schema for onChange to avoid blocking mid-form.
// Use a deep-partial helper so nested required fields (e.g. dean.degree.*) don't
// validate before the user reaches those steps (compatible with older Zod).
const deepPartial = (schema: z.ZodTypeAny): z.ZodTypeAny => {
  if (schema instanceof z.ZodObject) {
    const shape = schema.shape
    const nextShape: Record<string, z.ZodTypeAny> = {}
    for (const key of Object.keys(shape)) {
      nextShape[key] = deepPartial(shape[key])
    }
    return z.object(nextShape).partial()
  }
  if (schema instanceof z.ZodArray) {
    return z.array(deepPartial(schema.element as z.ZodTypeAny))
  }
  if (schema instanceof z.ZodOptional) {
    return deepPartial((schema.unwrap() as z.ZodTypeAny)).optional()
  }
  if (schema instanceof z.ZodNullable) {
    return deepPartial((schema.unwrap() as z.ZodTypeAny)).nullable()
  }
  if (schema instanceof z.ZodDefault) {
    return deepPartial((schema.removeDefault() as z.ZodTypeAny)).optional()
  }
  return schema.optional()
}

export const lawSchoolFormDraftSchema =
  deepPartial(lawSchoolBaseSchema) as typeof lawSchoolBaseSchema

// Per-step schemas for Next-button validation.
const lawSchoolStep1Base = lawSchoolBaseSchema.pick({
  lawSchoolUnitName: true,
  lawSchoolUnitNameOtherText: true,
  lawProgram: true,
  doctoralType: true,
  doctoralOtherText: true,
  recognitionStatus: true,
  recognitionStatusOtherText: true,
  accreditationStatus: true,
  email: true,
  telNumber: true,
  mobileNumber: true,
})

const lawSchoolStep1Schema = lawSchoolStep1Base.superRefine(
  (data: z.infer<typeof lawSchoolStep1Base>, ctx) => {
    applyLawSchoolConditionalRules(data as z.infer<typeof lawSchoolBaseSchema>, ctx)
  },
)

export const LAW_SCHOOL_STEP_SCHEMAS = [
  lawSchoolStep1Schema,
  z.object({
    mailingAddress: AddressSchema,
  }),
  z.object({
    dean: deanInfoSchema,
  }),
  z.object({
    dean: z.object({
      degree: deanDegreeSchema,
    }),
  }),
]

export type LawSchoolFormData = z.infer<typeof lawSchoolFormSchema>

// Default values used by TanStack React Form and ResetButton.
export const lawSchoolFormDefaultValues: LawSchoolFormData = {
  mailingAddress: {
    building: '',
    street: '',
    barangay: '',
    district: '',
    cityMult: '',
    province: '',
    region: '',
  },
  email: '',
  telNumber: '',
  mobileNumber: '',
  lawSchoolUnitName: '',
  lawSchoolUnitNameOtherText: '',
  lawProgram: '',
  doctoralOtherText: '',
  recognitionStatus: '',
  recognitionStatusOtherText: '',
  accreditationStatus: '',
  dean: {
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    dateOfAppointment: '',
    email: '',
    mobileNumber: '',
    degree: {
      highestDegreeType: '',
      rollNumber: '',
      yearsTeachingExp: '',
      yearsAdminExp: '',
    },
  },
}
