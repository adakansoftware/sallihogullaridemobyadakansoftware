import { ApiError } from '@/lib/api-error'
import { getMessageRepository } from '@/lib/content-repository'
import { makeId } from '@/lib/store'

type MessageInput = {
  name: string
  phone: string
  email: string
  subject: string
  message: string
}

function buildReference(id: string) {
  return id.split('-').at(0)?.toUpperCase() || id.slice(0, 8).toUpperCase()
}

function normalizeForSpamCheck(value: string) {
  return value.trim().replace(/\s+/g, ' ').toLowerCase()
}

export async function listAdminMessages() {
  const messages = await getMessageRepository().list()
  return [...messages].sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
}

export async function submitContactMessage(input: MessageInput) {
  const repository = getMessageRepository()
  const messages = await repository.list()
  const now = Date.now()
  const duplicateWindowMs = 10 * 60 * 1000
  const fingerprint = [
    normalizeForSpamCheck(input.name),
    normalizeForSpamCheck(input.phone),
    normalizeForSpamCheck(input.email),
    normalizeForSpamCheck(input.subject),
    normalizeForSpamCheck(input.message),
  ].join('|')

  const hasRecentDuplicate = messages.some((item) => {
    const createdAt = new Date(item.createdAt).getTime()
    if (!Number.isFinite(createdAt) || now - createdAt > duplicateWindowMs) return false

    const candidate = [
      normalizeForSpamCheck(item.name),
      normalizeForSpamCheck(item.phone),
      normalizeForSpamCheck(item.email),
      normalizeForSpamCheck(item.subject),
      normalizeForSpamCheck(item.message),
    ].join('|')

    return candidate === fingerprint
  })

  if (hasRecentDuplicate) {
    throw new ApiError(429, 'Benzer bir talep kısa süre önce alındı. Lütfen biraz sonra tekrar deneyin.')
  }

  const id = makeId()
  const item = {
    id,
    reference: buildReference(id),
    name: input.name,
    phone: input.phone,
    email: input.email,
    subject: input.subject,
    message: input.message,
    isRead: false,
    createdAt: new Date(now).toISOString(),
  }

  messages.unshift(item)
  await repository.save(messages)
  return item
}

export async function updateMessageReadState(id: string, isRead: boolean) {
  const repository = getMessageRepository()
  const messages = await repository.list()
  const index = messages.findIndex((item) => item.id === id)
  if (index === -1) return null

  messages[index] = {
    ...messages[index],
    isRead,
  }

  await repository.save(messages)
  return messages[index]
}

export async function deleteMessage(id: string) {
  const repository = getMessageRepository()
  const messages = await repository.list()
  const exists = messages.some((item) => item.id === id)
  if (!exists) return false

  await repository.save(messages.filter((item) => item.id !== id))
  return true
}
