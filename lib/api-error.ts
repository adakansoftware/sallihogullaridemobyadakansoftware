export class ApiError extends Error {
  status: number
  exposeMessage: string

  constructor(status: number, exposeMessage: string) {
    super(exposeMessage)
    this.status = status
    this.exposeMessage = exposeMessage
  }
}
