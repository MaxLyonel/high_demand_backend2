// selected-role.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AddInfoMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const selectedRoleId = req.headers['x-selected-role-id'];
    const institutionId = req.headers['x-institution-id'];

    req['selectedRoleId'] = selectedRoleId ? Number(selectedRoleId) : null;
    req['institutionId'] = institutionId ? Number(institutionId) : null;

    next();
  }
}
