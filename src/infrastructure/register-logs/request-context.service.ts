// src/common/request-context/request-context.service.ts
import { Injectable, Scope } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { Observable } from 'rxjs';

@Injectable({ scope: Scope.DEFAULT })
export class RequestContextService {
  private readonly als = new AsyncLocalStorage<Map<string, any>>();

  // Para código sin retorno
  run(context: Map<string, any>, callback: () => void) {
    this.als.run(context, callback);
  }

  // Para interceptors que devuelven Observable
  runWithObservable<T>(context: Map<string, any>, callback: () => Observable<T>): Observable<T> {
    return this.als.run(context, callback);
  }

  set(key: string, value: any) {
    const store = this.als.getStore();
    if (store) store.set(key, value);
  }

  get<T>(key: string): T | undefined {
    const store = this.als.getStore();
    return store?.get(key);
  }
}
