import {
  FetchGoalsResponse,
  GoalsRepository,
} from '../../repositories/goals-repository'

interface GetGoalsRequest {
  userId: string
}

interface GetGoalResponse {
  goals: FetchGoalsResponse[]
}

export class GetGoalUseCase {
  constructor(private goalsRepository: GoalsRepository) {}

  async execute({ userId }: GetGoalsRequest): Promise<GetGoalResponse> {
    const goals = await this.goalsRepository.fetchGoals(userId)

    return { goals }
  }
}
