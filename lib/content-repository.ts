import { env } from '@/lib/env'
import { mutateMessages, readMessages, readProjects, readSettings, writeMessages, writeProjects, writeSettings, type AdminMessage, type Project, type SiteSettings } from '@/lib/store'
import {
  PostgresMessageRepository,
  PostgresProjectRepository,
  PostgresSettingsRepository,
} from '@/lib/postgres-content-repository'

export interface ProjectRepository {
  list(): Promise<Project[]>
  save(projects: Project[]): Promise<void>
  findById(id: string): Promise<Project | null>
  findBySlug(slug: string): Promise<Project | null>
}

export interface MessageRepository {
  list(): Promise<AdminMessage[]>
  save(messages: AdminMessage[]): Promise<void>
  mutate<T>(updater: (messages: AdminMessage[]) => Promise<{ messages: AdminMessage[]; result: T }> | { messages: AdminMessage[]; result: T }): Promise<T>
}

export interface SettingsRepository {
  get(): Promise<SiteSettings>
  save(settings: SiteSettings): Promise<void>
}

class FileProjectRepository implements ProjectRepository {
  list() {
    return readProjects()
  }

  save(projects: Project[]) {
    return writeProjects(projects)
  }

  async findById(id: string) {
    const projects = await readProjects()
    return projects.find((project) => project.id === id) || null
  }

  async findBySlug(slug: string) {
    const projects = await readProjects()
    return projects.find((project) => project.slug === slug) || null
  }
}

class FileMessageRepository implements MessageRepository {
  list() {
    return readMessages()
  }

  save(messages: AdminMessage[]) {
    return writeMessages(messages)
  }

  mutate<T>(updater: (messages: AdminMessage[]) => Promise<{ messages: AdminMessage[]; result: T }> | { messages: AdminMessage[]; result: T }) {
    return mutateMessages(updater)
  }
}

class FileSettingsRepository implements SettingsRepository {
  get() {
    return readSettings()
  }

  save(settings: SiteSettings) {
    return writeSettings(settings)
  }
}

const fileProjectRepository: ProjectRepository = new FileProjectRepository()
const fileMessageRepository: MessageRepository = new FileMessageRepository()
const fileSettingsRepository: SettingsRepository = new FileSettingsRepository()

const postgresProjectRepository: ProjectRepository = new PostgresProjectRepository()
const postgresMessageRepository: MessageRepository = new PostgresMessageRepository()
const postgresSettingsRepository: SettingsRepository = new PostgresSettingsRepository()

export function getProjectRepository() {
  return env.CONTENT_STORE === 'postgres' ? postgresProjectRepository : fileProjectRepository
}

export function getMessageRepository() {
  return env.CONTENT_STORE === 'postgres' ? postgresMessageRepository : fileMessageRepository
}

export function getSettingsRepository() {
  return env.CONTENT_STORE === 'postgres' ? postgresSettingsRepository : fileSettingsRepository
}

export function getContentStoreDriver() {
  return env.CONTENT_STORE
}
