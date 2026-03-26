import { check, integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core'
import { relations, sql } from 'drizzle-orm'
import { employmentStatus,formStatus, gender } from '../enum'
import { lawSchool } from '../LAW_SCHOOL_GENERAL_INFO/lawSchool'
import { class_schedule } from '../submission/SCHEDULE/block_section'
import {submission} from '../submission/submission'

export const faculty = pgTable('faculty', {
    faculty_id: serial().primaryKey(),
    law_school_id: integer().references(() => lawSchool.law_school_id).notNull(),
    title: varchar(),
    first_name: varchar(),
    middle_name: varchar(),
    last_name: varchar(),
    gender: gender('gender'),
    employment_status: employmentStatus('employment_status'),
    years_teaching: integer(),
    years_professional_experience: integer(),
    roll_number: integer(),
    form_status: formStatus('form_status').default('Draft'),
},
    (t) => [
        check(
            'faculty_info_required_when_not_draft_chk',
            sql`${t.form_status} = 'Draft' OR (${t.first_name} IS NOT NULL AND
                ${t.last_name} IS NOT NULL AND
                ${t.gender} IS NOT NULL AND
                ${t.employment_status} IS NOT NULL AND
                ${t.years_teaching} IS NOT NULL AND
                ${t.years_professional_experience} IS NOT NULL AND
                ${t.roll_number} IS NOT NULL)`
        ),
    ]
);

export const faculty_submission = pgTable('faculty_submission', {
    faculty_submission_id: serial().primaryKey(),
    faculty_id: integer().references(() => faculty.faculty_id, { onDelete: 'cascade' }).notNull(),
    submission_id: integer().references(() => submission.submission_id, { onDelete: 'cascade' }).notNull(),
})

export const faculty_experience = pgTable('faculty_experience', {
    faculty_experience_id: serial().primaryKey(),
    faculty_id: integer().references(() => faculty.faculty_id, { onDelete: 'cascade' }).notNull(),
    experience: varchar(),
    form_status: formStatus('form_status').default('Draft'),
},
    (t) => [
        check(
            'faculty_experience_required_when_not_draft_chk',
            sql`${t.form_status} = 'Draft' OR (${t.experience} IS NOT NULL)`
        ),
    ]
);

export const faculty_teaching_load = pgTable('faculty_teaching_load', {
    faculty_teaching_load_id: serial().primaryKey(),
    faculty_id: integer().references(() => faculty.faculty_id, { onDelete: 'cascade' }).notNull(),
    assigned_subject: varchar(),
    number_units: integer(),
    form_status: formStatus('form_status').default('Draft'),
},
    (t) => [
        check(
            'faculty_teaching_load_required_when_not_draft_chk',
            sql`${t.form_status} = 'Draft' OR (
                ${t.assigned_subject} IS NOT NULL AND 
                ${t.number_units} IS NOT NULL)`
        )
    ]
);

export const faculty_relations = relations(faculty, ({ one, many }) => ({
    lawSchool: one(lawSchool, {
        fields: [faculty.law_school_id],
        references: [lawSchool.law_school_id],
    }),
    facultySubmissions: many(faculty_submission),
    classSchedules: many(class_schedule),
    experiences: many(faculty_experience),
    teachingLoads: many(faculty_teaching_load),
}))

export const faculty_submission_relations = relations(faculty_submission, ({ one }) => ({
    faculty: one(faculty, {
        fields: [faculty_submission.faculty_id],
        references: [faculty.faculty_id],
    }),
    submission: one(submission, {
        fields: [faculty_submission.submission_id],
        references: [submission.submission_id],
    }),
}))

export const faculty_experience_relations = relations(faculty_experience, ({ one }) => ({
    faculty: one(faculty, {
        fields: [faculty_experience.faculty_id],
        references: [faculty.faculty_id],
    }),
}))

export const faculty_teaching_load_relations = relations(faculty_teaching_load, ({ one }) => ({
    faculty: one(faculty, {
        fields: [faculty_teaching_load.faculty_id],
        references: [faculty.faculty_id],
    }),
}))



