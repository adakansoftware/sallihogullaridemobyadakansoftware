import path from 'path'
import type { z } from 'zod'
import { env } from './env.ts'
import { mutateMessages, mutateProjects, mutateSettings, readMessages, readProjects, readSettings, writeMessages, writeProjects, writeSettings, type AdminMessage, type Project, type SiteSettings } from './store.ts'
import {
  PostgresFleetRepository,
  PostgresMessageRepository,
  PostgresProjectRepository,
  PostgresSettingsRepository,
} from './postgres-content-repository.ts'
import { readJsonFileWithBackup, restorePrimaryJsonFile, writeJsonFileAtomic } from './file-storage.ts'
import { fleetContentSchema } from './validation.ts'

export type FleetContent = z.infer<typeof fleetContentSchema>

export interface FleetRepository {
  get(): Promise<FleetContent>
  save(content: FleetContent): Promise<void>
}

export interface ProjectRepository {
  list(): Promise<Project[]>
  save(projects: Project[]): Promise<void>
  findById(id: string): Promise<Project | null>
  findBySlug(slug: string): Promise<Project | null>
  mutate<T>(updater: (projects: Project[]) => Promise<{ projects: Project[]; result: T }> | { projects: Project[]; result: T }): Promise<T>
}

export interface MessageRepository {
  list(): Promise<AdminMessage[]>
  save(messages: AdminMessage[]): Promise<void>
  mutate<T>(updater: (messages: AdminMessage[]) => Promise<{ messages: AdminMessage[]; result: T }> | { messages: AdminMessage[]; result: T }): Promise<T>
}

export interface SettingsRepository {
  get(): Promise<SiteSettings>
  save(settings: SiteSettings): Promise<void>
  mutate<T>(updater: (settings: SiteSettings) => Promise<{ settings: SiteSettings; result: T }> | { settings: SiteSettings; result: T }): Promise<T>
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

  mutate<T>(updater: (projects: Project[]) => Promise<{ projects: Project[]; result: T }> | { projects: Project[]; result: T }) {
    return mutateProjects(updater)
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

  mutate<T>(updater: (settings: SiteSettings) => Promise<{ settings: SiteSettings; result: T }> | { settings: SiteSettings; result: T }) {
    return mutateSettings(updater)
  }
}

const fleetFile = path.join(/*turbopackIgnore: true*/ process.cwd(), 'data', 'fleet.json')
const defaultFleetContent: FleetContent = { stats: [], items: [] }

class FileFleetRepository implements FleetRepository {
  async get() {
    const parsed = await readJsonFileWithBackup(fleetFile, fleetContentSchema, defaultFleetContent)

    if (parsed.source !== 'primary') {
      await restorePrimaryJsonFile(fleetFile, parsed.data)
    }

    return parsed.data
  }

  async save(content: FleetContent) {
    await writeJsonFileAtomic(fleetFile, fleetContentSchema.parse(content))
  }
}

const fileProjectRepository: ProjectRepository = new FileProjectRepository()
const fileMessageRepository: MessageRepository = new FileMessageRepository()
const fileSettingsRepository: SettingsRepository = new FileSettingsRepository()
const fileFleetRepository: FleetRepository = new FileFleetRepository()

const postgresProjectRepository: ProjectRepository = new PostgresProjectRepository()
const postgresMessageRepository: MessageRepository = new PostgresMessageRepository()
const postgresSettingsRepository: SettingsRepository = new PostgresSettingsRepository()
const postgresFleetRepository: FleetRepository = new PostgresFleetRepository()

export function getProjectRepository() {
  return env.CONTENT_STORE === 'postgres' ? postgresProjectRepository : fileProjectRepository
}

export function getMessageRepository() {
  return env.CONTENT_STORE === 'postgres' ? postgresMessageRepository : fileMessageRepository
}

export function getSettingsRepository() {
  return env.CONTENT_STORE === 'postgres' ? postgresSettingsRepository : fileSettingsRepository
}

export function getFleetRepository() {
  return env.CONTENT_STORE === 'postgres' ? postgresFleetRepository : fileFleetRepository
}

export function getContentStoreDriver() {
  return env.CONTENT_STORE
}
