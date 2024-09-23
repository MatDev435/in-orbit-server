import { GoalCompletionsRepository } from '../../repositories/goal-completions-repository'
import { GoalsRepository } from '../../repositories/goals-repository'
import {
  SummariesRepository,
  WeekSummary,
} from '../../repositories/summaries-repository'

interface GetWeekSummaryRequest {
  userId: string
}

interface GetWeekSummaryResponse {
  summary: WeekSummary
}

export class GetWeekSummaryUseCase {
  constructor(private summariesRepository: SummariesRepository) {}

  async execute({
    userId,
  }: GetWeekSummaryRequest): Promise<GetWeekSummaryResponse> {
    const summary = await this.summariesRepository.getWeekSummary(userId)

    return { summary }
  }
}
