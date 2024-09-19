import { GoalCompletionsRepository } from '../../repositories/goal-completions-repository'
import { NotAllowedError } from '../errors/not-allowed-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface DeleteGoalCompletionRequest {
  completerId: string
  goalCompletionId: string
}

export class DeleteGoalCompletionUseCase {
  constructor(private goalCompletionsRepository: GoalCompletionsRepository) {}

  async execute({
    completerId,
    goalCompletionId,
  }: DeleteGoalCompletionRequest) {
    const goalCompletion =
      await this.goalCompletionsRepository.findById(goalCompletionId)

    if (!goalCompletion) {
      throw new ResourceNotFoundError()
    }

    if (completerId !== goalCompletion.completerId) {
      throw new NotAllowedError()
    }

    await this.goalCompletionsRepository.delete(goalCompletionId)
  }
}
