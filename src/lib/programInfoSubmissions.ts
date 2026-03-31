import {
  ProgramInfoSubmissionSchema,
  type ProgInfoFormData,
  type ProgramInfoSubmission,
} from '@/components/form/programinfo/ProgInfo.types'

export const PROGRAM_INFO_SUBMISSIONS_KEY = 'programinfo-submissions'

const ProgramInfoSubmissionListSchema = ProgramInfoSubmissionSchema.array()
const emptyCurriculum = {
  lebApprovalDate: '',
  firstYearFirstSem: '',
  firstYearSecondSem: '',
  secondYearFirstSem: '',
  secondYearSecondSem: '',
  thirdYearFirstSem: '',
  thirdYearSecondSem: '',
  fourthYearFirstSem: '',
  fourthYearSecondSem: '',
  fifthYearFirstSem: '',
  fifthYearSecondSem: '',
  totalAcademicLoadFirstSem: '',
  totalAcademicLoadSecondSem: '',
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

  const normalizedCurricula = curricula.map((entry) => {
    if (!entry || typeof entry !== 'object') {
      return emptyCurriculum
    }

    const curriculum = entry as Record<string, unknown>

    if (Array.isArray(curriculum.loads)) {
      const loads = curriculum.loads as Array<Record<string, unknown>>
      const getLoadValue = (index: number, key: 'first_sem' | 'second_sem') => {
        const rawValue = loads[index]?.[key]
        return rawValue == null ? '' : String(rawValue)
      }

      return {
        lebApprovalDate:
          typeof curriculum.lebApprovalDate === 'string'
            ? curriculum.lebApprovalDate
            : '',
        firstYearFirstSem: getLoadValue(0, 'first_sem'),
        firstYearSecondSem: getLoadValue(0, 'second_sem'),
        secondYearFirstSem: getLoadValue(1, 'first_sem'),
        secondYearSecondSem: getLoadValue(1, 'second_sem'),
        thirdYearFirstSem: getLoadValue(2, 'first_sem'),
        thirdYearSecondSem: getLoadValue(2, 'second_sem'),
        fourthYearFirstSem: getLoadValue(3, 'first_sem'),
        fourthYearSecondSem: getLoadValue(3, 'second_sem'),
        fifthYearFirstSem: getLoadValue(4, 'first_sem'),
        fifthYearSecondSem: getLoadValue(4, 'second_sem'),
        totalAcademicLoadFirstSem: '',
        totalAcademicLoadSecondSem: '',
      }
    }

    return {
      lebApprovalDate:
        typeof curriculum.lebApprovalDate === 'string'
          ? curriculum.lebApprovalDate
          : '',
      firstYearFirstSem:
        typeof curriculum.firstYearFirstSem === 'string'
          ? curriculum.firstYearFirstSem
          : '',
      firstYearSecondSem:
        typeof curriculum.firstYearSecondSem === 'string'
          ? curriculum.firstYearSecondSem
          : '',
      secondYearFirstSem:
        typeof curriculum.secondYearFirstSem === 'string'
          ? curriculum.secondYearFirstSem
          : '',
      secondYearSecondSem:
        typeof curriculum.secondYearSecondSem === 'string'
          ? curriculum.secondYearSecondSem
          : '',
      thirdYearFirstSem:
        typeof curriculum.thirdYearFirstSem === 'string'
          ? curriculum.thirdYearFirstSem
          : '',
      thirdYearSecondSem:
        typeof curriculum.thirdYearSecondSem === 'string'
          ? curriculum.thirdYearSecondSem
          : '',
      fourthYearFirstSem:
        typeof curriculum.fourthYearFirstSem === 'string'
          ? curriculum.fourthYearFirstSem
          : '',
      fourthYearSecondSem:
        typeof curriculum.fourthYearSecondSem === 'string'
          ? curriculum.fourthYearSecondSem
          : '',
      fifthYearFirstSem:
        typeof curriculum.fifthYearFirstSem === 'string'
          ? curriculum.fifthYearFirstSem
          : '',
      fifthYearSecondSem:
        typeof curriculum.fifthYearSecondSem === 'string'
          ? curriculum.fifthYearSecondSem
          : '',
      totalAcademicLoadFirstSem:
        typeof curriculum.totalAcademicLoadFirstSem === 'string'
          ? curriculum.totalAcademicLoadFirstSem
          : '',
      totalAcademicLoadSecondSem:
        typeof curriculum.totalAcademicLoadSecondSem === 'string'
          ? curriculum.totalAcademicLoadSecondSem
          : '',
    }
  })

  return {
    ...candidate,
    data: {
      ...data,
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
