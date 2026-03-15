import { z } from 'zod'

export const ProgInfoSchema = z.object({
  programType: z.enum(['extension', 'branch']),
  permitNumber: z.string().min(1, 'Permit number is required'),
})

export const ProgInfoDraftSchema = z.object({
  programType: z.enum(['extension', 'branch']).optional(),
  permitNumber: z.string().optional(),
})

export type ProgInfoFormData = {
  programType: 'extension' | 'branch' | undefined
  permitNumber: string
}

export const progInfoDefaultValues: ProgInfoFormData = {
  programType: undefined,
  permitNumber: '',
}
