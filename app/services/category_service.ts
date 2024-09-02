import { DefaultPagination } from '#constants/enum'
import Category from '#models/category'
import { CategoryPayload, CategoryQuery } from '#validators/category'

export default class CategoryServie {
  constructor() {}

  public async getAllCategories(search: CategoryQuery): Promise<Category[]> {
    const page = search.page || DefaultPagination.PAGE
    const limit = search.limit || DefaultPagination.LIMIT

    if (search.name) {
      return await Category.query().where('name', 'ilike', `%${search.name}%`).paginate(page, limit)
    }

    return await Category.query().paginate(page, limit)
  }

  public async getCategoryById(id: number): Promise<Category> {
    return await Category.findByOrFail({ id })
  }

  public async createCategory(payload: CategoryPayload): Promise<Category> {
    return await Category.create(payload)
  }

  public async deleteCategory(id: number): Promise<void> {
    const category = await Category.findByOrFail({ id })
    await category.delete()
    return
  }

  public async updateCategory(id: number, payload: CategoryPayload): Promise<Category> {
    const category = await Category.findByOrFail({ id })
    category.merge(payload)
    await category.save()
    return category
  }
}
