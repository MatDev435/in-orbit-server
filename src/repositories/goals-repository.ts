import { Goal, NewGoal } from '../db/schema'

export interface GoalsRepository {
  create(goal: NewGoal): Promise<Goal>
}
