import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import env from '#start/env'

export default class extends BaseSeeder {
  async run() {
    const initUser = [
      {
        fullName: 'Admin User',
        email: 'admin@example.com',
        password: env.get('ADMIN_PASSWORD', 'password123'),
        isAdmin: true,
      },
      {
        fullName: 'Normal User',
        email: 'user@example.com',
        password: env.get('USER_PASSWORD', 'password123'),
        isAdmin: false,
      }
    ]

    await User.fetchOrCreateMany('email', initUser)
  }
}
