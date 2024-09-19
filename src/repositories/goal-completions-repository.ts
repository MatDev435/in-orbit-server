import { Goal, GoalCompletion, NewGoalCompletion } from '../db/schema'

export interface GoalCompletionsRepository {
  findById(goalCompletionId: string): Promise<GoalCompletion | null>
  findGoalCompletedOnDay(goalId: string): Promise<GoalCompletion | null>
  create(goalCompletion: NewGoalCompletion): Promise<GoalCompletion>
  delete(goalCompletionId: string): Promise<void>
}
