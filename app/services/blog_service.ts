import { DefaultPagination } from '#constants/enum'
import { AppBouncer } from '#constants/interface'
import Blog from '#models/blog'
import BlogPolicy, { actionType } from '#policies/blog_policy'
import { BlogPayload, BlogSearch } from '#validators/blog'
import { Exception } from '@adonisjs/core/exceptions'

export default class BlogService {
  constructor() {}

  private async policies(bouncer: AppBouncer, blog: Blog, action: actionType): Promise<void> {
    const is_denied = await bouncer.with(BlogPolicy).denies(action, blog)
    if (is_denied) {
      throw new Exception("You are not authorized to this blog.", { status: 403 , code: 'E_FORBIDDEN'})
    }
  }

  public async getAllBlogs(search: BlogSearch): Promise<Blog[]> {
    const page = search.page || DefaultPagination.PAGE
    const limit = search.limit || DefaultPagination.LIMIT

    let query = Blog.query()

    if (search.title) {
      query = query.where('title', 'ilike', `%${search.title}%`)
    }

    if (search.content) {
      query = query.where('content', 'ilike', `%${search.content}%`)
    }

    if (search.authorId) {
      query = query.where('authorId', search.authorId)
    }

    if (search.categories) {
      query = query.whereHas('categories', (category) =>
        category.whereIn('categories.id', search.categories ?? [])
      )
    }

    if (search.tags) {
      query = query.whereHas('tags', (tag) => tag.whereIn('tags.id', search.tags ?? []))
    }

    return await query.preload('categories').preload('tags').preload('author').paginate(page, limit)
  }

  public async getBlogById(id: string): Promise<Blog> {
    const blog = await Blog.findByOrFail({ id })
    blog.load('categories')
    blog.load('tags')
    blog.load('author')
    return blog
  }

  public async createBlog(payload: BlogPayload): Promise<Blog> {
    const { authorId, categories, content, tags, title } = payload
    const blog = await Blog.create({ title, content, authorId })
    blog.related('categories').attach(categories)
    blog.related('tags').attach(tags)
    return blog
  }

  public async updateBlog(id: string, payload: BlogPayload, bouncer: AppBouncer): Promise<Blog> {
    const blog = await Blog.findByOrFail({ id })
    // await this.policies(bouncer, blog, 'update')
    console.log(this.policies, bouncer, 'update')
    blog.merge(payload)
    blog.related('categories').sync(payload.categories)
    blog.related('tags').sync(payload.tags)

    await blog.save()

    return blog
  }

  public async deleteBlog(id: string): Promise<void> {
    const blog = await Blog.findByOrFail({ id })
    await blog.delete()
    return
  }
}
