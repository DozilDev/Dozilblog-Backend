import { DefaultPagination } from '#constants/enum'
import Tag from '#models/tag'

export default class TagService {
  constructor() {}

  public async getAllTags(search: any): Promise<Tag[]> {
    const page = search.page || DefaultPagination.PAGE
    const limit = search.limit || DefaultPagination.LIMIT

    if (search) {
      return await Tag.query()
        .where('name', 'ilike', `%${search.name}%`)
        .orWhere('color', 'like', `%${search.color}%`)
        .paginate(page, limit)
    }

    return await Tag.query().paginate(page, limit)
  }

  public async getTagById(id: number): Promise<Tag> {
    return await Tag.findByOrFail({ id })
  }

  public async createTag(name: string, color: string): Promise<Tag> {
    return await Tag.create({ name, color })
  }

  public async deleteTag(id: number): Promise<void> {
    const tag = await Tag.findByOrFail({ id })
    await tag.delete()
    return
  }

  public async updateTag(id: number, name: string, color: string): Promise<Tag> {
    const tag = await Tag.findByOrFail({ id })
    tag.name = name
    tag.color = color
    await tag.save()
    return tag
  }
}
