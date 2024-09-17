import { Goal } from '../../db/schema'
import { GoalsRepository } from '../../repositories/goals-repository'

interface CreateGoalRequest {
  ownerId: string
  title: string
  desiredWeeklyFrequency: number
}

interface CreateGoalResponse {
  goal: Goal
}

export class CreateGoalUseCase {
  constructor(private goalsRepository: GoalsRepository) {}

  async execute({
    ownerId,
    title,
    desiredWeeklyFrequency,
  }: CreateGoalRequest): Promise<CreateGoalResponse> {
    const goal = await this.goalsRepository.create({
      ownerId,
      title,
      desiredWeeklyFrequency,
    })

    return { goal }
  }
}
