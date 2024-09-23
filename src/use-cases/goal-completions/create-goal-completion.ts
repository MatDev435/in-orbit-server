import { GoalCompletion } from '../../db/schema'
import { GoalCompletionsRepository } from '../../repositories/goal-completions-repository'
import { GoalsRepository } from '../../repositories/goals-repository'
import { GoalAlreadyCompletedError } from '../errors/goal-already-completed-error'
import { NotAllowedError } from '../errors/not-allowed-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface CreateGoalCompletionRequest {
  completerId: string
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
    completerId,
    goalId,
  }: CreateGoalCompletionRequest): Promise<CreateGoalCompletionResponse> {
    const goal = await this.goalsRepository.findById(goalId)

    if (!goal) {
      throw new ResourceNotFoundError()
    }

    if (completerId !== goal.ownerId) {
      throw new NotAllowedError()
    }

    const goalCompletedOnDay =
      await this.goalCompletionsRepository.findGoalCompletedOnDay(goalId)

    if (goalCompletedOnDay) {
      throw new GoalAlreadyCompletedError()
    }

    const goalCompletion = await this.goalCompletionsRepository.create({
      completerId,
      goalId: goal.id,
    })

    return { goalCompletion }
  }
}
