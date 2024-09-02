import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import AutoSwagger from 'adonis-autoswagger'
import swagger from '#config/swagger'

router
  .group(() => {
    const userController = () => import('#controllers/users_controller')
    const categoryController = () => import('#controllers/categories_controller')
    const tagsController = () => import('#controllers/tags_controller')
    const blogController = () => import('#controllers/blog_controller')

    router
      .group(() => {
        router.post('/login', [userController, 'login'])
        router.get('/logout', [userController, 'logout']).use(middleware.auth())
      })
      .prefix('/auth')

    router
      .group(() => {
        router.get('/', [userController, 'list'])
        router.get('/:id', [userController, 'retrieve'])
        router.post('/', [userController, 'create'])
        router.put('/:id', [userController, 'update'])
        router.delete('/:id', [userController, 'delete'])
      })
      .prefix('/users')
      .use(middleware.guest())

    router
      .group(() => {
        router.get('/', [categoryController, 'list'])
        router.get('/:id', [categoryController, 'retrieve'])
        router.post('/', [categoryController, 'create'])
        router.put('/:id', [categoryController, 'update'])
        router.delete('/:id', [categoryController, 'delete'])
      })
      .prefix('/categories')
      .use(middleware.guest())

    router
      .group(() => {
        router.get('/', [tagsController, 'list'])
        router.get('/:id', [tagsController, 'retrieve'])
        router.post('/', [tagsController, 'create'])
        router.put('/:id', [tagsController, 'update'])
        router.delete('/:id', [tagsController, 'delete'])
      })
      .prefix('/tags')
      .use(middleware.guest())

    router
      .group(() => {
        router.get('/:id', [blogController, 'retrieve'])
        router.get('/', [blogController, 'list'])
        router.put('/:id', [blogController, 'update'])
        router.post('/', [blogController, 'create'])
        router.delete('/:id', [blogController, 'delete'])
      })
      .prefix('/blogs')
      .use(middleware.guest())
  })
  .prefix('/api/v1')

router.get('/swagger', async () => AutoSwagger.default.docs(router.toJSON(), swagger))
router.get('/docs', async () => AutoSwagger.default.ui('/swagger', swagger))
