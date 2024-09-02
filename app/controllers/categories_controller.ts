import type { HttpContext } from '@adonisjs/core/http'
import CategoryServie from '#services/category_service'
import { CategorySearchParamsValidator, CategoryValidator } from '#validators/category'

export default class CategoriesController {
  service: CategoryServie
  payloadValidator: typeof CategoryValidator
  searchValidator: typeof CategorySearchParamsValidator

  constructor() {
    this.service = new CategoryServie()
    this.payloadValidator = CategoryValidator
    this.searchValidator = CategorySearchParamsValidator
  }

  /**
   * @list
   * @summary List all categories
   * @paramQuery name - name of category - @type(string)
   * @paramQuery page - page number - @type(number)
   * @paramQuery limit - limit of categories per page - @type(number)
   * @responseBody 200 - <Category[]>.paginated()
   *
   */
  public async list({ request, response }: HttpContext) {
    const search = await request.validateUsing(this.searchValidator)
    const catagories = await this.service.getAllCategories(search)
    return response.status(200).json(catagories)
  }

  /**
   * @retrieve
   * @summary Retrieve a single category
   * @responseBody 200 - <Category>
   */
  public async retrieve({ params, response }: HttpContext) {
    const { id } = params
    const category = await this.service.getCategoryById(id)
    return response.status(200).json(category)
  }

  /**
   * @create
   * @summary Create a new category
   * @requestBody {"name": "New Category"}
   * @responseBody 201 - <Category>
   */
  public async create({ request, response }: HttpContext) {
    const payload = await request.validateUsing(this.payloadValidator)
    const category = await this.service.createCategory(payload)
    return response.status(201).json(category)
  }

  /**
   * @delete
   * @summary Delete a category by id
   * @responseBody 200 - No Content
   */
  public async delete({ request, response }: HttpContext) {
    const { id } = request.params()
    this.service.deleteCategory(id)
    return response.status(200)
  }

  /**
   * @update
   * @summary Update a category by id
   * @requestBody {"name": "New Name Category"}
   * @responseBody 204 - <Category>
   */
  public async update({ request, response }: HttpContext) {
    const { id } = request.params()
    const payload = await request.validateUsing(this.payloadValidator)
    const category = await this.service.updateCategory(id, payload)
    return response.status(204).json(category)
  }
}
