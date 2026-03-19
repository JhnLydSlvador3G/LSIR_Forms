import { check,date, integer, pgTable, serial, text, varchar } from 'drizzle-orm/pg-core'
import { relations, sql } from 'drizzle-orm'
import { formStatus } from '../enum'
import { user } from '../accounts'

export const registrar = pgTable('registrar', {
    registrar_id: serial().primaryKey(),
    title: varchar(),
    first_name: varchar(),
    middle_name: varchar(),
    last_name: varchar(),
    telephone_number: varchar(),
    form_status: formStatus('form_status').default('Draft'),
},
    (t) => [
        check(
            'registrar_info_required_when_not_draft_chk',
            sql`${t.form_status} = 'Draft' OR (${t.first_name} IS NOT NULL AND
                ${t.last_name} IS NOT NULL AND
                ${t.telephone_number} IS NOT NULL)`
        ),
    ]
)

export const registrar_relations = relations(registrar, ({ many }) => ({
  assignments: many(registrar_assignment)
}));

export const registrar_assignment = pgTable('registrar_assignment', {
    assignment_id: serial().primaryKey(),
    registrar_id: integer().references(() => registrar.registrar_id).notNull(),
    user_id: text().references(() => user.id).notNull(),
    start_date: date(),
    end_date: date(),
    form_status: formStatus('form_status').default('Draft'),
},
    (t) => [
        check(
            'registrar_assignment_info_required_when_not_draft_chk',
            sql`${t.form_status} = 'Draft' OR (${t.start_date} IS NOT NULL AND
                ${t.end_date} IS NOT NULL)`
        ),
    ]
)

export const registrar_assignment_relations = relations(registrar_assignment, ({ one }) => ({
    user: one(user, {
        fields: [registrar_assignment.user_id],
        references: [user.id]
    }),
    registrar: one(registrar, {
        fields: [registrar_assignment.registrar_id],
        references: [registrar.registrar_id]
    })
}));
