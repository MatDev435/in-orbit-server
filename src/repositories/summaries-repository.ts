export type GoalsPerDay = Record<
  string,
  {
    id: string
    title: string
    completedAt: string
  }[]
>

export interface WeekSummary {
  completed: number
  total: number
  goalsPerDay: GoalsPerDay
}

export interface SummariesRepository {
  getWeekSummary(userId: string): Promise<WeekSummary>
}
