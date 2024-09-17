import { Goal } from '../../db/schema'
import { GoalsRepository } from '../../repositories/goals-repository'
import { NotAllowedError } from '../errors/not-allowed-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface EditGoalRequest {
  ownerId: string
  goalId: string
  title: string
  desiredWeeklyFrequency: number
}

interface EditGoalResponse {
  goal: Goal
}

export class EditGoalUseCase {
  constructor(private goalsRepository: GoalsRepository) {}

  async execute({
    ownerId,
    goalId,
    title,
    desiredWeeklyFrequency,
  }: EditGoalRequest): Promise<EditGoalResponse> {
    const goal = await this.goalsRepository.findById(goalId)

    if (!goal) {
      throw new ResourceNotFoundError()
    }

    if (ownerId !== goal.ownerId) {
      throw new NotAllowedError()
    }

    goal.title = title
    goal.desiredWeeklyFrequency = desiredWeeklyFrequency

    await this.goalsRepository.save(goal)

    return { goal }
  }
}
