import {
  ProgramInfoSubmissionSchema,
  type ProgInfoFormData,
  type ProgramInfoSubmission,
} from '@/components/form/programinfo/ProgInfo.types'

export const PROGRAM_INFO_SUBMISSIONS_KEY = 'programinfo-submissions'

const ProgramInfoSubmissionListSchema = ProgramInfoSubmissionSchema.array()

const normalizeSemestralValue = (value: unknown) => {
  if (value === '' || value === null || value === undefined) return ''
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return ''
    const parsed = Number(trimmed)
    return Number.isNaN(parsed) ? '' : parsed
  }
  return ''
}

const normalizeSubmissionShape = (submission: any) => {
  if (!submission || typeof submission !== 'object') return submission

  const data = submission.data
  if (!data || typeof data !== 'object') return submission

  const curricula = Array.isArray(data.curricula) ? data.curricula : []
  const nestedLebApprovalDate = curricula.find(
    (entry: any) => entry && typeof entry.lebApprovalDate === 'string'
  )?.lebApprovalDate
  const firstSemKeys = [
    'firstYearFirstSem',
    'secondYearFirstSem',
    'thirdYearFirstSem',
    'fourthYearFirstSem',
    'fifthYearFirstSem',
  ] as const
  const secondSemKeys = [
    'firstYearSecondSem',
    'secondYearSecondSem',
    'thirdYearSecondSem',
    'fourthYearSecondSem',
    'fifthYearSecondSem',
  ] as const

  const normalizedCurricula = curricula.every(
    (entry: any) => entry && typeof entry === 'object' && Array.isArray(entry.loads)
  )
    ? curricula
    : [{
        loads: firstSemKeys.map((firstKey, index) => {
          const legacyEntry = curricula[index] ?? {}
          return {
            year: index + 1,
            first_sem: normalizeSemestralValue(
              legacyEntry[firstKey] ?? legacyEntry.first_sem ?? ''
            ),
            second_sem: normalizeSemestralValue(
              legacyEntry[secondSemKeys[index]] ?? legacyEntry.second_sem ?? ''
            ),
          }
        }),
      }]

  return {
    ...submission,
    data: {
      ...data,
      lebApprovalDate: data.lebApprovalDate ?? nestedLebApprovalDate ?? '',
      curricula: normalizedCurricula.map((entry: any) => {
        if (!entry || typeof entry !== 'object') return entry
        const { lebApprovalDate: _legacyLebApprovalDate, ...rest } = entry
        return rest
      }),
    },
  }
}

export function loadProgramInfoSubmissions(): ProgramInfoSubmission[] {
  if (typeof window === 'undefined') return []

  try {
    const raw = localStorage.getItem(PROGRAM_INFO_SUBMISSIONS_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw)
    const normalized = Array.isArray(parsed)
      ? parsed.map(normalizeSubmissionShape)
      : parsed
    const result = ProgramInfoSubmissionListSchema.safeParse(normalized)

    return result.success ? result.data : []
  } catch {
    return []
  }
}

export function appendProgramInfoSubmission(
  data: ProgInfoFormData
): ProgramInfoSubmission {
  const parsedData = ProgramInfoSubmissionSchema.shape.data.parse(data)

  const submission: ProgramInfoSubmission = {
    id: crypto.randomUUID(),
    submittedAt: new Date().toISOString(),
    data: parsedData,
  }

  const existing = loadProgramInfoSubmissions()
  localStorage.setItem(
    PROGRAM_INFO_SUBMISSIONS_KEY,
    JSON.stringify([submission, ...existing])
  )

  return submission
}
