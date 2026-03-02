import z from 'zod'

const DigitString = z
  .string()
  .refine((val) => val === '' || /^\d+$/.test(val), 'Must contain digits only')

// Dates in the form are stored as ISO strings (or empty string when not set).
const IsoDateString = z
  .string()
  .refine(
    (val) => val === '' || !Number.isNaN(Date.parse(val)),
    'Invalid date format',
  )

export const ActivityRowSchema = z
  .object({
    activityTitle: z.string().min(1, 'Required'),
    trainingHours: DigitString,
    participantCount: DigitString,
    competencies: z.string(),
    startDate: IsoDateString,
    endDate: IsoDateString,
  })
  .refine(
    (data) => {
      // If either date is empty, skip the range check.
      if (!data.startDate || !data.endDate) return true
      return new Date(data.startDate) <= new Date(data.endDate)
    },
    {
      message: 'End Date must be after start date',
      path: ['endDate'],
    },
  )

export const FacultyActivitySchema = z.object({
  activities: z.array(ActivityRowSchema),
})

export type FacultyAcitivityData = z.infer<typeof FacultyActivitySchema>

export type ActivityRow = FacultyAcitivityData['activities'][number]

export const FacultyActivityDraftSchema = FacultyActivitySchema.partial()

export const FacultyActivityDefaultValues: FacultyAcitivityData['activities'] =
  [
    {
      activityTitle: '',
      trainingHours: '0',
      participantCount: '0',
      competencies: '',
      startDate: '',
      endDate: '',
    },
  ]
