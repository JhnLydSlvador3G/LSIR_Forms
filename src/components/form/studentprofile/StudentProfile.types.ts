import { z } from 'zod'

/* ---------------------------------- */
/* Academic Levels Enum */
/* ---------------------------------- */
export const AcademicLevelEnum = z.enum([
  'First Year basic law course',
  'Second Year basic law course',
  'Third Year basic law course',
  'Fourth Year basic law course',
  'Fifth Year basic law course',
  'Refresher students',
  'Masteral degree level',
  'Doctoral degree level',
])

/* ---------------------------------- */
/* Digits-only string validator */
/* ---------------------------------- */
const DigitString = z
  .string()
  .refine((val) => val === '0' || /^\d+$/.test(val), {
    message: 'Must contain digits only',
  })

/* ---------------------------------- */
/* Single Row Schema */
/* ---------------------------------- */
export const StudentProfileRowSchema = z.object({
  yearLevel: AcademicLevelEnum,
  male: DigitString,
  female: DigitString,
  fullTime: DigitString,
  working: DigitString,
  scholars: DigitString,
  transfers: DigitString,
})

/* ---------------------------------- */
/* Main Form Schema */
/* ---------------------------------- */
export const StudentProfileSchema = z.object({
  profiles: z.array(StudentProfileRowSchema),
})

export type StudentProfileFormData = z.infer<typeof StudentProfileSchema>

/* ---------------------------------- */
/* Default Values */
/* ---------------------------------- */
export const StudentDefaultValues: StudentProfileFormData['profiles'] = [
  {
    yearLevel: 'First Year basic law course',
    male: '0',
    female: '0',
    fullTime: '0',
    working: '0',
    scholars: '0',
    transfers: '0',
  },
  {
    yearLevel: 'Second Year basic law course',
    male: '0',
    female: '0',
    fullTime: '0',
    working: '0',
    scholars: '0',
    transfers: '0',
  },
  {
    yearLevel: 'Third Year basic law course',
    male: '0',
    female: '0',
    fullTime: '0',
    working: '0',
    scholars: '0',
    transfers: '0',
  },
  {
    yearLevel: 'Fourth Year basic law course',
    male: '0',
    female: '0',
    fullTime: '0',
    working: '0',
    scholars: '0',
    transfers: '0',
  },
  {
    yearLevel: 'Fifth Year basic law course',
    male: '0',
    female: '0',
    fullTime: '0',
    working: '0',
    scholars: '0',
    transfers: '0',
  },
  {
    yearLevel: 'Refresher students',
    male: '0',
    female: '0',
    fullTime: '0',
    working: '0',
    scholars: '0',
    transfers: '0',
  },
  {
    yearLevel: 'Masteral degree level',
    male: '0',
    female: '0',
    fullTime: '0',
    working: '0',
    scholars: '0',
    transfers: '0',
  },
  {
    yearLevel: 'Doctoral degree level',
    male: '0',
    female: '0',
    fullTime: '0',
    working: '0',
    scholars: '0',
    transfers: '0',
  },
]

export const StudentProfileDraftSchema = StudentProfileSchema.partial()
