import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'
import { isExistInDatabaseRule } from './rules/existdb.js'

export const BlogSchema = vine.object({
  title: vine.string().minLength(3).maxLength(100),
  content: vine.string().minLength(10).maxLength(1000),
  authorId: vine.number().positive().optional(),
  categories: vine
    .array(vine.number())
    .minLength(0)
    .maxLength(10)
    .use(isExistInDatabaseRule({ table: 'categories', column: 'id' })),
  tags: vine
    .array(vine.number())
    .minLength(0)
    .maxLength(10)
    .use(isExistInDatabaseRule({ table: 'tags', column: 'id' })),
})

export const BlogSearchSchema = vine.object({
  id: vine.string().uuid().optional(),
  title: vine.string().optional(),
  content: vine.string().optional(),
  authorId: vine.number().optional(),
  categories: vine.array(vine.number()).optional(),
  tags: vine.array(vine.number()).optional(),
  limit: vine.number().positive().min(1).max(100).optional(),
  page: vine.number().positive().min(1).optional(),
})

export const BlogValidator = vine.compile(BlogSchema)

export const BlogSearchValidator = vine.compile(BlogSearchSchema)

export type BlogPayload = Infer<typeof BlogSchema>

export type BlogSearch = Infer<typeof BlogSearchSchema>
