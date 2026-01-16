export type Level = 'error' | 'warning' | 'info' | 'debug'

const levelIdx: Level[] = [
  'debug',
  'info',
  'warning',
  'error'
]

type Param = string | number

export default class Logger {
  private activeLevelIdx: number
  constructor(private level: Level) {
    this.activeLevelIdx = levelIdx.indexOf(level)
  }

  isActive(level: Level) {
    return levelIdx.indexOf(level) >= this.activeLevelIdx
  }
  paramToString(p: Param | undefined): string | undefined {
    if (!p) {
      return
    }
    if (typeof p === 'number') {
      return p.toString()
    }
    if (typeof p === 'object') {
      return JSON.stringify(p)
    }
    return p
  }
  format(message: string, ...params: Param[]) {
    return message.replace(/{(\d+)}/g, (match, number) => this.paramToString(params[number]) || match)
  }
  log(f: Console['log'], prefix: string, level: Level, message: string, ...params: Param[]) {
    if (this.isActive(level)) {
      f(`${prefix}: ${this.format(message, ...params)}`)
    }
  }

  debug(message: string, ...params: Param[]) {
    this.log(console.debug, 'DEBUG', 'debug', message, ...params)
  }

  info(message: string, ...params: Param[]) {
    this.log(console.info, 'INFO', 'info', message, ...params)
  }

  warn(message: string, ...params: Param[]) {
    this.log(console.warn, 'WARNING', 'warning', message, ...params)
  }

  error(message: string, ...params: Param[]) {
    this.log(console.error, 'ERROR', 'error', message, ...params)
  }
}