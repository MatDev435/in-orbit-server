import { Goal, NewGoal } from '../../src/db/schema'
import { GoalsRepository } from '../../src/repositories/goals-repository'

export class InMemoryGoalsRepository implements GoalsRepository {
  public items: Goal[] = []

  async findById(goalId: string): Promise<Goal | null> {
    const goal = this.items.find(item => item.id === goalId)

    if (!goal) {
      return null
    }

    return goal
  }

  async save(goal: Goal): Promise<Goal> {
    const itemIndex = this.items.findIndex(item => item.id === goal.id)

    this.items[itemIndex] = goal
  }

  async create(goal: NewGoal): Promise<Goal> {
    const newGoal = {
      ownerId: goal.ownerId,
      title: goal.title,
      desiredWeeklyFrequency: goal.desiredWeeklyFrequency,
    } as Goal

    this.items.push(newGoal)

    return newGoal
  }

  async delete(goalId: string): Promise<void> {
    const itemIndex = this.items.findIndex(item => item.id === goalId)

    this.items.splice(itemIndex, 1)
  }
}
