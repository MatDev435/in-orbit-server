import { Encrypter } from '../../cryptography/encrypter'
import { User } from '../../db/schema'
import { UsersRepository } from '../../repositories/users-repository'
import { EmailAlreadyInUseError } from '../errors/email-already-in-use-error'

interface CreateUserRequest {
  name: string
  email: string
  password: string
}

interface CreateUserResponse {
  user: User
}

export class CreateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private encrypter: Encrypter
  ) {}

  async execute({
    name,
    email,
    password,
  }: CreateUserRequest): Promise<CreateUserResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new EmailAlreadyInUseError()
    }

    const hashedPassword = await this.encrypter.hash(password)

    const user = await this.usersRepository.create({
      name,
      email,
      passwordHash: hashedPassword,
    })

    return { user }
  }
}
