import { NewGoalCompletion, GoalCompletion } from '../../src/db/schema'
import { GoalCompletionsRepository } from '../../src/repositories/goal-completions-repository'

export class InMemoryGoalCompletionsRepository
  implements GoalCompletionsRepository
{
  public items: GoalCompletion[] = []

  async create(goalCompletion: NewGoalCompletion): Promise<GoalCompletion> {
    const newGoalCompletion = {
      goalId: goalCompletion.goalId,
    } as GoalCompletion

    this.items.push(newGoalCompletion)

    return newGoalCompletion
  }
}
