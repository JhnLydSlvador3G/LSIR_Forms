import {
  lawSchoolFormSchema,
  type LawSchoolFormData,
} from '@/components/form/lawschool/LawSchoolForm.types'
import { z } from 'zod'

export const LAW_SCHOOL_SUBMISSIONS_KEY = 'lawSchool-submissions'

export const LawSchoolSubmissionSchema = z.object({
  id: z.string(),
  submittedAt: z.string(),
  data: lawSchoolFormSchema,
})

const LawSchoolSubmissionListSchema = LawSchoolSubmissionSchema.array()

export type LawSchoolSubmission = z.infer<typeof LawSchoolSubmissionSchema>

export function loadLawSchoolSubmissions(): LawSchoolSubmission[] {
  if (typeof window === 'undefined') return []

  try {
    const raw = localStorage.getItem(LAW_SCHOOL_SUBMISSIONS_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw)
    const result = LawSchoolSubmissionListSchema.safeParse(parsed)

    return result.success ? result.data : []
  } catch {
    return []
  }
}

export function appendLawSchoolSubmission(
  data: LawSchoolFormData,
): LawSchoolSubmission {
  const parsedData = lawSchoolFormSchema.parse(data)

  const submission: LawSchoolSubmission = {
    id: crypto.randomUUID(),
    submittedAt: new Date().toISOString(),
    data: parsedData,
  }

  const existing = loadLawSchoolSubmissions()
  localStorage.setItem(
    LAW_SCHOOL_SUBMISSIONS_KEY,
    JSON.stringify([submission, ...existing]),
  )

  return submission
}

export function getLawSchoolSubmissionDisplayName(
  submission: LawSchoolSubmission,
) {
  const { lawSchoolUnitName, lawSchoolUnitNameOtherText } = submission.data

  if (lawSchoolUnitName === 'Others') {
    return lawSchoolUnitNameOtherText?.trim() || 'Unnamed LEI'
  }

  return lawSchoolUnitName || 'Unnamed LEI'
}
