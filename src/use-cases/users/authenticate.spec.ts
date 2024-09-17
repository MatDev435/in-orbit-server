import { FakeEncrypter } from '../../../test/cryptography/fake-encrypter.js'
import { makeUser } from '../../../test/factories/make-user.js'
import { InMemoryUsersRepository } from '../../../test/repositories/in-memory-users-repository.js'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error.js'
import { AuthenticateUseCase } from './authenticate.js'

let inMemoryUsersRepository: InMemoryUsersRepository
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    fakeEncrypter = new FakeEncrypter()
    sut = new AuthenticateUseCase(inMemoryUsersRepository, fakeEncrypter)
  })

  it('should be able to authenticate', async () => {
    inMemoryUsersRepository.items.push(
      makeUser({
        email: 'johndoe@example.com',
        passwordHash: await fakeEncrypter.hash('123456'),
      })
    )

    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(inMemoryUsersRepository.items[0]).toEqual(user)
  })

  it('should not be able to authenticate with wrong email', async () => {
    inMemoryUsersRepository.items.push(
      makeUser({
        email: 'johndoe@example.com',
        passwordHash: await fakeEncrypter.hash('123456'),
      })
    )

    await expect(() =>
      sut.execute({
        email: 'wrong@example.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    inMemoryUsersRepository.items.push(
      makeUser({
        email: 'johndoe@example.com',
        passwordHash: await fakeEncrypter.hash('123456'),
      })
    )

    await expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        password: 'wrong',
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
