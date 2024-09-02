import TagService from '#services/tag_service'
import type { HttpContext } from '@adonisjs/core/http'
import { TagValidator, TagsSearchParamsValidator } from '#validators/tag'

export default class TagsController {
  service: TagService
  payloadValidator: typeof TagValidator
  searchValidator: typeof TagsSearchParamsValidator

  constructor() {
    this.service = new TagService()
    this.payloadValidator = TagValidator
    this.searchValidator = TagsSearchParamsValidator
  }

  /**
   * @list
   * @summary List all tags
   * @paramQuery name - name of tag - @type(string)
   * @paramQuery color - color of tag - @type(string)
   * @paramQuery page - page number - @type(number)
   * @paramQuery limit - limit of tags per page - @type(number)
   * @responseBody 200 - <Tag[]>.paginated()
   *
   */
  public async list({ request, response }: HttpContext) {
    const search = await request.validateUsing(this.searchValidator)
    const tags = await this.service.getAllTags(search)
    return response.status(200).json(tags)
  }

  /**
   * @retrieve
   * @summary Retrieve a single tag
   * @responseBody 200 - <Tag>
   */
  public async retrieve({ params, response }: HttpContext) {
    const { id } = params
    const tag = await this.service.getTagById(id)
    return response.status(200).json(tag)
  }

  /**
   * @create
   * @summary Create a new tag
   * @requestBody { "name": "New Tag", "color": "#FF0000"  }
   * @responseBody 201 - <Tag>
   */
  public async create({ request, response }: HttpContext) {
    const payload = await request.validateUsing(this.payloadValidator)
    const tag = await this.service.createTag(payload.name, payload.color)
    return response.status(201).json(tag)
  }

  /**
   * @update
   * @summary Update a tag by id
   * @requestBody {"name": "New Name Tag", "color": "#00FF00"  }
   * @responseBody 200 - <Tag>
   */
  public async update({ request, response }: HttpContext) {
    const { id } = request.params()
    const payload = await request.validateUsing(this.payloadValidator)
    const tag = await this.service.updateTag(id, payload.name, payload.color)
    return response.status(200).json(tag)
  }

  /**
   * @delete
   * @summary Delete a tag by id
   * @responseBody 204 - No Content
   */
  public async delete({ request, response }: HttpContext) {
    const { id } = request.params()
    this.service.deleteTag(id)
    return response.status(204)
  }
}
