import { apiSuccess } from '@/lib/api/response'

export async function GET() {
  return apiSuccess({ status: 'ok', version: '1.0.0' })
}
