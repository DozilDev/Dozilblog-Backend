import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'
import { uniqueRule } from '#validators/rules/unique'

export const CategorySchema = vine.object({
  name: vine
    .string()
    .minLength(3)
    .maxLength(50)
    .use(uniqueRule({ table: 'categories', column: 'name' })),
})

export const CategoryQuerySchema = vine.object({
  name: vine.string().optional(),
  limit: vine.number().positive().min(1).optional(),
  page: vine.number().positive().min(1).optional(),
})

export const CategoryValidator = vine.compile(CategorySchema)

export const CategorySearchParamsValidator = vine.compile(CategoryQuerySchema)

export type CategoryPayload = Infer<typeof CategorySchema>

export type CategoryQuery = Infer<typeof CategoryQuerySchema>
