import z from 'zod'

export type HeiPersonelFieldPaths = {
  firstName: string
  middleName: string
  lastName: string
  suffix: string
  credential: string
  email: string
  telNum: string
}

export const heiPersonelSchema = z.object({
  firstName: z.string().nonempty('Required'),
  lastName: z.string().nonempty('Required'),
  middleName: z.string().optional(),
  suffix: z.string(),
  credential: z.array(z.string()).optional(),
  email: z.string().email('Invalid Email'),
  telNum: z
    .string()
    .trim()
    .nonempty('Required')
    .regex(/^(09|\+639)\d{9}$/, 'Invalid Number'),
})

export type heiPersonelData = z.infer<typeof heiPersonelSchema>

export const heiPersonelDefaulVal: heiPersonelData = {
  firstName: '',
  lastName: '',
  middleName: '',
  suffix: '',
  credential: [],
  email: '',
  telNum: '',
}
