import { z } from 'zod'
import { Request, Response } from 'express'
import { createSchema } from '../../../../../middleware/validation/validationMiddleware'
import { validateAndTransformCodedDescription } from '../../../../../utils/validations/validateCodedDescription'
import CourtAppearanceSchedulerService from '../../../../../services/apis/courtAppearanceSchedulerService'

export const schemaFactory =
  (courtAppearanceSchedulerService: CourtAppearanceSchedulerService) => async (_req: Request, res: Response) => {
    const reasons = await courtAppearanceSchedulerService.getReasons({ res })

    return createSchema({
      reason: z
        .string({ error: 'Enter and select a reason' })
        .transform(validateAndTransformCodedDescription(reasons, 'Enter and select a reason')),
    })
  }

export type SchemaType = z.infer<Awaited<ReturnType<ReturnType<typeof schemaFactory>>>>
