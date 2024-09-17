import { Goal, NewGoal } from '../../src/db/schema'
import { GoalsRepository } from '../../src/repositories/goals-repository'

export class InMemoryGoalsRepository implements GoalsRepository {
  public items: Goal[] = []

  async create(goal: NewGoal): Promise<Goal> {
    const newGoal = {
      ownerId: goal.ownerId,
      title: goal.title,
      desiredWeeklyFrequency: goal.desiredWeeklyFrequency,
    } as Goal

    this.items.push(newGoal)

    return newGoal
  }
}
