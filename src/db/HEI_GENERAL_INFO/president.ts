import {
  check,
  date,
  integer,
  pgTable,
  serial,
  text,
  varchar,

} from 'drizzle-orm/pg-core'
import { relations,sql } from 'drizzle-orm'
import { formStatus } from '../enum'
import {user} from '../accounts'


export const president = pgTable(
  'president',
  {
    president_id: serial().primaryKey(),
    title: varchar(),
    first_name: varchar(),
    middle_name: varchar(),
    last_name: varchar(),
    telephone_number: varchar(),
    form_status: formStatus('form_status').default('Draft'),
  },
  (t) => [
    check(
      'president_info_required_when_not_draft_chk',
      sql`${t.form_status} = 'Draft' OR (${t.first_name} IS NOT NULL AND
        ${t.last_name} IS NOT NULL AND
        ${t.telephone_number} IS NOT NULL)`,
    ),
  ],
)

export const president_assignment = pgTable('president_assignment',
  {
    president_assignment_id: serial().primaryKey(),
    president_id: integer().references(() => president.president_id).notNull(),
    user_id: text().references(() => user.id).notNull(),
    start_date: date(),
    end_date: date(),
    form_status: formStatus('form_status').default('Draft')
  }
)

export const president_assignment_relations = relations(president_assignment, ({ one }) => ({
  president: one(president, {
    fields: [president_assignment.president_id],
    references: [president.president_id],
  }),
  user: one(user, {
    fields: [president_assignment.user_id],
    references: [user.id],
  }),
}));

export const president_relations = relations(president, ({many}) => ({
  president_assignments: many(president_assignment)
}))
