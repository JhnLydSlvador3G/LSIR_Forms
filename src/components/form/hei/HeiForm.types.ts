import { z } from 'zod'
import { AddressSchema } from '../address/AddressForm.type'
import { heiPersonelSchema, type HeiPersonelFieldPaths } from './HeiPersonel.type'
import type { StepConfig } from '@/hooks/useStepper'

export const HeiOwnershipValueEnum = z.enum(['private', 'public'])
export type HeiOwnership = z.infer<typeof HeiOwnershipValueEnum>
export const HeiOwnershipEnum = z.enum(['', 'private', 'public'])

export const HeiTypeValueEnum = z.enum(['university', 'college', 'others'])
export type HeiType = z.infer<typeof HeiTypeValueEnum>
export const HeiTypeEnum = z.enum(['', 'university', 'college', 'others'])

export const HEI_STEPS: StepConfig[] = [
  {
    title: 'General Information',
    fields: [
      'heiName',
      'heiOwnership',
      'privateOwnerShip',
      'heiType',
      'heiOther',
      'heiTelNumber',
      'heiEmail',
      'heiWebsite',
    ],
  },
  {
    title: 'HEI Address',
    fields: [
      'heiAdd.building',
      'heiAdd.street',
      'heiAdd.barangay',
      'heiAdd.district',
      'heiAdd.cityMult',
      'heiAdd.province',
      'heiAdd.region',
    ],
  },
  {
    title: 'HEI President',
    fields: [
      'heiPres.firstName',
      'heiPres.middleName',
      'heiPres.lastName',
      'heiPres.suffix',
      'heiPres.email',
      'heiPres.telNum',
    ],
  },
  {
    title: 'HEI Registrar',
    fields: [
      'heiReg.firstName',
      'heiReg.middleName',
      'heiReg.lastName',
      'heiReg.suffix',
      'heiReg.email',
      'heiReg.telNum',
    ],
  },
]

export const HEI_ADDRESS_FIELDS = {
  building: 'heiAdd.building',
  street: 'heiAdd.street',
  barangay: 'heiAdd.barangay',
  district: 'heiAdd.district',
  cityMult: 'heiAdd.cityMult',
  province: 'heiAdd.province',
  region: 'heiAdd.region',
} as const

export const HEI_PRESIDENT_FIELDS = {
  firstName: 'heiPres.firstName',
  middleName: 'heiPres.middleName',
  lastName: 'heiPres.lastName',
  suffix: 'heiPres.suffix',
  credential: 'heiPres.credential',
  email: 'heiPres.email',
  telNum: 'heiPres.telNum',
} as const satisfies HeiPersonelFieldPaths

export const HEI_REGISTRAR_FIELDS = {
  firstName: 'heiReg.firstName',
  middleName: 'heiReg.middleName',
  lastName: 'heiReg.lastName',
  suffix: 'heiReg.suffix',
  credential: 'heiReg.credential',
  email: 'heiReg.email',
  telNum: 'heiReg.telNum',
} as const satisfies HeiPersonelFieldPaths

export const heiBaseSchema = z.object({
  heiName: z.string().min(1, 'Required'),
  heiTelNumber: z.string().min(1, 'Required'),
  heiAdd: AddressSchema,
  heiEmail: z.string().email('Invalid Email'),
  heiPres: heiPersonelSchema,
  heiReg: heiPersonelSchema,
  heiOwnership: HeiOwnershipEnum,
  privateOwnerShip: z.string().optional(),
  heiType: HeiTypeEnum,
  heiOther: z.string().optional(),
  startSem: z.string().optional(),
  heiWebsite: z.union([z.literal(''), z.string().trim().url('Invalid URL')]),
})

const addRequiredIssue = (
  ctx: z.RefinementCtx,
  path: string[],
  message = 'Required',
) => {
  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    path,
    message,
  })
}

const applyHeiConditionalRules = (
  data: z.infer<typeof heiBaseSchema>,
  ctx: z.RefinementCtx,
) => {
  if (data.heiOwnership === 'private' && !data.privateOwnerShip?.trim()) {
    addRequiredIssue(ctx, ['privateOwnerShip'])
  }

  if (data.heiOwnership === '') {
    addRequiredIssue(ctx, ['heiOwnership'])
  }

  if (data.heiType === '') {
    addRequiredIssue(ctx, ['heiType'])
  }

  if (data.heiType === 'others' && !data.heiOther?.trim()) {
    addRequiredIssue(ctx, ['heiOther'], 'Please specify')
  }
}

export const heiFormSchema = heiBaseSchema.superRefine(
  (data: z.infer<typeof heiBaseSchema>, ctx) => {
    applyHeiConditionalRules(data, ctx)
  },
)

const deepPartial = (schema: z.ZodTypeAny): z.ZodTypeAny => {
  if (schema instanceof z.ZodObject) {
    const shape = schema.shape
    const nextShape: Record<string, z.ZodTypeAny> = {}
    for (const key of Object.keys(shape)) {
      nextShape[key] = deepPartial(shape[key])
    }
    return z.object(nextShape).partial()
  }
  if (schema instanceof z.ZodArray) {
    return z.array(deepPartial(schema.element as z.ZodTypeAny))
  }
  if (schema instanceof z.ZodOptional) {
    return deepPartial(schema.unwrap() as z.ZodTypeAny).optional()
  }
  if (schema instanceof z.ZodNullable) {
    return deepPartial(schema.unwrap() as z.ZodTypeAny).nullable()
  }
  if (schema instanceof z.ZodDefault) {
    return deepPartial(schema.removeDefault() as z.ZodTypeAny).optional()
  }
  if (schema instanceof z.ZodString) {
    return z.union([z.literal(''), schema]).optional()
  }
  return schema.optional()
}

export const heiFormDraftSchema = deepPartial(heiBaseSchema) as typeof heiBaseSchema

const heiStep1Base = heiBaseSchema.pick({
  heiName: true,
  heiOwnership: true,
  privateOwnerShip: true,
  heiType: true,
  heiOther: true,
  heiTelNumber: true,
  heiEmail: true,
  heiWebsite: true,
})

const heiStep1Schema = heiStep1Base.superRefine(
  (data: z.infer<typeof heiStep1Base>, ctx) => {
    applyHeiConditionalRules(data as z.infer<typeof heiBaseSchema>, ctx)
  },
)

export const HEI_STEP_SCHEMAS = [
  heiStep1Schema,
  z.object({
    heiAdd: AddressSchema,
  }),
  z.object({
    heiPres: heiPersonelSchema,
  }),
  z.object({
    heiReg: heiPersonelSchema,
  }),
]

export type HeiFormData = z.infer<typeof heiFormSchema>

export const heiFormDefaultValues: HeiFormData = {
  heiName: '',
  heiTelNumber: '',
  heiAdd: {
    building: '',
    street: '',
    barangay: '',
    district: '',
    cityMult: '',
    province: '',
    region: '',
  },
  heiEmail: '',
  heiPres: {
    firstName: '',
    lastName: '',
    middleName: '',
    suffix: '',
    credential: [],
    email: '',
    telNum: '',
  },
  heiReg: {
    firstName: '',
    lastName: '',
    middleName: '',
    suffix: '',
    credential: [],
    email: '',
    telNum: '',
  },
  heiOwnership: '',
  privateOwnerShip: '',
  heiType: '',
  heiOther: '',
  startSem: '',
  heiWebsite: '',
}
