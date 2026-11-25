export class TestLogger {
  private readonly context: string;

  constructor(context: string) {
    this.context = context;
  }

  info(message: string, meta?: Record<string, unknown>) {
    const timestamp = new Date().toISOString();
    const extra = meta ? ` ${JSON.stringify(meta)}` : '';
    console.log(`[${timestamp}] [INFO] [${this.context}] ${message}${extra}`);
  }

  warn(message: string, meta?: Record<string, unknown>) {
    const timestamp = new Date().toISOString();
    const extra = meta ? ` ${JSON.stringify(meta)}` : '';
    console.warn(`[${timestamp}] [WARN] [${this.context}] ${message}${extra}`);
  }

  error(message: string, meta?: Record<string, unknown>) {
    const timestamp = new Date().toISOString();
    const extra = meta ? ` ${JSON.stringify(meta)}` : '';
    console.error(`[${timestamp}] [ERROR] [${this.context}] ${message}${extra}`);
  }
}
