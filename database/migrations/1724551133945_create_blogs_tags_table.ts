import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'blogs_tags'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid('blog_id').unsigned().references('blogs.id')
      table.integer('tag_id').unsigned().references('tags.id')
      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.unique(['blog_id', 'tag_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
