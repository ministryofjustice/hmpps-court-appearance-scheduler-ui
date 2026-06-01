import { z } from 'zod'
import { Request, Response } from 'express'
import { createSchema } from '../../../../../middleware/validation/validationMiddleware'
import CourtRegisterService from '../../../../../services/apis/courtRegisterService'
import { validateAndTransformCodedDescription } from '../../../../../utils/validations/validateCodedDescription'

export const schemaFactory = (courtRegisterService: CourtRegisterService) => async (_req: Request, res: Response) => {
  const courts = await courtRegisterService.getCourts({ res })

  return createSchema({
    court: z
      .string({ error: 'Enter and select a court location' })
      .transform(validateAndTransformCodedDescription(courts, 'Enter and select a court location')),
  })
}

export type SchemaType = z.infer<Awaited<ReturnType<ReturnType<typeof schemaFactory>>>>
