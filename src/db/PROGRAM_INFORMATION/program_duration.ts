import { integer, pgTable, serial } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import {
    formStatus,
    graduateStudiesDuration,
    jurisDoctorDuration,
} from '../enum'

import { program_information } from './program'

export const juris_doctor_duration = pgTable('juris_doctor_duration', {
    juris_doctor_duration_id: serial().primaryKey(),
    program_information_id: integer().references(() => program_information.program_information_id,{onDelete:'cascade'}).notNull(),
    duration: jurisDoctorDuration(),
    form_status: formStatus('form_status').default('Draft'),
})

export const graduate_studies_duration = pgTable('graduate_studies_duration', {
    graduate_studies_duration_id: serial().primaryKey(),
    program_information_id: integer().references(() => program_information.program_information_id,{onDelete:'cascade'}).notNull(),
    duration: graduateStudiesDuration(),
    form_status: formStatus('form_status').default('Draft'),
})

export const juris_doctor_duration_relations = relations(juris_doctor_duration, ({ one }) => ({
    programInformation: one(program_information, {
        fields: [juris_doctor_duration.program_information_id],
        references: [program_information.program_information_id],
    }),
}))

export const graduate_studies_duration_relations = relations(graduate_studies_duration, ({ one }) => ({
    programInformation: one(program_information, {
        fields: [graduate_studies_duration.program_information_id],
        references: [program_information.program_information_id],
    }),
}))
