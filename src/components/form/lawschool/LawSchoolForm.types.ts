import { z } from 'zod'
import { AddressSchema } from '../address/AddressForm.type'

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

// Nested schema for the Dean's degree details.
export const deanDegreeSchema = z.object({
  highestDegreeType: z.string().min(1, 'Required'),
  rollNumber: z.string().min(1, 'Required'),
  yearsTeachingExp: z.string().min(1, 'Required'),
  yearsAdminExp: z.string().min(1, 'Required'),
})

// Nested schema for the Dean's "person" information.
export const deanSchema = z.object({
  firstName: z.string().min(1, 'Required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Required'),
  suffix: z.string().optional(),
  dateOfAppointment: z.string().min(1, 'Required'),
  email: z.email('Invalid Email'),
  mobileNumber: z
    .string()
    .trim()
    .nonempty('Required')
    .regex(/^(09|\+639)\d{9}$/, 'Invalid Number'),
  degree: deanDegreeSchema,
})

// Base schema for the Law School page.
export const lawSchoolFormSchema = z.object({
  mailingAddress: AddressSchema,
  email: z.email('Invalid Email'),
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
}).superRefine((data, ctx) => {
  if (data.lawProgram === 'doctorate') {
    if (!data.doctoralType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['doctoralType'],
        message: 'Required',
      })
    }
    if (data.doctoralType === 'others' && !data.doctoralOtherText?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['doctoralOtherText'],
        message: 'Please specify',
      })
    }
  }
  if (data.recognitionStatus === 'others' && !data.recognitionStatusOtherText?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['recognitionStatusOtherText'],
      message: 'Please specify',
    })
  }
  if (
    data.lawSchoolUnitName === 'others' &&
    !data.lawSchoolUnitNameOtherText?.trim()
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['lawSchoolUnitNameOtherText'],
      message: 'Please specify',
    })
  }
})

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
