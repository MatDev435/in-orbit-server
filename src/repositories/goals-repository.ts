import { Goal, NewGoal } from '../db/schema'

export interface FetchGoalsResponse {
  id: string
  title: string
  desiredWeeklyFrequency: number
  completionsCount: number
}

export interface GoalsRepository {
  findById(goalId: string): Promise<Goal | null>
  fetchGoals(): Promise<FetchGoalsResponse[]>
  save(goal: Goal): Promise<Goal>
  create(goal: NewGoal): Promise<Goal>
  delete(goalId: string): Promise<void>
}
