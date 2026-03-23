import { check, index, integer, pgTable, serial } from 'drizzle-orm/pg-core'
import { relations, sql } from 'drizzle-orm'
import {
    curricularSchedule,
    days,
    doctorateProgramClassification,
    formStatus,
    lawProgramClassification,
    month
    
} from '../enum'
import { lawSchool } from '../LAW_SCHOOL_GENERAL_INFO/lawSchool'
import { submission } from '../submission/submission'

import { graduate_studies_duration, juris_doctor_duration} from './program_duration'
import { curriculum } from './curriculum'

export const program_information = pgTable('program_information', {
    program_information_id: serial().primaryKey(),
    law_school_id: integer().references(() => lawSchool.law_school_id).notNull(),
    submission_id: integer().references(() => submission.submission_id,{onDelete:'cascade'}).notNull(),
    program_classification: lawProgramClassification(),
    doctorate_classification: doctorateProgramClassification(),
    curricular_schedule: curricularSchedule(),
    operating_schedule: days().array(),
    form_status: formStatus('form_status').default('Draft'),
},
    (t) => [
        check('program_information_required_when_not_draft_chk',
            sql`${t.form_status} = 'Draft' OR 
                (${t.curricular_schedule} IS NOT NULL AND
                ${t.operating_schedule} IS NOT NULL AND
                ${t.program_classification} IS NOT NULL)`  
        ),
        index('program_information_submission_id_idx').on(t.submission_id),
    ]
)

export const academic_calendar = pgTable('academic_calendar', {
    academic_calendare_id: serial().primaryKey(),
    program_information_id: integer().references(() => program_information.program_information_id,{onDelete:'cascade'}).notNull().unique(),
    starting_month: month(),
    ending_month: month(),
    form_status: formStatus('form_status').default('Draft'),
},
    (t) => [
        check('academic_calendar_required_when_not_draft_chk',
            sql`${t.form_status} = 'Draft' OR (${t.starting_month} IS NOT NULL AND
                ${t.ending_month} IS NOT NULL)`
        ),
    ]
)

export const program_information_relations = relations(program_information, ({ one }) => ({
    lawSchool: one(lawSchool, {
        fields: [program_information.law_school_id],
        references: [lawSchool.law_school_id],
    }),
    submission: one(submission, {
        fields: [program_information.submission_id],
        references: [submission.submission_id],
    }),
    academicCalendar: one(academic_calendar),
    jurisDoctorDuration: one(juris_doctor_duration),
    graduateStudiesDuration: one(graduate_studies_duration),
    curriculum: one(curriculum),
}))

export const academic_calendar_relations = relations(academic_calendar, ({ one }) => ({
    programInformation: one(program_information, {
        fields: [academic_calendar.program_information_id],
        references: [program_information.program_information_id],
    }),
}))

