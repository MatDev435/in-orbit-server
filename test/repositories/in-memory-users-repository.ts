import { NewUser, User } from '../../src/db/schema'
import { UsersRepository } from '../../src/repositories/users-repository'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find(item => item.email === email)

    if (!user) {
      return null
    }

    return user
  }

  async create(user: NewUser): Promise<User> {
    const newUser = {
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
    } as User

    this.items.push(newUser)

    return newUser
  }
}
