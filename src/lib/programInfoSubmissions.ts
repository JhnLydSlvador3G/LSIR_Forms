import {
  ProgramInfoSubmissionSchema,
  type ProgInfoFormData,
  type ProgramInfoSubmission,
} from '@/components/form/programinfo/ProgInfo.types'

export const PROGRAM_INFO_SUBMISSIONS_KEY = 'programinfo-submissions'

const ProgramInfoSubmissionListSchema = ProgramInfoSubmissionSchema.array()

const normalizeSemestralValue = (value: unknown): number | '' => {
  if (value === '' || value === null || value === undefined) return ''
  if (typeof value === 'number') return Number.isInteger(value) ? value : ''
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return ''
    const parsed = Number(trimmed)
    return Number.isInteger(parsed) ? parsed : ''
  }
  return ''
}

const normalizeSubmissionShape = (submission: unknown): unknown => {
  if (!submission || typeof submission !== 'object') return submission

  const candidate = submission as Record<string, unknown>
  const data =
    candidate.data && typeof candidate.data === 'object'
      ? (candidate.data as Record<string, unknown>)
      : null

  if (!data) return submission

  const curricula = Array.isArray(data.curricula) ? data.curricula : []
  const nestedLebApprovalDate = curricula.find(
    (entry) =>
      entry &&
      typeof entry === 'object' &&
      typeof (entry as Record<string, unknown>).lebApprovalDate === 'string',
  )

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
    (entry) =>
      entry &&
      typeof entry === 'object' &&
      Array.isArray((entry as Record<string, unknown>).loads),
  )
    ? curricula.map((entry) => {
        const curriculum = entry as Record<string, unknown>
        const loads = Array.isArray(curriculum.loads)
          ? (curriculum.loads as Array<Record<string, unknown>>)
          : []

        return {
          loads: [1, 2, 3, 4, 5].map((year, index) => ({
            year,
            first_sem: normalizeSemestralValue(loads[index]?.first_sem),
            second_sem: normalizeSemestralValue(loads[index]?.second_sem),
          })),
        }
      })
    : [{
        loads: firstSemKeys.map((firstKey, index) => {
          const legacyEntry =
            curricula[index] && typeof curricula[index] === 'object'
              ? (curricula[index] as Record<string, unknown>)
              : {}

          return {
            year: index + 1,
            first_sem: normalizeSemestralValue(
              legacyEntry[firstKey] ?? legacyEntry.first_sem ?? '',
            ),
            second_sem: normalizeSemestralValue(
              legacyEntry[secondSemKeys[index]] ?? legacyEntry.second_sem ?? '',
            ),
          }
        }),
      }]

  return {
    ...candidate,
    data: {
      ...data,
      lawSchoolId:
        typeof data.lawSchoolId === 'string' ? data.lawSchoolId : '',
      lebApprovalDate:
        typeof data.lebApprovalDate === 'string'
          ? data.lebApprovalDate
          : typeof nestedLebApprovalDate === 'object' &&
              nestedLebApprovalDate !== null &&
              typeof (nestedLebApprovalDate as Record<string, unknown>).lebApprovalDate === 'string'
            ? (nestedLebApprovalDate as Record<string, unknown>).lebApprovalDate
            : '',
      curricula: normalizedCurricula,
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
  data: ProgInfoFormData,
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
    JSON.stringify([submission, ...existing]),
  )

  return submission
}
