import { createId } from '@paralleldrive/cuid2'
import { Goal, NewGoal } from '../../src/db/schema'
import { faker } from '@faker-js/faker'

export function makeGoal(override: Partial<NewGoal> = {}) {
  const newGoal = {
    id: createId(),
    ownerId: createId(),
    title: faker.lorem.sentence(),
    desiredWeeklyFrequency: Math.floor(Math.random() * 7) + 1,
    createdAt: new Date(),
    ...override,
  } as Goal

  return newGoal
}
