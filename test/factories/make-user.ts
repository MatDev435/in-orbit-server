import { faker } from '@faker-js/faker'
import { NewUser, User } from '../../src/db/schema'

export function makeUser(override: Partial<NewUser> = {}) {
  const newUser = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    passwordHash: faker.internet.password(),
    ...override,
  } as User

  return newUser
}
