import type { HttpContext } from '@adonisjs/core/http'

import BlogService from '#services/blog_service'
import { BlogSearchValidator, BlogValidator } from '#validators/blog'

export default class BlogController {
  service: BlogService
  payloadValidator: typeof BlogValidator
  searchValidator: typeof BlogSearchValidator

  constructor() {
    this.service = new BlogService()
    this.payloadValidator = BlogValidator
    this.searchValidator = BlogSearchValidator
  }

  /**
   * @list
   * @summary List all blogs
   * @paramQuery title - title of blog - @type(string)
   * @paramQuery content - content of blog - @type(string)
   * @paramQuery authorId - author id of blog - @type(number)
   * @paramQuery categories - category id of blog - @type(array)
   * @paramQuery tags - tag id of blog - @type(array)
   * @paramQuery page - page number - @type(number)
   * @paramQuery limit - limit of blogs per page - @type(number)
   * @responseBody 200 - <Blog[]>.with(relations).paginated()
   */
  public async list({ request, response }: HttpContext) {
    const search = await request.validateUsing(this.searchValidator)
    const blogs = await this.service.getAllBlogs(search)
    return response.status(200).json(blogs)
  }

  /**
   * @retrieve
   * @summary Retrieve a single blog
   * @responseBody 200 - <Blog>
   */
  public async retrieve({ params, response }: HttpContext) {
    const { id } = await this.searchValidator.validate(params)
    const blog = await this.service.getBlogById(id ?? '')
    return response.status(200).json(blog)
  }

  /**
   * @create
   * @summary Create a new blog
   * @requestBody { "title": "New Blog", "content": "This is a new blog", "authorId": 1, "categories": [1, 2], "tags": [3, 4]}
   * @responseBody 201 - <Blog>
   * */
  public async create({ request, response, auth}: HttpContext) {
    const payload = await request.validateUsing(this.payloadValidator)
    const blog = await this.service.createBlog({...payload, authorId: auth.user?.id})
    return response.status(201).json(blog)
  }

  /**
   * @update
   * @summary Update a blog by id
   * @requestBody { "title": "Updated Blog", "content": "This is an updated blog", "categories": [1, 2], "tags": [3, 4]}
   * @responseBody 200 - <Blog>
   */
  public async update({ request, response, bouncer }: HttpContext) {
    const { id } = request.params()
    const payload = await request.validateUsing(this.payloadValidator)
    const blog = await this.service.updateBlog(id, payload, bouncer)
    return response.status(200).json(blog)
  }

  /**
   * @delete
   * @summary Delete a blog by id
   * @responseBody 204 - No Content
   */
  public async delete({ request, response }: HttpContext) {
    const { id } = request.params()
    await this.service.deleteBlog(id)
    return response.status(204)
  }
}
