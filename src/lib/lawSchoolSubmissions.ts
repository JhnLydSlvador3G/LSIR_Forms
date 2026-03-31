import {
  lawSchoolFormSchema,
  type LawSchoolFormData,
} from '@/components/form/lawschool/LawSchoolForm.types'
import { z } from 'zod'

export const LAW_SCHOOL_SUBMISSIONS_KEY = 'lawSchool-submissions'
export const ACTIVE_LAW_SCHOOL_SUBMISSION_ID_KEY = 'lawSchool-active-submission-id'

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

    if (!result.success) return []

    const seen = new Set<string>()
    const deduped = result.data.filter((submission) => {
      const signature = JSON.stringify(submission.data)
      if (seen.has(signature)) {
        return false
      }
      seen.add(signature)
      return true
    })

    if (deduped.length !== result.data.length) {
      localStorage.setItem(
        LAW_SCHOOL_SUBMISSIONS_KEY,
        JSON.stringify(deduped),
      )
    }

    return deduped
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

export function saveLawSchoolSubmission(
  data: LawSchoolFormData,
  existingId?: string,
): LawSchoolSubmission {
  const parsedData = lawSchoolFormSchema.parse(data)
  const existing = loadLawSchoolSubmissions()

  if (existingId) {
    const match = existing.find((submission) => submission.id === existingId)

    if (match) {
      const updatedSubmission: LawSchoolSubmission = {
        ...match,
        data: parsedData,
      }

      localStorage.setItem(
        LAW_SCHOOL_SUBMISSIONS_KEY,
        JSON.stringify(
          existing.map((submission) =>
            submission.id === existingId ? updatedSubmission : submission,
          ),
        ),
      )

      localStorage.setItem(ACTIVE_LAW_SCHOOL_SUBMISSION_ID_KEY, updatedSubmission.id)
      return updatedSubmission
    }
  }

  const created = appendLawSchoolSubmission(parsedData)
  localStorage.setItem(ACTIVE_LAW_SCHOOL_SUBMISSION_ID_KEY, created.id)
  return created
}

export function loadActiveLawSchoolSubmissionId() {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem(ACTIVE_LAW_SCHOOL_SUBMISSION_ID_KEY) || ''
}

export function clearActiveLawSchoolSubmissionId() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(ACTIVE_LAW_SCHOOL_SUBMISSION_ID_KEY)
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
