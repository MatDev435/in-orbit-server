import { GoalCompletion, NewGoalCompletion } from '../db/schema'

export interface GoalCompletionsRepository {
  create(goalCompletion: NewGoalCompletion): Promise<GoalCompletion>
}
