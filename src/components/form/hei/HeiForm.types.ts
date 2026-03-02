import { z } from 'zod'
import { AddressSchema } from '../address/AddressForm.type'
import { heiPersonelSchema } from './HeiPersonel.type'

export const HeiOwnershipEnum = z.enum(['private', 'public'])
export type HeiOwnership = z.infer<typeof HeiOwnershipEnum>

export const HeiTypeEnum = z.enum(['university', 'college', 'others'])
export type HeiType = z.infer<typeof HeiTypeEnum>

const baseSchema = z.object({
  heiName: z.string().min(1, 'Required'),
  heiTelNumber: z.string().min(1, 'Required'),
  heiAdd: AddressSchema,
  heiEmail: z.email('Invalid Email'),
  heiPres: heiPersonelSchema,
  heiReg: heiPersonelSchema,
  heiType: HeiTypeEnum,
  heiOther: z.string(),
  startSem: z.string().optional(),
  heiWebsite: z.union([z.literal(''), z.url().trim()]),
})

export const heiFormSchema = z.discriminatedUnion('heiOwnership', [
  baseSchema.extend({
    heiOwnership: z.literal('private'),
    privateOwnerShip: z.string().min(1, 'Required'),
  }),

  baseSchema.extend({
    heiOwnership: z.literal('public'),
    privateOwnerShip: z.string().optional(),
  }),
])

export const heiFormDefaultValues: heiFormData = {
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
  heiOwnership: 'public',
  privateOwnerShip: '',
  heiType: 'university',
  heiOther: '',
  startSem: '',
  heiWebsite: '',
}

export type heiFormData = z.infer<typeof heiFormSchema>

export const heiFormDraftSchema = baseSchema
  .extend({
    heiOwnership: HeiOwnershipEnum.optional(),
    privateOwnerShip: z.string().optional(),
  })
  .partial()
