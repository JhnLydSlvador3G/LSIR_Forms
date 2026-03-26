import { check, index, integer, pgTable, serial } from 'drizzle-orm/pg-core'
import { relations, sql } from 'drizzle-orm'
import { formStatus, programType, yearLevel } from '../../enum'
import {program_information} from '@/db/PROGRAM_INFORMATION/program'


export const enrollment_statistics = pgTable('enrollment_statistics', {
    enrollment_statistics_id: serial().primaryKey(),
    program_information_id: integer().references(() => program_information.program_information_id,{onDelete:'cascade'}).notNull(),
    program_type: programType('program_type'),
    year_level: yearLevel('year_level'),
    male_count: integer(),
    female_count: integer(),
    full_time_count: integer(),
    working_count: integer(),
    scholars_count: integer(),
    transfer_count: integer(),
    form_status: formStatus().default('Draft'),
}, (t) => [
    check(
        'enrollment_statistics_required_when_not_draft_chk',
        sql`${t.form_status} = 'Draft' OR (
            ${t.program_type} IS NOT NULL AND
            ${t.year_level} IS NOT NULL AND
            ${t.male_count} IS NOT NULL AND
            ${t.female_count} IS NOT NULL AND
            ${t.full_time_count} IS NOT NULL AND
            ${t.scholars_count} IS NOT NULL AND
            ${t.working_count} IS NOT NULL AND
            ${t.transfer_count} IS NOT NULL
        )`,
    ),
    index('enrollment_statistics_submission_id_idx').on(t.program_information_id),
]);

export const enrollment_statistics_relations = relations(enrollment_statistics, ({ one }) => ({
    program_information: one(program_information, {
        fields: [enrollment_statistics.program_information_id],
        references: [program_information.submission_id],
    }),
}))

