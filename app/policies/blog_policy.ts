import User from '#models/user'
import Blog from '#models/blog'
import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse, GetPolicyMethods } from '@adonisjs/bouncer/types'

export type actionType = GetPolicyMethods<User, BlogPolicy>

export default class BlogPolicy extends BasePolicy {
  public update(user: User, blog: Blog): AuthorizerResponse {
    return user.id === blog.authorId || user.isAdmin
  }

  public delete(user: User, blog: Blog): AuthorizerResponse {
    return user.id === blog.authorId || user.isAdmin
  }
}
