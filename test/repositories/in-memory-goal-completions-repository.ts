import dayjs from 'dayjs'
import { NewGoalCompletion, GoalCompletion } from '../../src/db/schema'
import { GoalCompletionsRepository } from '../../src/repositories/goal-completions-repository'

export class InMemoryGoalCompletionsRepository
  implements GoalCompletionsRepository
{
  public items: GoalCompletion[] = []

  async findById(goalCompletionId: string): Promise<GoalCompletion | null> {
    const goalCompletion = this.items.find(item => item.id === goalCompletionId)

    if (!goalCompletion) {
      return null
    }

    return goalCompletion
  }

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

  async fetchGoalCompletionsInWeek(userId: string): Promise<GoalCompletion[]> {
    const firstDayOfWeek = dayjs().startOf('week').toDate()
    const lastDayOfWeek = dayjs().endOf('week').toDate()

    const goalCompletions = this.items.filter(
      item =>
        item.createdAt >= firstDayOfWeek && item.createdAt <= lastDayOfWeek
    )

    return goalCompletions
  }

  async create(goalCompletion: NewGoalCompletion): Promise<GoalCompletion> {
    const newGoalCompletion = {
      completerId: goalCompletion.completerId,
      goalId: goalCompletion.goalId,
    } as GoalCompletion

    this.items.push(newGoalCompletion)

    return newGoalCompletion
  }

  async delete(goalCompletionId: string): Promise<void> {
    const itemIndex = this.items.findIndex(item => item.id === goalCompletionId)

    this.items.splice(itemIndex, 1)
  }
}
