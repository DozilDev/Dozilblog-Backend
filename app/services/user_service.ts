import { DefaultPagination } from '#constants/enum'
import User from '#models/user'
import { UserSearch } from '#validators/user'
import { Authenticator } from '@adonisjs/auth'
import { Authenticators } from '@adonisjs/auth/types'

export default class UserService {
  constructor() {}

  public async getUsers(search: UserSearch): Promise<User[]> {
    const page = search.page || DefaultPagination.PAGE
    const limit = search.limit || DefaultPagination.LIMIT

    let query = User.query()

    if (search.fullName) {
      query = query.where('fullName', 'ilike', `%${search.fullName}%`)
    }

    if (search.email) {
      query = query.where('email', 'ilike', `%${search.email}%`)
    }

    if (search.isAdmin != null && search.isAdmin !== undefined) {
      query = query.where('isAdmin', search.isAdmin)
    }

    if (search.fetchBlogs) {
      query = query.preload('blogs', (blog) => {
        return blog.preload('categories').preload('tags').orderBy('createdAt', 'desc').groupLimit(5)
      })
    }

    return await query.paginate(page, limit)
  }

  public async getUserById(id: number): Promise<User> {
    const user = await User.findByOrFail({ id })
    user.load('blogs')
    return user
  }

  public async createUser(
    fullName: string,
    email: string,
    password: string,
    isAdmin: boolean = false
  ): Promise<User> {
    return await User.create({ fullName, email, password, isAdmin })
  }

  public async updateUser(
    id: number,
    fullName: string,
    email: string,
    isAdmin: boolean = false
  ): Promise<User> {
    const user = await User.findByOrFail({ id })
    user.merge({ fullName, email, isAdmin })
    await user.save()
    return user
  }

  public async deleteUser(id: number): Promise<void> {
    const user = await User.findByOrFail({ id })
    await user.delete()
    return
  }

  public async login(
    email: string,
    password: string,
    auth: Authenticator<Authenticators>
  ): Promise<User | null> {
    const user = await User.verifyCredentials(email, password)
    await auth.use('web').login(user)
    return user
  }
}
