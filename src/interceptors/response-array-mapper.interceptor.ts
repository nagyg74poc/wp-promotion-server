import { ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ObjectMapper } from '../mappers/object.mapper';

export interface Response<T> {
  data: T;
}

@Injectable()
export class ResponseArrayMapperInterceptor<T> implements NestInterceptor<T, Response<T>[]> {
  constructor(private readonly mapModel: any) {
  }

  intercept(
    context: ExecutionContext,
    call$: Observable<T>,
  ): Observable<Response<T>[]> {
    return call$.pipe(map(data => this.mapArray(data)));
  }

  private mapArray<T>(data): T[] {
    const result = ObjectMapper.mapArray<T>(data, this.mapModel);
    return result;
  }
}
