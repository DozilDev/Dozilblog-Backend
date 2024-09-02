import db from '@adonisjs/lucid/services/db'
import vine from '@vinejs/vine'
import { FieldContext } from '@vinejs/vine/types'

interface Options {
  table: string
  column: string
}

const unique = async (value: unknown, options: Options, field: FieldContext) => {
  if (typeof value != 'string') {
    return
  }

  const record = await db.from(options.table).where(options.column, value).first()

  if (record) {
    field.report(`The {{field}} -> ${value} is already exist in database`, 'unique', field)
  }
}

export const uniqueRule = vine.createRule(unique)
