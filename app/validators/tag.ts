import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'
import { uniqueRule } from '#validators/rules/unique'

export const TagSchema = vine.object({
  name: vine
    .string()
    .minLength(3)
    .maxLength(50)
    .use(uniqueRule({ table: 'tags', column: 'name' })),
  color: vine
    .string()
    .minLength(7)
    .maxLength(7)
    .regex(/^#[0-9A-F]{6}$/),
})

export const TagsQuerySchema = vine.object({
  name: vine.string().optional(),
  color: vine.string().optional(),
  limit: vine.number().positive().min(1).optional(),
  page: vine.number().positive().min(1).optional(),
})

export const TagValidator = vine.compile(TagSchema)

export const TagsSearchParamsValidator = vine.compile(TagsQuerySchema)

export type TagPayload = Infer<typeof TagSchema>

export type TagQuery = Infer<typeof TagsQuerySchema>
