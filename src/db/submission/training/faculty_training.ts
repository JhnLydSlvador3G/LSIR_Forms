import { boolean, check, index, integer, pgTable, serial } from 'drizzle-orm/pg-core'
import { relations, sql } from 'drizzle-orm'
import { month} from '../../enum'
import { submission } from '../submission'
import { program_information } from '@/db/PROGRAM_INFORMATION/program'

export const facultyTraining = pgTable('faculty_training', {
    training_id: serial().primaryKey(),
    program_information_id: integer().references(() => program_information.program_information_id,{onDelete:'cascade'}).notNull(),
    training_year: integer(),
    training_month: month(),
    is_draft: boolean().notNull().default(true)
},
    (t) => [check('faculty_training_info_required_when_not_draft_chk',
        sql`${t.is_draft} = true OR (${t.training_year} IS NOT NULL AND
                ${t.training_month} IS NOT NULL)`
            ),
            index('faculty_training_submission_id_idx').on(t.program_information_id),
    ]
);

export const facultyTraining_relations = relations(facultyTraining, ({ one }) => ({
    program_information: one(program_information, {
        fields: [facultyTraining.program_information_id],
        references: [program_information.program_information_id],
    }),
}))

