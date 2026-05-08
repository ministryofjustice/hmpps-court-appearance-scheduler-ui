import { z } from 'zod'
import { createSchema } from '../../middleware/validation/validationMiddleware'
import { validateTransformOptionalDate } from '../../utils/validations/validateDatePicker'

const typeEnum = z.enum(['IN_PERSON', 'VIDEO_LINK'])

export const schema = createSchema({
  start: validateTransformOptionalDate('Enter or select a valid date from'),
  end: validateTransformOptionalDate('Enter or select a valid date to'),
  court: z.string().optional(),
  reason: z.string().optional(),
  type: z.union([typeEnum.transform(val => [val]), z.array(typeEnum)]).optional(),
  sort: z.string().optional(),
  page: z
    .string()
    .optional()
    .transform(val => {
      if (!val) return 1
      const num = Number(val)
      if (!Number.isNaN(num)) return num
      return 1
    }),
})

type SchemaType = z.infer<typeof schema>
export type ResQuerySchemaType = SchemaType & { validated?: SchemaType }
