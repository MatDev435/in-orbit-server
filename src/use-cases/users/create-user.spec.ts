import { FakeEncrypter } from '../../../test/cryptography/fake-encrypter.js'
import { makeUser } from '../../../test/factories/make-user.js'
import { InMemoryUsersRepository } from '../../../test/repositories/in-memory-users-repository.js'
import { EmailAlreadyInUseError } from '../errors/email-already-in-use-error.js'
import { CreateUserUseCase } from './create-user.js'

let inMemoryUsersRepository: InMemoryUsersRepository
let fakeEncrypter: FakeEncrypter
let sut: CreateUserUseCase

describe('Create User Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    fakeEncrypter = new FakeEncrypter()
    sut = new CreateUserUseCase(inMemoryUsersRepository, fakeEncrypter)
  })

  it('should be able to create a new user', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(inMemoryUsersRepository.items[0]).toEqual(user)
  })

  it('should hash users password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const isPasswordHashed = await fakeEncrypter.compare(
      '123456',
      user.passwordHash
    )

    expect(isPasswordHashed).toEqual(true)
  })

  it('should not be able to create an user with same email', async () => {
    inMemoryUsersRepository.items.push(
      makeUser({
        email: 'johndoe@example.com',
      })
    )

    await expect(() =>
      sut.execute({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(EmailAlreadyInUseError)
  })
})
