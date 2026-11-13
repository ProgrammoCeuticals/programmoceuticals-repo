/**
 * Minimal Zod resolver for React Hook Form.
 * Replaces @hookform/resolvers/zod so the app can type-check without that
 * package being installed. Once @hookform/resolvers is installed by pnpm,
 * this file can be removed and the imports swapped to the real package.
 */
import type { ZodSchema, ZodError } from 'zod'
import type { Resolver } from 'react-hook-form'

export function zodResolver<T extends Record<string, unknown>>(
  schema: ZodSchema<T>,
): Resolver<T> {
  return async (values) => {
    const result = await schema.safeParseAsync(values)
    if (result.success) {
      return { values: result.data, errors: {} }
    }
    const zodError = result.error as ZodError
    const errors = zodError.errors.reduce<Record<string, { type: string; message: string }>>(
      (acc, issue) => {
        const key = issue.path.join('.')
        if (!acc[key]) {
          acc[key] = { type: issue.code, message: issue.message }
        }
        return acc
      },
      {},
    )
    return { values: {}, errors } as ReturnType<Resolver<T>>
  }
}
