import { makeId, readMessages, writeMessages } from '@/lib/store'

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

export async function listAdminMessages() {
  const messages = await readMessages()
  return [...messages].sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
}

export async function submitContactMessage(input: MessageInput) {
  const messages = await readMessages()
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
    createdAt: new Date().toISOString(),
  }

  messages.unshift(item)
  await writeMessages(messages)
  return item
}

export async function updateMessageReadState(id: string, isRead: boolean) {
  const messages = await readMessages()
  const index = messages.findIndex((item) => item.id === id)
  if (index === -1) return null

  messages[index] = {
    ...messages[index],
    isRead,
  }

  await writeMessages(messages)
  return messages[index]
}

export async function deleteMessage(id: string) {
  const messages = await readMessages()
  const exists = messages.some((item) => item.id === id)
  if (!exists) return false

  await writeMessages(messages.filter((item) => item.id !== id))
  return true
}
