import { z } from 'zod'

export const AddressSchema = z.object({
  building: z.string().trim().optional(),
  street: z.string().trim().nonempty('Required'),
  barangay: z.string().trim().nonempty('Required'),
  district: z.string().trim().optional(),
  cityMult: z.string().trim().nonempty('Required'),
  province: z.string().trim().nonempty('Required'),
  region: z.string().trim().nonempty('Required'),
})

export type AddressData = z.infer<typeof AddressSchema>

export const AddressDefaultValues: AddressData = {
  building: '',
  street: '',
  barangay: '',
  district: '',
  cityMult: '',
  province: '',
  region: '',
}
