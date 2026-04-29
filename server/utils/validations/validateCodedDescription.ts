import { RefinementCtx, z } from 'zod'
import { CodedDescription } from '../../@types/journeys'

export const validateAndTransformCodedDescription =
  (refData: CodedDescription[], errorMessage: string) => (val: string, ctx: RefinementCtx) => {
    const result = refData.find(({ code }) => code === val)
    if (!result) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: errorMessage,
      })
      return z.NEVER
    }
    return result
  }
