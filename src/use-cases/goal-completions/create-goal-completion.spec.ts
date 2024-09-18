import { makeGoalCompletion } from '../../../test/factories/make-goal-completion.js'
import { makeGoal } from '../../../test/factories/make-goal.js'
import { InMemoryGoalCompletionsRepository } from '../../../test/repositories/in-memory-goal-completions-repository.js'
import { InMemoryGoalsRepository } from '../../../test/repositories/in-memory-goals-repository.js'
import { GoalAlreadyCompletedError } from '../errors/goal-already-completed-error.js'
import { NotAllowedError } from '../errors/not-allowed-error.js'
import { ResourceNotFoundError } from '../errors/resource-not-found-error.js'
import { CreateGoalCompletionUseCase } from './create-goal-completion.js'

let inMemoryGoalCompletionsRepository: InMemoryGoalCompletionsRepository
let inMemoryGoalsRepository: InMemoryGoalsRepository
let sut: CreateGoalCompletionUseCase

describe('Create Goal Use Case', () => {
  beforeEach(() => {
    inMemoryGoalCompletionsRepository = new InMemoryGoalCompletionsRepository()
    inMemoryGoalsRepository = new InMemoryGoalsRepository(
      inMemoryGoalCompletionsRepository
    )
    sut = new CreateGoalCompletionUseCase(
      inMemoryGoalsRepository,
      inMemoryGoalCompletionsRepository
    )
  })

  it('should be able to create a new goal completion', async () => {
    const goal = makeGoal({
      ownerId: 'user-01',
    })

    inMemoryGoalsRepository.items.push(goal)

    const { goalCompletion } = await sut.execute({
      ownerId: 'user-01',
      goalId: goal.id,
    })

    expect(inMemoryGoalCompletionsRepository.items[0]).toEqual(goalCompletion)
  })

  it('should not be able to create a goal completion from an inexistent goal', async () => {
    await expect(() =>
      sut.execute({
        ownerId: 'user-01',
        goalId: 'inexistent-goal-id',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to create a goal completion from other user', async () => {
    const goal = makeGoal({
      ownerId: 'user-01',
    })

    inMemoryGoalsRepository.items.push(goal)

    await expect(() =>
      sut.execute({
        ownerId: 'user-02',
        goalId: goal.id,
      })
    ).rejects.toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to create a goal completion twice on same day', async () => {
    const goal = makeGoal({
      ownerId: 'user-01',
    })

    inMemoryGoalsRepository.items.push(goal)
    inMemoryGoalCompletionsRepository.items.push(
      makeGoalCompletion({
        goalId: goal.id,
      })
    )

    await expect(() =>
      sut.execute({
        ownerId: 'user-01',
        goalId: goal.id,
      })
    ).rejects.toBeInstanceOf(GoalAlreadyCompletedError)
  })
})
