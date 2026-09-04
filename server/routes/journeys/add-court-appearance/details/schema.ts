import { z } from 'zod'
import { Request, Response } from 'express'
import { $ZodSuperRefineIssue } from 'zod/v4/core'
import { validateAndTransformOptionalCodedDescription } from '../../../../utils/validations/validateCodedDescription'
import { createSchema } from '../../../../middleware/validation/validationMiddleware'
import CourtAppearanceSchedulerService from '../../../../services/apis/courtAppearanceSchedulerService'
import CourtRegisterService from '../../../../services/apis/courtRegisterService'
import { checkTodayOrFuture, validateTransformDate } from '../../../../utils/validations/validateDatePicker'
import { parseHour, parseMinute } from '../../../../utils/validations/validateTime'

export const schemaFactory =
  (courtAppearanceSchedulerService: CourtAppearanceSchedulerService, courtRegisterService: CourtRegisterService) =>
  async (_req: Request, res: Response) => {
    const courts = await courtRegisterService.getCourts({ res })
    const reasons = await courtAppearanceSchedulerService.getReasons({ res })

    return createSchema({
      startDate: z.string().optional(),
      startTimeHour: z.string().optional(),
      startTimeMinute: z.string().optional(),
      court: z
        .string()
        .optional()
        .transform(validateAndTransformOptionalCodedDescription(courts, 'Enter and select a court location')),
      reason: z
        .string()
        .optional()
        .transform(validateAndTransformOptionalCodedDescription(reasons, 'Enter and select a reason')),
    }).transform(({ startDate, startTimeHour, startTimeMinute, court, reason }, ctx) => {
      if (!court) {
        ctx.addIssue({ code: 'custom', message: 'Enter and select a court location', path: ['court'] })
      }
      if (!reason) {
        ctx.addIssue({ code: 'custom', message: 'Enter and select a reason', path: ['reason'] })
      }

      const parsedStartDate = validateTransformDate(
        checkTodayOrFuture,
        'Enter or select a date',
        'Enter or select a valid date',
        'Court appearance date must be today or in the future',
      ).safeParse(startDate)

      parsedStartDate.error?.issues?.forEach(issue =>
        ctx.addIssue({ ...issue, path: ['startDate'] } as $ZodSuperRefineIssue),
      )

      const parsedHour = startTimeHour?.length ? parseHour(startTimeHour) : undefined
      const parsedMinute = startTimeMinute?.length ? parseMinute(startTimeMinute) : undefined

      if (!startTimeHour?.length) {
        ctx.addIssue({
          code: 'custom',
          message: 'Enter a time',
          path: ['startTimeHour'],
        })
        if (!startTimeMinute?.length) {
          // empty error message to highlight both input fields with error
          ctx.addIssue({ code: 'custom', message: '', path: ['startTime'] })
        }
      } else if (!startTimeMinute?.length) {
        ctx.addIssue({
          code: 'custom',
          message: 'Enter a time',
          path: ['startTimeMinute'],
        })
      }

      if (parsedHour?.error) {
        ctx.addIssue({
          code: 'custom',
          message: 'Hour must be between 00 and 23',
          path: ['startTimeHour'],
        })
      }
      if (parsedMinute?.error) {
        ctx.addIssue({
          code: 'custom',
          message: 'Minute must be between 00 and 59',
          path: ['startTimeMinute'],
        })
      }

      if (parsedHour?.success && parsedMinute?.success && `${parsedHour.data}:${parsedMinute.data}` >= '17:00') {
        ctx.addIssue({
          code: 'custom',
          message: 'Start time must be before 17:00',
          path: ['startTimeHour'],
        })
        // empty error message to highlight both input fields with error
        ctx.addIssue({ code: 'custom', message: '', path: ['startTime'] })
        return z.NEVER
      }

      if (parsedStartDate?.success && parsedHour?.success && parsedMinute?.success && court && reason) {
        return {
          startDate: parsedStartDate.data,
          startTimeHour: parsedHour.data,
          startTimeMinute: parsedMinute.data,
          court,
          reason,
        }
      }

      return z.NEVER
    })
  }

export type SchemaType = z.infer<Awaited<ReturnType<ReturnType<typeof schemaFactory>>>>
