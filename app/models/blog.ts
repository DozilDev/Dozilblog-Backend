import { DateTime } from 'luxon'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import { BaseModel, beforeCreate, belongsTo, column, manyToMany } from '@adonisjs/lucid/orm'
import User from '#models/user'
import Tag from '#models/tag'
import Category from '#models/category'

/**
 * A class representing a Blog model with associated relationships.
 */
export default class Blog extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare title: string

  @column()
  declare content: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column()
  declare authorId: number

  @belongsTo(() => User, { foreignKey: 'authorId' })
  declare author: BelongsTo<typeof User>

  @manyToMany(() => Tag, { pivotTable: 'blogs_tags'})
  declare tags: ManyToMany<typeof Tag>

  @manyToMany(() => Category, { pivotTable: 'blogs_categories'})
  declare categories: ManyToMany<typeof Category>

  @beforeCreate()
  static async hashPassword(blog: Blog) {
    if (!blog.id) {
      blog.id = crypto.randomUUID().toString()
    }
  }
}
