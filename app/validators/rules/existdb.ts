import db from '@adonisjs/lucid/services/db'
import vine from '@vinejs/vine'
import { FieldContext } from '@vinejs/vine/types'

interface Options {
  table: string
  column: string
}

const isExistInDatabase = async (value: unknown, options: Options, field: FieldContext) => {
  if (typeof value != 'object' || !Array.isArray(value) || value.length === 0) {
    return
  }

  const record = await db
    .from(options.table)
    .whereIn(options.column, (value as unknown as string[]) ?? [])

  if (!record.length) {
    field.report(`The {{field}} -> ${value} is not exist in database`, 'isExistInDatabase', field)
  } else if (record.length < value.length) {
    field.report(
      `The {{field}} -> ${value} contains some not exist in database`,
      'isExistInDatabase',
      field
    )
  }
}

export const isExistInDatabaseRule = vine.createRule(isExistInDatabase)
