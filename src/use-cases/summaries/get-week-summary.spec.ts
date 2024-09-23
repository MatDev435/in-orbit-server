import { makeGoal } from '../../../test/factories/make-goal.js'
import { InMemoryGoalCompletionsRepository } from '../../../test/repositories/in-memory-goal-completions-repository.js'
import { InMemoryGoalsRepository } from '../../../test/repositories/in-memory-goals-repository.js'
import { GetWeekSummaryUseCase } from './get-week-summary.js'
import { InMemorySummariesRepository } from '../../../test/repositories/in-memory-summaries-repository.js'
import { makeGoalCompletion } from '../../../test/factories/make-goal-completion.js'

let inMemoryGoalCompletionsRepository: InMemoryGoalCompletionsRepository
let inMemoryGoalsRepository: InMemoryGoalsRepository
let inMemorySummariesRepository: InMemorySummariesRepository
let sut: GetWeekSummaryUseCase

describe('Get Goal Use Case', () => {
  beforeEach(() => {
    inMemoryGoalCompletionsRepository = new InMemoryGoalCompletionsRepository()
    inMemoryGoalsRepository = new InMemoryGoalsRepository(
      inMemoryGoalCompletionsRepository
    )
    inMemorySummariesRepository = new InMemorySummariesRepository(
      inMemoryGoalsRepository,
      inMemoryGoalCompletionsRepository
    )
    sut = new GetWeekSummaryUseCase(inMemorySummariesRepository)
  })

  it('should be abel to get week summary', async () => {
    inMemoryGoalsRepository.items.push(
      makeGoal({ id: 'goal-01', ownerId: 'user-01', desiredWeeklyFrequency: 1 })
    )
    inMemoryGoalsRepository.items.push(
      makeGoal({
        id: 'goal-02',
        ownerId: 'user-01',
        title: 'Goal 02',
        desiredWeeklyFrequency: 4,
      })
    )

    inMemoryGoalCompletionsRepository.items.push(
      makeGoalCompletion({
        completerId: 'user-01',
        goalId: 'goal-02',
      })
    )

    const { summary } = await sut.execute({
      userId: 'user-01',
    })

    expect(summary).toEqual({
      total: 5,
      completed: 1,
      goalsPerDay: {
        '2024-09-23': expect.arrayContaining([
          expect.objectContaining({
            title: 'Goal 02',
          }),
        ]),
      },
    })
  })
})
