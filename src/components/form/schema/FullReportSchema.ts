import z from 'zod'

import { heiFormSchema, heiFormDraftSchema } from '../hei/HeiForm.types'

import {
    FacultyProfileSchema,
    FacultyProfileDraftSchema,
} from '../facultyprofile/FacultyProfile.type'

import {
    FacultyActivitySchema,
    FacultyActivityDraftSchema,
} from '../facultydevelopment/FacultyDev.type'

import {
    StudentProfileSchema,
    StudentProfileDraftSchema,
} from '../studentprofile/StudentProfile.types'

// Full required schema
export const FullReportSchema = z.object({
    hei: heiFormSchema,
    facultyProfile: FacultyProfileSchema,
    facultyDevelopment: FacultyActivitySchema,
    studentProfile: StudentProfileSchema,
})

export type FullReportFormData = z.infer<typeof FullReportSchema>

// Full draft (required for each draft)
export const FullReportDraftSchema = z.object({
    hei: heiFormDraftSchema,
    facultyProfile: FacultyProfileDraftSchema,
    facultyDevelopment: FacultyActivityDraftSchema,
    studentProfile: StudentProfileDraftSchema,
})



export type FullReportDraftData = z.infer<typeof FullReportDraftSchema>

// ✅ Optional Partial Schema for saving partial drafts
export const FullReportPartialSchema = FullReportSchema.partial()
export type FullReportPartialData = z.infer<typeof FullReportPartialSchema>