import {
  FetchGoalsResponse,
  GoalsRepository,
} from '../../repositories/goals-repository'

interface GetGoalResponse {
  goals: FetchGoalsResponse[]
}

export class GetGoalUseCase {
  constructor(private goalsRepository: GoalsRepository) {}

  async execute(): Promise<GetGoalResponse> {
    const goals = await this.goalsRepository.fetchGoals()

    return { goals }
  }
}
