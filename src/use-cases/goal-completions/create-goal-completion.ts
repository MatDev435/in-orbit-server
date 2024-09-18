import { GoalCompletion } from '../../db/schema'
import { GoalCompletionsRepository } from '../../repositories/goal-completions-repository'
import { GoalsRepository } from '../../repositories/goals-repository'
import { GoalAlreadyCompletedError } from '../errors/goal-already-completed-error'
import { NotAllowedError } from '../errors/not-allowed-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface CreateGoalCompletionRequest {
  ownerId: string
  goalId: string
}

interface CreateGoalCompletionResponse {
  goalCompletion: GoalCompletion
}

export class CreateGoalCompletionUseCase {
  constructor(
    private goalsRepository: GoalsRepository,
    private goalCompletionsRepository: GoalCompletionsRepository
  ) {}

  async execute({
    ownerId,
    goalId,
  }: CreateGoalCompletionRequest): Promise<CreateGoalCompletionResponse> {
    const goal = await this.goalsRepository.findById(goalId)

    if (!goal) {
      throw new ResourceNotFoundError()
    }

    if (ownerId !== goal.ownerId) {
      throw new NotAllowedError()
    }

    const goalCompletedOnDay =
      await this.goalCompletionsRepository.findGoalCompletedOnDay(goalId)

    if (goalCompletedOnDay) {
      throw new GoalAlreadyCompletedError()
    }

    const goalCompletion = await this.goalCompletionsRepository.create({
      goalId: goal.id,
    })

    return { goalCompletion }
  }
}
