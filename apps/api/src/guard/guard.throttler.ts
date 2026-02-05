import { Injectable } from '@nestjs/common'
import { ThrottlerGuard } from '@nestjs/throttler'
import { getClientIp } from '@supercharge/request-ip'

@Injectable()
export class ThrottlerBehindProxyGuard extends ThrottlerGuard {
  // eslint-disable-next-line @typescript-eslint/require-await
  protected override async getTracker(
    req: Record<string, any>,
  ): Promise<string> {
    const throttleIp = getClientIp(req)
    return throttleIp
  }
}
