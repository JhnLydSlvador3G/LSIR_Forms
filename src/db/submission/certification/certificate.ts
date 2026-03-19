import { check, index, integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core'
import { relations, sql } from 'drizzle-orm'
import { formStatus, month} from '../../enum'
import { submission } from '../submission'

export const certification = pgTable('certification', {
    certification_id: serial().primaryKey(),
    submission_id: integer().references(() => submission.submission_id, { onDelete: 'cascade' }).notNull(),
    certification_year: integer(),
    certification_month: month(),
    form_status: formStatus().default('Draft')
},
    (t) => [check('certification_info_required_when_not_draft_chk',
        sql`${t.form_status} = 'Draft' OR (${t.certification_year} IS NOT NULL AND
                ${t.certification_month} IS NOT NULL)`
    ),
    index('certification_submission_id_idx').on(t.submission_id),
    ]
);

export const presidentAttestation = pgTable('president_attestation', {
    attestation_id: serial().primaryKey(),
    certification_id: integer().references(() => certification.certification_id, { onDelete: 'cascade' }).notNull().unique(),
    printed_name: varchar(),
    id_type: varchar(),
    id_number: varchar(),
    form_status: formStatus().default('Draft')
},
    (t) => [check('president_attestation_info_required_when_not_draft_chk',
        sql`${t.form_status} = 'Draft' OR (${t.printed_name} IS NOT NULL AND
                ${t.id_type} IS NOT NULL AND
                ${t.id_number} IS NOT NULL)`
    ),
    ]
);

export const deanAttestation = pgTable('dean_attestation', {
    attestation_id: serial().primaryKey(),
    certification_id: integer().references(() => certification.certification_id, { onDelete: 'cascade' }).notNull().unique(),
    printed_name: varchar(),
    id_type: varchar(),
    id_number: varchar(),
    form_status: formStatus().default('Draft')
},
    (t) => [check('dean_attestation_info_required_when_not_draft_chk',
        sql`${t.form_status} = 'Draft' OR (${t.printed_name} IS NOT NULL AND
                ${t.id_type} IS NOT NULL AND
                ${t.id_number} IS NOT NULL)`
    ),
    ]
);

export const certification_relations = relations(certification, ({ one }) => ({
    submission: one(submission, {
        fields: [certification.submission_id],
        references: [submission.submission_id],
    }),
}))

export const presidentAttestation_relations = relations(presidentAttestation, ({ one }) => ({
    certification: one(certification, {
        fields: [presidentAttestation.certification_id],
        references: [certification.certification_id],
    }),
}))

export const deanAttestation_relations = relations(deanAttestation, ({ one }) => ({
    certification: one(certification, {
        fields: [deanAttestation.certification_id],
        references: [certification.certification_id],
    }),
}))
