import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class TypenameInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();

    // Opcional: excluir endpoints como /user/abilities
    if (req.url.includes('/user/abilities')) {
      return next.handle();
    }

    return next.handle().pipe(
      map(data => addTypenameRecursively(data))
    );
  }
}

function addTypenameRecursively(value: any): any {
  if (value == null) return value;
  if (Array.isArray(value)) return value.map(addTypenameRecursively);

  // 🚨 No procesar Date
  if(value instanceof Date) return value;

  if (typeof value !== 'object') return value;

  // Ya tiene __typename → solo procesamos hijos
  if ('__typename' in value) {
    const out = { ...value };
    for (const k of Object.keys(out)) {
      out[k] = addTypenameRecursively(out[k]);
    }
    return out;
  }

  // Inferir typename desde la clase
  const ctor = value.constructor;
  let typename: string | null = null;

  if (ctor) {
    if ((ctor as any).typename) typename = (ctor as any).typename;
    else if ((ctor as any).__typename) typename = (ctor as any).__typename;
    else if (ctor.name && ctor.name !== 'Object') {
      typename = ctor.name.replace(/(Entity|Dto)$/, '').toLowerCase();
    }
  }

  const out = { ...value };
  if (typename) out.__typename = typename;

  for (const k of Object.keys(out)) {
    out[k] = addTypenameRecursively(out[k]);
  }

  return out;
}
