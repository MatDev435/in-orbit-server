import { GoalCompletionsRepository } from '../../src/repositories/goal-completions-repository'
import { GoalsRepository } from '../../src/repositories/goals-repository'
import {
  GoalsPerDay,
  SummariesRepository,
  WeekSummary,
} from '../../src/repositories/summaries-repository'

export class InMemorySummariesRepository implements SummariesRepository {
  constructor(
    private goalsRepository: GoalsRepository,
    private goalCompletionsRepository: GoalCompletionsRepository
  ) {}

  async getWeekSummary(userId: string): Promise<WeekSummary> {
    const goals = await this.goalsRepository.fetchGoals(userId)
    const goalCompletionsInWeek =
      await this.goalCompletionsRepository.fetchGoalCompletionsInWeek(userId)

    const total = goals.reduce(
      (sum, goal) => sum + goal.desiredWeeklyFrequency,
      0
    )
    const completed = goalCompletionsInWeek.length
    const goalsPerDay = goalCompletionsInWeek.reduce(
      (acc: GoalsPerDay, completion) => {
        const goal = goals.find(item => item.id === completion.goalId)

        if (goal) {
          const completionObject = {
            id: completion.id,
            title: goal.title,
            completedAt: completion.createdAt.toString(),
          }

          const dateKey = completion.createdAt.toISOString().split('T')[0]

          if (acc[dateKey]) {
            acc[dateKey].push(completionObject)
          }

          acc[dateKey] = [completionObject]
        }

        return acc
      },
      {} as GoalsPerDay
    )

    const summary = {
      total,
      completed,
      goalsPerDay,
    }

    return summary
  }
}
