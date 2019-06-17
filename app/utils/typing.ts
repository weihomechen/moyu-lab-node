export interface Response {
  success: boolean
  msg?: string
  code?: string
  data?: any
}

export interface SQLResult {
  success: boolean
  [key: string]: any
}
