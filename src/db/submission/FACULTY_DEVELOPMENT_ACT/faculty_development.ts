import { check, date, index, integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core'
import { relations, sql } from 'drizzle-orm'
import { formStatus } from '../../enum'
import { program_information } from '@/db/PROGRAM_INFORMATION/program'

export const facultyDevelopment = pgTable('faculty_development', {
    faculty_development_id: serial().primaryKey(),
    program_information_id: integer().references(() => program_information.program_information_id,{onDelete:'cascade'}).notNull(),
    training_title: varchar(),
    training_hours: integer(),
    number_of_participants: integer(),
    competencies_covered: varchar(),
    date_conducted: date(),
    form_status: formStatus().default('Draft'),
},
    (t) => [check('faculty_development_info_required_when_not_draft_chk',
        sql`${t.form_status} = 'Draft' OR (${t.training_title} IS NOT NULL AND
                ${t.training_hours} IS NOT NULL AND
                ${t.number_of_participants} IS NOT NULL AND
                ${t.competencies_covered} IS NOT NULL AND
                ${t.date_conducted} IS NOT NULL)`
    ),
    index('faculty_development_submission_id_idx').on(t.program_information_id),
    ]
);

export const facultyDevelopment_relations = relations(facultyDevelopment, ({ one }) => ({
    program_information: one(program_information, {
        fields: [facultyDevelopment.program_information_id],
        references: [program_information.program_information_id],
    }),
}))


