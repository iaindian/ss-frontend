export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

const levelOrder: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40
}

const envLevel = (process.env.NEXT_PUBLIC_LOG_LEVEL as LogLevel) || 'info'
const enableToasts = process.env.NEXT_PUBLIC_ENABLE_DEBUG_TOASTS === 'true'

let toast: ((opts: { title: string; description?: string }) => void) | null = null

export function bindToast(fn: (opts: { title: string; description?: string }) => void) {
  toast = fn
}

function shouldLog(level: LogLevel) {
  return levelOrder[level] >= levelOrder[envLevel]
}

function fmt(level: LogLevel, msg: string, ctx?: Record<string, any>) {
  const ts = new Date().toISOString()
  const base = `[AI-IMG][${level.toUpperCase()}][${ts}] ${msg}`
  return ctx ? [base, ctx] : [base]
}

export const logger = {
  debug: (msg: string, ctx?: Record<string, any>) => {
    if (!shouldLog('debug')) return
    console.debug(...fmt('debug', msg, ctx))
    if (enableToasts && toast) toast({ title: '🐛 ' + msg })
  },
  info: (msg: string, ctx?: Record<string, any>) => {
    if (!shouldLog('info')) return
    console.info(...fmt('info', msg, ctx))
  },
  warn: (msg: string, ctx?: Record<string, any>) => {
    if (!shouldLog('warn')) return
    console.warn(...fmt('warn', msg, ctx))
  },
  error: (msg: string, ctx?: Record<string, any>) => {
    console.error(...fmt('error', msg, ctx))
    if (enableToasts && toast) toast({ title: '❌ ' + msg })
  },
  time: async function <T>(label: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now()
    try {
      const res = await fn()
      const ms = Math.round(performance.now() - start)
      logger.debug(`${label} done`, { ms })
      return res
    } catch (e: any) {
      const ms = Math.round(performance.now() - start)
      logger.error(`${label} failed`, { ms, error: e?.message })
      throw e
    }
  }
}
