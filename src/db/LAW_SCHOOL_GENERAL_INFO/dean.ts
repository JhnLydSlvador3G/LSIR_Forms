import { check,date, integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core'
import { relations, sql } from 'drizzle-orm'
import {formStatus, highestAcademicDegree} from '../enum'
import { lawSchool } from '../LAW_SCHOOL_GENERAL_INFO/lawSchool'

export const dean = pgTable('dean', {
    dean_id: serial().primaryKey(),
    title: varchar(),
    first_name: varchar(),
    middle_name: varchar(),
    last_name: varchar(),
    mobile_number: varchar(),
    date_appointed: varchar(),  
    email_address: varchar(),
    highest_legal_educational_attainment: highestAcademicDegree(),
    roll_number: varchar(),
    year_teaching_experience: integer(),
    year_admin_experience: integer(),
    form_status: formStatus('form_status').default('Draft'),
},
    (t) => [
        check(
            'dean_info_required_when_not_draft_chk',
            sql`${t.form_status} = 'Draft' OR (${t.first_name} IS NOT NULL AND
                ${t.last_name} IS NOT NULL AND
                ${t.mobile_number} IS NOT NULL AND
                ${t.date_appointed} IS NOT NULL AND
                ${t.email_address} IS NOT NULL AND
                ${t.highest_legal_educational_attainment} IS NOT NULL AND
                ${t.year_admin_experience} IS NOT NULL AND
                ${t.roll_number} IS NOT NULL AND
                ${t.year_teaching_experience} IS NOT NULL                              
                )`
        ),
    ]
)

export const deanAssignment = pgTable('dean_assignment', {
    assignment_id: serial().primaryKey(),
    dean_id: integer().references(() => dean.dean_id),
    law_school_id: integer().references(() => lawSchool.law_school_id),
    start_date: date(),
    end_date: date(),
    form_status: formStatus('form_status').default('Draft'),
},
    (t) => [
        check(
            'dean_assignment_info_required_when_not_draft_chk',
            sql`${t.form_status} = 'Draft' OR (${t.dean_id} IS NOT NULL AND
                ${t.law_school_id} IS NOT NULL AND
                ${t.start_date} IS NOT NULL AND
                ${t.end_date} IS NOT NULL)`
        ),
    ]
)

export const dean_relations = relations(dean, ({ many }) => ({
    assignments: many(deanAssignment),
}))

export const deanAssignment_relations = relations(deanAssignment, ({ one }) => ({
    dean: one(dean, {
        fields: [deanAssignment.dean_id],
        references: [dean.dean_id],
    }),
    lawSchool: one(lawSchool, {
        fields: [deanAssignment.law_school_id],
        references: [lawSchool.law_school_id],
    }),
}))
