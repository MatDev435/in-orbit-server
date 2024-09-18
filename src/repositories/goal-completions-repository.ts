import { GoalCompletion, NewGoalCompletion } from '../db/schema'

export interface GoalCompletionsRepository {
  findGoalCompletedOnDay(goalId: string): Promise<GoalCompletion | null>
  create(goalCompletion: NewGoalCompletion): Promise<GoalCompletion>
}
