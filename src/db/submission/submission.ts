import { boolean, check, date, integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core'
import { relations, sql } from 'drizzle-orm'
import { faculty_submission } from '../FACULTY/faculty_roster'
import { deanAssignment } from '../LAW_SCHOOL_GENERAL_INFO/dean'
import { president_assignment } from '../HEI_GENERAL_INFO/president'
import { registrar_assignment } from '../HEI_GENERAL_INFO/registrar'
import { lawSchool } from '../LAW_SCHOOL_GENERAL_INFO/lawSchool'
import { program_information } from '../PROGRAM_INFORMATION/program'
import { semester } from '../enum'
import { certification } from './certification/certificate'

export const submission = pgTable('submission', {
    submission_id: serial().primaryKey(),
    law_school_id: integer().references(() => lawSchool.law_school_id).notNull(),
    deanAssignment_id: integer().references(() => deanAssignment.assignment_id).notNull(),
    president_assignment_id: integer().references(() => president_assignment.president_assignment_id).notNull(),
    registrar_assignment_id: integer().references(() => registrar_assignment.assignment_id).notNull(),
    school_year: varchar(),
    semester: semester('semester'),
    submitted_at: date(),
    status: varchar(),
    is_draft: boolean().default(true)
},
    (t) => [
        check('submission_info_required_when_not_draft_chk',
            sql`${t.is_draft} = true OR (${t.school_year} IS NOT NULL AND
                ${t.semester} IS NOT NULL AND
                ${t.submitted_at} IS NOT NULL AND
                ${t.status} IS NOT NULL)`
        ),
    ]
);

export const submission_relations = relations(submission, ({ one, many }) => ({
    lawSchool: one(lawSchool, {
        fields: [submission.law_school_id],
        references: [lawSchool.law_school_id],
    }),

    facultySubmissions: many(faculty_submission),
    programInformations: many(program_information),
    certifications: many(certification)
}))

