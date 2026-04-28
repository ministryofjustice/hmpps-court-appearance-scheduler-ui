import { z } from 'zod'
import { Request, Response } from 'express'
import { validateAndTransformCodedDescription } from '../../../../utils/validations/validateCodedDescription'
import { createSchema } from '../../../../middleware/validation/validationMiddleware'
import CourtAppearanceSchedulerService from '../../../../services/apis/courtAppearanceSchedulerService'
import CourtRegisterService from '../../../../services/apis/courtRegisterService'

export const schemaFactory =
  (courtAppearanceSchedulerService: CourtAppearanceSchedulerService, courtRegisterService: CourtRegisterService) =>
  async (_req: Request, res: Response) => {
    const courts = await courtRegisterService.getCourts({ res })
    const reasons = await courtAppearanceSchedulerService.getReasons({ res })

    return createSchema({
      court: z
        .string({ error: 'Enter and select a court location' })
        .transform(validateAndTransformCodedDescription(courts, 'Enter and select a court location')),
      reason: z
        .string({ error: 'Enter and select a reason' })
        .transform(validateAndTransformCodedDescription(reasons, 'Enter and select a reason')),
    })
  }

export type SchemaType = z.infer<Awaited<ReturnType<ReturnType<typeof schemaFactory>>>>
