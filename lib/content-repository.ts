import {
  readMessages,
  readProjects,
  readSettings,
  writeMessages,
  writeProjects,
  writeSettings,
  type AdminMessage,
  type Project,
  type SiteSettings,
} from '@/lib/store'

export interface ProjectRepository {
  list(): Promise<Project[]>
  save(projects: Project[]): Promise<void>
}

export interface MessageRepository {
  list(): Promise<AdminMessage[]>
  save(messages: AdminMessage[]): Promise<void>
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
}

class FileMessageRepository implements MessageRepository {
  list() {
    return readMessages()
  }

  save(messages: AdminMessage[]) {
    return writeMessages(messages)
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

const projectRepository: ProjectRepository = new FileProjectRepository()
const messageRepository: MessageRepository = new FileMessageRepository()
const settingsRepository: SettingsRepository = new FileSettingsRepository()

export function getProjectRepository() {
  return projectRepository
}

export function getMessageRepository() {
  return messageRepository
}

export function getSettingsRepository() {
  return settingsRepository
}
