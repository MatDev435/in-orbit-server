import { Goal, NewGoal } from '../db/schema'

export interface GoalsRepository {
  findById(goalId: string): Promise<Goal | null>
  create(goal: NewGoal): Promise<Goal>
  delete(goalId: string): Promise<void>
}
