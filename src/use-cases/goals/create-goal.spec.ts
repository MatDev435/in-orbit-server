import { InMemoryGoalCompletionsRepository } from '../../../test/repositories/in-memory-goal-completions-repository.js'
import { InMemoryGoalsRepository } from '../../../test/repositories/in-memory-goals-repository.js'
import { CreateGoalUseCase } from './create-goal.js'

let inMemoryGoalCompletionsRepository: InMemoryGoalCompletionsRepository
let inMemoryGoalsRepository: InMemoryGoalsRepository
let sut: CreateGoalUseCase

describe('Create Goal Use Case', () => {
  beforeEach(() => {
    inMemoryGoalCompletionsRepository = new InMemoryGoalCompletionsRepository()
    inMemoryGoalsRepository = new InMemoryGoalsRepository(
      inMemoryGoalCompletionsRepository
    )
    sut = new CreateGoalUseCase(inMemoryGoalsRepository)
  })

  it('should be able to create a new goal', async () => {
    const { goal } = await sut.execute({
      ownerId: 'user-01',
      title: 'New goal',
      desiredWeeklyFrequency: 3,
    })

    expect(inMemoryGoalsRepository.items[0]).toEqual(goal)
  })
})
