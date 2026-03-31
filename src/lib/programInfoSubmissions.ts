import {
  ProgramInfoSubmissionSchema,
  type ProgInfoFormData,
  type ProgramInfoSubmission,
} from '@/components/form/programinfo/ProgInfo.types'

export const PROGRAM_INFO_SUBMISSIONS_KEY = 'programinfo-submissions'

const ProgramInfoSubmissionListSchema = ProgramInfoSubmissionSchema.array()

export function loadProgramInfoSubmissions(): ProgramInfoSubmission[] {
  if (typeof window === 'undefined') return []

  try {
    const raw = localStorage.getItem(PROGRAM_INFO_SUBMISSIONS_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw)
    const result = ProgramInfoSubmissionListSchema.safeParse(parsed)

    return result.success ? result.data : []
  } catch {
    return []
  }
}

export function appendProgramInfoSubmission(
  data: ProgInfoFormData
): ProgramInfoSubmission {
  const submission: ProgramInfoSubmission = {
    id: crypto.randomUUID(),
    submittedAt: new Date().toISOString(),
    data,
  }

  const existing = loadProgramInfoSubmissions()
  localStorage.setItem(
    PROGRAM_INFO_SUBMISSIONS_KEY,
    JSON.stringify([submission, ...existing])
  )

  return submission
}
