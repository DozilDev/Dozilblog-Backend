import type { HttpContext } from '@adonisjs/core/http'

import UserService from '#services/user_service'
import { UserValidator, UserSearchParamsValidator } from '#validators/user'

export default class UsersController {
  service: UserService
  payloadValidator: typeof UserValidator
  searchValidator: typeof UserSearchParamsValidator

  constructor() {
    this.service = new UserService()
    this.payloadValidator = UserValidator
    this.searchValidator = UserSearchParamsValidator
  }

  /**
   * @list
   * @summary List all users
   * @paramQuery fullName - full name of user - @type(string)
   * @paramQuery email - email of user - @type(string)
   * @paramQuery isAdmin - is admin of user - @type(boolean)
   * @paramQuery page - page number - @type(number)
   * @paramQuery limit - limit of users per page - @type(number)
   * @responseBody 200 - <User[]>.with(relations).paginated()
   * */
  public async list({ request, response }: HttpContext) {
    const search = await request.validateUsing(this.searchValidator)
    const users = await this.service.getUsers(search)
    return response.status(200).json(users)
  }

  /**
   * @retrieve
   * @summary Retrieve a single user by id
   * @responseBody 200 - <User>.with(relations)
   */
  public async retrieve({ params, response }: HttpContext) {
    const { id } = params
    const user = await this.service.getUserById(id)
    return response.status(200).json(user)
  }

  /**
   * @create
   * @summary Create a new user
   * @requestBody { "fullName": "Takai", "email": "y@gmail.com", "password": "password123", "isAdmin": false }
   * @responseBody 201 - <User>
   */
  public async create({ request, response }: HttpContext) {
    const payload = await request.validateUsing(this.payloadValidator)
    const user = await this.service.createUser(
      payload.fullName,
      payload.email,
      payload.password,
      payload.isAdmin
    )
    return response.status(201).json(user)
  }

  /**
   * @update
   * @summary Update a user by id
   * @requestBody { "fullName": "Takai Updated", "email": "y@gmail.com", "isAdmin": true }
   * @responseBody 200 - <User>
   * */
  public async update({ request, response }: HttpContext) {
    const { id } = request.params()
    const payload = await request.validateUsing(this.payloadValidator)
    const user = await this.service.updateUser(id, payload.fullName, payload.email, payload.isAdmin)
    return response.status(200).json(user)
  }

  /**
   * @delete
   * @summary Delete a user by id
   * @responseBody 204 - No Content response
   */
  public async delete({ request, response }: HttpContext) {
    const { id } = request.params()
    await this.service.deleteUser(id)
    return response.status(200).json({ message: 'User deleted successfully' })
  }

  /**
   * @login
   * @summary (PUBLIC) Login a user
   * @requestBody { "email": "y@gmail.com", "password": "password123" }
   * @responseBody 200 - <User>
   * @responseBody 401 - { "errors": [{ "message": "Invalid credentials" }]  }
   * */
  public async login({ request, auth, response }: HttpContext) {
    const user = await this.service.login(request.input('email'), request.input('password'), auth)
    return response.json({ user })
  }

  /**
   * @logout
   * @summary Logout a user
   * @responseBody 200 - { "message": "Logged out successfully" }
   * @responseBody 401 - { "errors": [{ "message": "Not authenticated" }]
   * @responseBody 403 - { "errors": [{ "message": "Unauthorized" }]
   * */
  public async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.status(200).json({ message: 'Logged out successfully' })
  }
}
