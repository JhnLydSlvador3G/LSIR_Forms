import { check, date, index, integer, pgTable, serial } from 'drizzle-orm/pg-core'
import { relations, sql } from 'drizzle-orm'
import { BasicyearLevel, formStatus, semester} from '../enum'
import { program_information } from './program'

export const curriculum = pgTable('curriculum', {
  curriculum_id: serial().primaryKey(),
  program_information_id: integer().references(() => program_information.program_information_id,{onDelete:'cascade'}).notNull().unique(),
  leb_approval_date: date(),
  form_status: formStatus().default('Draft')
}, 
    (t)=>[check('curriculum_info_required_when_not_draft_chk',
            sql`${t.form_status} = 'Draft' OR (${t.leb_approval_date} IS NOT NULL)`
        ),
        index('curriculum_submission_id_idx').on(t.program_information_id),
    ]
);

export const academic_load = pgTable('academic_load',{
    academic_load_id: serial().primaryKey(),
    curriculum_id: integer().references(()=> curriculum.curriculum_id, {onDelete:'cascade'}).notNull(),
    year_level: BasicyearLevel(),
    total_units: integer(),
    semester: semester(),
    form_status: formStatus().default('Draft')
},
    (t)=>[check('academic_load_info_required_when_not_draft_chk',
            sql`${t.form_status} = 'Draft' OR (${t.year_level} IS NOT NULL AND
                ${t.total_units} IS NOT NULL AND
                ${t.semester} IS NOT NULL)`
        ),
    ]
)

export const curriculum_relations = relations(curriculum, ({ one, many }) => ({
    program_information: one(program_information, {
        fields: [curriculum.program_information_id],
        references: [program_information.program_information_id],
    }),
    academicLoads: many(academic_load),
}))

export const academic_load_relations = relations(academic_load, ({ one }) => ({
    curriculum: one(curriculum, {
        fields: [academic_load.curriculum_id],
        references: [curriculum.curriculum_id],
    }),
}))
