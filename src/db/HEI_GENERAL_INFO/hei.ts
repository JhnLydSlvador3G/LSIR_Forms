import {
  check,
  date,
  pgTable,
  serial,
  text,
  varchar,
} from 'drizzle-orm/pg-core'
import { relations,sql } from 'drizzle-orm'
import { formStatus, heiType, ownership, privateType,  region } from '../enum'
import {lawSchool} from '../LAW_SCHOOL_GENERAL_INFO/lawSchool'
import { user } from '../accounts'
import { president_assignment } from './president'
import { registrar_assignment } from './registrar'



export const hei_info = pgTable(
  'hei_info',
  {
    hei_id: serial().primaryKey(),
    user_id: text().references(() => user.id).notNull(),
    hei_name: varchar(),
    ownership_type: ownership(),
    hei_type: heiType(),
    private_type: privateType(),
    email: varchar(),
    telephone: varchar(),
    building: varchar(),
    street: varchar(),
    barangay: varchar(),
    district: varchar(),
    city: varchar(),
    province: varchar(),
    region: region('region'),
    website: varchar(),
    created_at: date(),
    form_status: formStatus('form_status').default('Draft'),
    
  },
  (t) => [
    check(
      'address_required_when_not_draft_chk',
      sql`${t.form_status} = 'Draft' OR (
        ${t.hei_name} IS NOT NULL AND
        ${t.ownership_type} IS NOT NULL AND
        ${t.hei_type} IS NOT NULL AND
        ${t.email} IS NOT NULL AND
        ${t.telephone} IS NOT NULL AND
        ${t.building} IS NOT NULL AND
        ${t.street} IS NOT NULL AND
        ${t.barangay} IS NOT NULL AND
        ${t.city} IS NOT NULL AND
        ${t.province} IS NOT NULL AND
        ${t.region} IS NOT NULL
      )`,
    ),
    check(
        'private_type_required_if_private_chk',
        sql`${t.ownership_type} != 'Private' OR ${t.private_type} IS NOT NULL`)
  ],
)

export const hei_info_relations = relations(hei_info, ({ one,many }) => ({
  president_assignment: many(president_assignment),
  registrar_assignments: many(registrar_assignment),
  lawSchools: many(lawSchool),
  user: one(user)
}))

