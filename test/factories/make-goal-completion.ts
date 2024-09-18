import { createId } from '@paralleldrive/cuid2'
import { GoalCompletion, NewGoalCompletion } from '../../src/db/schema'

export function makeGoalCompletion(override: Partial<NewGoalCompletion> = {}) {
  const newGoalCompletion = {
    id: createId(),
    goalId: createId(),
    createdAt: new Date(),
    ...override,
  } as GoalCompletion

  return newGoalCompletion
}
