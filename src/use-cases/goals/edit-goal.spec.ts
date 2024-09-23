import { makeGoal } from '../../../test/factories/make-goal.js'
import { InMemoryGoalCompletionsRepository } from '../../../test/repositories/in-memory-goal-completions-repository.js'
import { InMemoryGoalsRepository } from '../../../test/repositories/in-memory-goals-repository.js'
import { NotAllowedError } from '../errors/not-allowed-error.js'
import { ResourceNotFoundError } from '../errors/resource-not-found-error.js'
import { EditGoalUseCase } from './edit-goal.js'

let inMemoryGoalCompletionsRepository: InMemoryGoalCompletionsRepository
let inMemoryGoalsRepository: InMemoryGoalsRepository
let sut: EditGoalUseCase

describe('Create Goal Use Case', () => {
  beforeEach(() => {
    inMemoryGoalCompletionsRepository = new InMemoryGoalCompletionsRepository()
    inMemoryGoalsRepository = new InMemoryGoalsRepository(
      inMemoryGoalCompletionsRepository
    )
    sut = new EditGoalUseCase(inMemoryGoalsRepository)
  })

  it('should be able to edit a goal', async () => {
    const oldGoal = makeGoal({
      ownerId: 'user-01',
      title: 'Old title',
      desiredWeeklyFrequency: 1,
    })

    inMemoryGoalsRepository.items.push(oldGoal)

    const { goal } = await sut.execute({
      ownerId: 'user-01',
      goalId: oldGoal.id,
      title: 'New title',
      desiredWeeklyFrequency: 3,
    })

    expect(inMemoryGoalsRepository.items[0]).toEqual(goal)
  })

  it('should not be able to edit a goal from other user', async () => {
    const oldGoal = makeGoal({
      ownerId: 'user-01',
      title: 'Old title',
      desiredWeeklyFrequency: 1,
    })

    inMemoryGoalsRepository.items.push(oldGoal)

    await expect(() =>
      sut.execute({
        ownerId: 'user-02',
        goalId: oldGoal.id,
        title: 'New title',
        desiredWeeklyFrequency: 3,
      })
    ).rejects.toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to edit an inexistent goal', async () => {
    await expect(() =>
      sut.execute({
        ownerId: 'user-00',
        goalId: 'inexistent-goal-id',
        title: 'New title',
        desiredWeeklyFrequency: 3,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
