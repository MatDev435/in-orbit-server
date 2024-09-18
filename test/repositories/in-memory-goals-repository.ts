import dayjs from 'dayjs'
import { Goal, NewGoal } from '../../src/db/schema'
import {
  FetchGoalsResponse,
  GoalsRepository,
} from '../../src/repositories/goals-repository'
import { InMemoryGoalCompletionsRepository } from './in-memory-goal-completions-repository'

export class InMemoryGoalsRepository implements GoalsRepository {
  public items: Goal[] = []

  constructor(
    private inMemoryGoalCompletions: InMemoryGoalCompletionsRepository
  ) {}

  async findById(goalId: string): Promise<Goal | null> {
    const goal = this.items.find(item => item.id === goalId)

    if (!goal) {
      return null
    }

    return goal
  }

  async fetchGoals(): Promise<FetchGoalsResponse[]> {
    const lastDayOfWeek = dayjs().endOf('week').toDate()

    const goalsCreatedUpToWeek = this.items.filter(
      item => item.createdAt <= lastDayOfWeek
    )

    const result = goalsCreatedUpToWeek.map(goal => {
      return {
        id: goal.id,
        title: goal.title,
        desiredWeeklyFrequency: goal.desiredWeeklyFrequency,
        completionsCount: this.inMemoryGoalCompletions.items.filter(
          item => item.goalId === goal.id
        ).length,
      } as FetchGoalsResponse
    })

    return result
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
