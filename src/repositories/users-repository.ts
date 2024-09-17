import { NewUser, User } from '../db/schema'

export interface UsersRepository {
  findByEmail(email: string): Promise<User | null>
  create(user: NewUser): Promise<User>
}
