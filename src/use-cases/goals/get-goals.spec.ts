import dayjs from 'dayjs'
import { makeGoal } from '../../../test/factories/make-goal.js'
import { InMemoryGoalCompletionsRepository } from '../../../test/repositories/in-memory-goal-completions-repository.js'
import { InMemoryGoalsRepository } from '../../../test/repositories/in-memory-goals-repository.js'
import { GetGoalUseCase } from './get-goals.js'

let inMemoryGoalCompletionsRepository: InMemoryGoalCompletionsRepository
let inMemoryGoalsRepository: InMemoryGoalsRepository
let sut: GetGoalUseCase

describe('Get Goal Use Case', () => {
  beforeEach(() => {
    inMemoryGoalCompletionsRepository = new InMemoryGoalCompletionsRepository()
    inMemoryGoalsRepository = new InMemoryGoalsRepository(
      inMemoryGoalCompletionsRepository
    )
    sut = new GetGoalUseCase(inMemoryGoalsRepository)
  })

  it('should be able to list goals', async () => {
    const goal = makeGoal({
      id: 'goal-01',
      title: 'New goal',
      desiredWeeklyFrequency: 2,
    })

    inMemoryGoalsRepository.items.push(goal)
    inMemoryGoalCompletionsRepository.items.push({
      id: 'test',
      goalId: goal.id,
      createdAt: new Date(),
    })

    const { goals } = await sut.execute()

    expect(goals).toEqual([
      expect.objectContaining({
        id: 'goal-01',
        title: 'New goal',
        desiredWeeklyFrequency: 2,
        completionsCount: 1,
      }),
    ])
  })

  it('should not list goals that were created after the current week', async () => {
    const goal = makeGoal({
      id: 'goal-01',
      title: 'New goal',
      desiredWeeklyFrequency: 2,
      createdAt: dayjs().endOf('week').add(1, 'day').toDate(),
    })

    inMemoryGoalsRepository.items.push(goal)

    const { goals } = await sut.execute()

    expect(goals).toHaveLength(0)
  })
})
