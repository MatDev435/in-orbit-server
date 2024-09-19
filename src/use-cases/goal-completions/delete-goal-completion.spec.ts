import { makeGoalCompletion } from '../../../test/factories/make-goal-completion.js'
import { InMemoryGoalCompletionsRepository } from '../../../test/repositories/in-memory-goal-completions-repository.js'
import { NotAllowedError } from '../errors/not-allowed-error.js'
import { ResourceNotFoundError } from '../errors/resource-not-found-error.js'
import { DeleteGoalCompletionUseCase } from './delete-goal-completion.js'

let inMemoryGoalCompletionsRepository: InMemoryGoalCompletionsRepository
let sut: DeleteGoalCompletionUseCase

describe('Create Goal Use Case', () => {
  beforeEach(() => {
    inMemoryGoalCompletionsRepository = new InMemoryGoalCompletionsRepository()
    sut = new DeleteGoalCompletionUseCase(inMemoryGoalCompletionsRepository)
  })

  it('should be able to delete a goal completion', async () => {
    const goalCompletion = makeGoalCompletion({
      completerId: 'user-01',
    })

    inMemoryGoalCompletionsRepository.items.push(goalCompletion)

    await sut.execute({
      completerId: 'user-01',
      goalCompletionId: goalCompletion.id,
    })

    expect(inMemoryGoalCompletionsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete an inexistent goal completion', async () => {
    await expect(() =>
      sut.execute({
        completerId: 'user-01',
        goalCompletionId: 'inexistent-goal-completion-id',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to delete a goal completion from other user', async () => {
    const goalCompletion = makeGoalCompletion()

    inMemoryGoalCompletionsRepository.items.push(goalCompletion)

    await expect(() =>
      sut.execute({
        completerId: 'wrong-completer-id',
        goalCompletionId: goalCompletion.id,
      })
    ).rejects.toBeInstanceOf(NotAllowedError)
  })
})
