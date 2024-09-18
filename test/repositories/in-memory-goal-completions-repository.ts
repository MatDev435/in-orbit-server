import dayjs from 'dayjs'
import { NewGoalCompletion, GoalCompletion } from '../../src/db/schema'
import { GoalCompletionsRepository } from '../../src/repositories/goal-completions-repository'

export class InMemoryGoalCompletionsRepository
  implements GoalCompletionsRepository
{
  public items: GoalCompletion[] = []

  async findGoalCompletedOnDay(goalId: string): Promise<GoalCompletion | null> {
    const goalCompletion = this.items
      .filter(item => item.goalId === goalId)
      .find(
        item =>
          item.createdAt >= dayjs().startOf('day').toDate() &&
          item.createdAt <= dayjs().endOf('day').toDate()
      )

    if (!goalCompletion) {
      return null
    }

    return goalCompletion
  }

  async create(goalCompletion: NewGoalCompletion): Promise<GoalCompletion> {
    const newGoalCompletion = {
      goalId: goalCompletion.goalId,
    } as GoalCompletion

    this.items.push(newGoalCompletion)

    return newGoalCompletion
  }
}
