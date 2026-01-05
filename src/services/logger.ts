type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
    timestamp: string
    level: LogLevel
    message: string
    data?: unknown
    error?: {
        message: string
        stack?: string
    }
}

class Logger {
    private logs: LogEntry[] = []
    private maxLogs = 100

    private log(level: LogLevel, message: string, data?: unknown, error?: Error) {
        const entry: LogEntry = {
            timestamp: new Date().toISOString(),
            level,
            message,
            data,
            ...(error && {
                error: {
                    message: error.message,
                    stack: error.stack,
                },
            }),
        }

        // Store locally
        this.logs.push(entry)
        if (this.logs.length > this.maxLogs) {
            this.logs = this.logs.slice(-this.maxLogs)
        }

        // Console output
        const isDev = import.meta.env.VITE_ENABLE_CONSOLE_LOGS === 'true'
        if (isDev || level === 'error' || level === 'warn') {
            const style = this.getConsoleStyle(level)
            console.log(
                `%c[${level.toUpperCase()}] ${message}`,
                style,
                data,
                error
            )
        }

        // Send to error tracking service for errors
        if (level === 'error' && import.meta.env.VITE_ENABLE_SENTRY === 'true') {
            this.sendToErrorTracking(entry)
        }
    }

    private getConsoleStyle(level: LogLevel): string {
        const styles: Record<LogLevel, string> = {
            debug: 'color: #666; font-weight: normal',
            info: 'color: #0066cc; font-weight: normal',
            warn: 'color: #ff9900; font-weight: bold',
            error: 'color: #cc0000; font-weight: bold',
        }
        return styles[level]
    }

    private sendToErrorTracking(entry: LogEntry) {
        // Implement Sentry or other error tracking service here
        // Example: Sentry.captureException(entry.error)
        if (entry.error) {
            console.log('Error tracking:', entry);
        }
    }

    debug(message: string, data?: unknown) {
        this.log('debug', message, data)
    }

    info(message: string, data?: unknown) {
        this.log('info', message, data)
    }

    warn(message: string, data?: unknown) {
        this.log('warn', message, data)
    }

    error(message: string, error?: Error | unknown, data?: unknown) {
        const err = error instanceof Error ? error : new Error(String(error))
        this.log('error', message, data, err)
    }

    // Get all logs
    getLogs(): LogEntry[] {
        return [...this.logs]
    }

    // Clear logs
    clear() {
        this.logs = []
    }

    // Export logs for debugging
    export(): string {
        return JSON.stringify(this.logs, null, 2)
    }

    // Create scoped logger
    createScope(scope: string) {
        return {
            debug: (msg: string, data?: unknown) => this.debug(`[${scope}] ${msg}`, data),
            info: (msg: string, data?: unknown) => this.info(`[${scope}] ${msg}`, data),
            warn: (msg: string, data?: unknown) => this.warn(`[${scope}] ${msg}`, data),
            error: (msg: string, err?: Error, data?: unknown) =>
                this.error(`[${scope}] ${msg}`, err, data),
        }
    }
}

// Export singleton instance
export const logger = new Logger()
export default logger
