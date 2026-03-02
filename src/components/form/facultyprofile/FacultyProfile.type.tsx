// FacultyProfile.types.ts
import { z } from 'zod'

const DigitString = z
  .string()
  .refine((val) => val === '' || /^\d+$/.test(val), 'Must contain digits only')

export const FacultyRowSchema = z.object({
  gender: z.enum(['Male', 'Female']),
  // Highest Law Degree
  basic: DigitString,
  master: DigitString,
  doctor: DigitString,
  // Employment Status
  regular: DigitString,
  partTime: DigitString,
  // Primary Employment
  retired: DigitString,
  private: DigitString,
  judges: DigitString,
  prosecutor: DigitString,
  otherGov: DigitString,
})

export const FacultyProfileSchema = z.object({
  faculty: z.array(FacultyRowSchema),
})

export type FacultyProfileFormData = z.infer<typeof FacultyProfileSchema>

export type FacultyRow = FacultyProfileFormData['faculty'][number]

export const FacultyDefaultValues: FacultyProfileFormData['faculty'] = [
  {
    gender: 'Male',
    basic: '',
    master: '',
    doctor: '',
    regular: '',
    partTime: '',
    retired: '',
    private: '',
    judges: '',
    prosecutor: '',
    otherGov: '',
  },
  {
    gender: 'Female',
    basic: '',
    master: '',
    doctor: '',
    regular: '',
    partTime: '',
    retired: '',
    private: '',
    judges: '',
    prosecutor: '',
    otherGov: '',
  },
]

export const FacultyProfileDraftSchema = FacultyProfileSchema.partial()
