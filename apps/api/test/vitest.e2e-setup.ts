import { config } from 'dotenv'
import { resolve } from 'node:path'

const envPath = resolve(process.cwd(), '../../env/.env.e2e')

config({ path: envPath })

process.env.NODE_ENV = process.env.NODE_ENV ?? 'test'
