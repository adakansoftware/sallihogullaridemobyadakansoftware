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
  const now = Date.now()
  const duplicateWindowMs = 10 * 60 * 1000
  const fingerprint = [
    normalizeForSpamCheck(input.name),
    normalizeForSpamCheck(input.phone),
    normalizeForSpamCheck(input.email),
    normalizeForSpamCheck(input.subject),
    normalizeForSpamCheck(input.message),
  ].join('|')

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

  return repository.mutate((messages) => {
    const hasRecentDuplicate = messages.some((existingMessage) => {
      const createdAt = new Date(existingMessage.createdAt).getTime()
      if (!Number.isFinite(createdAt) || now - createdAt > duplicateWindowMs) return false

      const candidate = [
        normalizeForSpamCheck(existingMessage.name),
        normalizeForSpamCheck(existingMessage.phone),
        normalizeForSpamCheck(existingMessage.email),
        normalizeForSpamCheck(existingMessage.subject),
        normalizeForSpamCheck(existingMessage.message),
      ].join('|')

      return candidate === fingerprint
    })

    if (hasRecentDuplicate) {
      throw new ApiError(429, 'Benzer bir talep kisa sure once alindi. Lutfen biraz sonra tekrar deneyin.')
    }

    return {
      messages: [item, ...messages],
      result: item,
    }
  })
}

export async function updateMessageReadState(id: string, isRead: boolean) {
  const repository = getMessageRepository()
  return repository.mutate((messages) => {
    const index = messages.findIndex((item) => item.id === id)
    if (index === -1) {
      return { messages, result: null }
    }

    const nextMessage = {
      ...messages[index],
      isRead,
    }

    const nextMessages = [...messages]
    nextMessages[index] = nextMessage
    return { messages: nextMessages, result: nextMessage }
  })
}

export async function deleteMessage(id: string) {
  const repository = getMessageRepository()
  return repository.mutate((messages) => {
    const nextMessages = messages.filter((item) => item.id !== id)
    return {
      messages: nextMessages,
      result: nextMessages.length !== messages.length,
    }
  })
}
