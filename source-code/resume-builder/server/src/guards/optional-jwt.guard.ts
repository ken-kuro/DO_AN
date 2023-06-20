import { ExecutionContext, Injectable } from '@nestjs/common';

import { JwtAuthGuard } from './jwt.guard';

@Injectable()
export class OptionalJwtAuthGuard extends JwtAuthGuard {
  canActivate(context: ExecutionContext): boolean {
    try {
      return super.canActivate(context);
    } catch {
      // Do nothing when the authentication fails, making it optional
      return true;
    }
  }
}
