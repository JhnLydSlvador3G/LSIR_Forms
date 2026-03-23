import { check, index, integer, pgTable, serial } from 'drizzle-orm/pg-core'
import { relations, sql } from 'drizzle-orm'
import { formStatus, gender } from '../../enum'
import { program_information } from '@/db/PROGRAM_INFORMATION/program'

export const facultyStatistics = pgTable('faculty_statistics', {
    faculty_statistics_id: serial().primaryKey(),
    program_information_id: integer().references(() => program_information.program_information_id,{onDelete:'cascade'}).notNull(),
    gender: gender(),
    // Highest Law Degree
    basic: integer(),
    master: integer(),
    doctor: integer(),
    // employment status
    regular: integer(),
    part_time: integer(),
    // primary employment/practice of part-time professors
    retired: integer(),
    private: integer(),
    judges: integer(),
    prosecutor: integer(),
    other_government: integer(),
    form_status: formStatus().default('Draft'),
},
    (t) => [check('faculty_statistics_info_required_when_not_draft_chk',
        sql`${t.form_status} = 'Draft' OR (${t.gender} IS NOT NULL AND
                ${t.basic} IS NOT NULL AND
                ${t.master} IS NOT NULL AND
                ${t.doctor} IS NOT NULL AND
                ${t.regular} IS NOT NULL AND
                ${t.part_time} IS NOT NULL AND
                ${t.retired} IS NOT NULL AND
                ${t.private} IS NOT NULL AND
                ${t.judges} IS NOT NULL AND
                ${t.prosecutor} IS NOT NULL AND
                ${t.other_government} IS NOT NULL)`
    ),
    index('faculty_statistics_submission_id_idx').on(t.program_information_id),
    ]
);

export const facultyStatistics_relations = relations(facultyStatistics, ({ one }) => ({
    program_information: one(program_information, {
        fields: [facultyStatistics.program_information_id],
        references: [program_information.program_information_id],
    }),
}))