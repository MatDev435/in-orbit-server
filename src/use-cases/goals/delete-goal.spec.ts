import { makeGoal } from '../../../test/factories/make-goal.js'
import { InMemoryGoalCompletionsRepository } from '../../../test/repositories/in-memory-goal-completions-repository.js'
import { InMemoryGoalsRepository } from '../../../test/repositories/in-memory-goals-repository.js'
import { NotAllowedError } from '../errors/not-allowed-error.js'
import { ResourceNotFoundError } from '../errors/resource-not-found-error.js'
import { CreateGoalUseCase } from './create-goal.js'
import { DeleteGoalUseCase } from './delete-goal.js'

let inMemoryGoalCompletionsRepository: InMemoryGoalCompletionsRepository
let inMemoryGoalsRepository: InMemoryGoalsRepository
let sut: DeleteGoalUseCase

describe('Delete Goal Use Case', () => {
  beforeEach(() => {
    inMemoryGoalCompletionsRepository = new InMemoryGoalCompletionsRepository()
    inMemoryGoalsRepository = new InMemoryGoalsRepository(
      inMemoryGoalCompletionsRepository
    )
    sut = new DeleteGoalUseCase(inMemoryGoalsRepository)
  })

  it('should be able to delete a goal', async () => {
    const goal = makeGoal({
      ownerId: 'user-01',
    })

    inMemoryGoalsRepository.items.push(goal)

    await sut.execute({
      ownerId: 'user-01',
      goalId: goal.id,
    })

    expect(inMemoryGoalsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete an inexistent goal', async () => {
    await expect(() =>
      sut.execute({
        ownerId: 'user-01',
        goalId: 'wrong-goal-id',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to delete a goal from other user', async () => {
    const goal = makeGoal({
      ownerId: 'user-01',
    })

    inMemoryGoalsRepository.items.push(goal)

    await expect(() =>
      sut.execute({
        ownerId: 'wrong-user',
        goalId: goal.id,
      })
    ).rejects.toBeInstanceOf(NotAllowedError)
  })
})
