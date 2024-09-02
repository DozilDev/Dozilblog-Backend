import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'

export const UserSchema = vine.object({
  fullName: vine.string().minLength(3).maxLength(100),
  email: vine.string().email(),
  password: vine
    .string()
    .minLength(8)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
  isAdmin: vine.boolean().optional(),
})

export const UserSearchSchema = vine.object({
  fullName: vine.string().optional(),
  email: vine.string().optional(),
  isAdmin: vine.boolean().optional(),
  page: vine.number().optional(),
  limit: vine.number().optional(),
  fetchBlogs: vine.boolean().optional(),
})

export const UserValidator = vine.compile(UserSchema)

export const UserSearchParamsValidator = vine.compile(UserSearchSchema)

export type UserPayload = Infer<typeof UserSchema>

export type UserSearch = Infer<typeof UserSearchSchema>
