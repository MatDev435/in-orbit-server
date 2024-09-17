import { GoalsRepository } from '../../repositories/goals-repository'
import { NotAllowedError } from '../errors/not-allowed-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface DeleteGoalRequest {
  ownerId: string
  goalId: string
}

export class DeleteGoalUseCase {
  constructor(private goalsRepository: GoalsRepository) {}

  async execute({ ownerId, goalId }: DeleteGoalRequest) {
    const goal = await this.goalsRepository.findById(goalId)

    if (!goal) {
      throw new ResourceNotFoundError()
    }

    if (ownerId !== goal.ownerId) {
      throw new NotAllowedError()
    }

    await this.goalsRepository.delete(goal.id)
  }
}
