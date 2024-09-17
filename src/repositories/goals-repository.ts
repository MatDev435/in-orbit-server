import { Goal, NewGoal } from '../db/schema'

export interface GoalsRepository {
  findById(goalId: string): Promise<Goal | null>
  save(goal: Goal): Promise<Goal>
  create(goal: NewGoal): Promise<Goal>
  delete(goalId: string): Promise<void>
}
