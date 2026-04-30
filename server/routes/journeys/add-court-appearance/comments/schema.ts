import { z } from 'zod'
import { createSchema } from '../../../../middleware/validation/validationMiddleware'
import { optionalString } from '../../../../utils/validations/validateString'

const ERROR_MSG = 'The maximum character limit is 4000'

export const schema = createSchema({
  comments: optionalString({ maxChar: { count: 4000, errorMessage: ERROR_MSG } }),
})

export type SchemaType = z.infer<typeof schema>
