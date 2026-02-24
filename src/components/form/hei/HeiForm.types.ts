import { z } from 'zod'
import { AddressSchema } from '../address/AddressForm.type'
import { heiPersonelSchema } from './HeiPersonel.type'

export const heiFormSchema = z
  .object({
    heiName: z.string().nonempty('Required'),
    heiTelNumber: z.string().nonempty('Required'),
    heiAdd: AddressSchema,
    heiEmail: z.email('Invalid Email'),
    heiPres: heiPersonelSchema,
    heiReg: heiPersonelSchema,
    heiOwnership: z.string().nonempty('Required'),
    privateOwnerShip: z.string().optional(),
    heiType: z.string().nonempty('Required'),
    heiOther: z.string(),
    startSem: z.string().optional(),
    heiWebsite: z.union([z.literal(''), z.url().trim()]),
  })
  .superRefine((data, ctx) => {
    if (data.heiOwnership === 'private' && data.privateOwnerShip === '') {
      ctx.addIssue({
        code: 'custom',
        path: ['privateOwnerShip'], // points to the nested field
        message: 'Required',
      })
    }
  })

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
    credential: [], // empty array
    email: '',
    telNum: '', // optional, but you can initialize as empty if you prefer
  },
  heiReg: {
    firstName: '',
    lastName: '',
    middleName: '',
    suffix: '',
    credential: [], // empty array
    email: '',
    telNum: '', // optional
  },
  heiOwnership: '', // e.g. "Private" or "Public"
  privateOwnerShip: '', // optional but include if you want
  heiType: '',
  heiOther: '',
  startSem: '', // optional
  heiWebsite: '', // optional
}

export type heiFormData = z.infer<typeof heiFormSchema>
