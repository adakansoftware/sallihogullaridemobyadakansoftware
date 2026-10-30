export class ApiError extends Error {
  status: number
  exposeMessage: string
  headers: Headers

  constructor(status: number, exposeMessage: string, headers?: HeadersInit) {
    super(exposeMessage)
    this.status = status
    this.exposeMessage = exposeMessage
    this.headers = new Headers(headers)
  }
}
