import { AxiosResponse } from 'axios';
import {
  ApiServiceInterface,
  StoreServiceInterface,
} from 'react-miniverse';
import { StoreCacheInterface } from 'react-miniverse/src/interfaces';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PaginatedResources } from '../module/PaginatedResources';
import { ItemsEntity, QuizEntity } from '../module/quizzes.module';

interface RequestParamsInterface {
  [key: string]: any;
}

export default class QuizzesService {
  private namespace = 'QuizzesService';

  constructor(
    private api: ApiServiceInterface,
    private store: StoreServiceInterface,
    // eslint-disable-next-line no-empty-function
  ) {
  }

  public getQuizzes<T = PaginatedResources<QuizEntity>>(params?: RequestParamsInterface): StoreCacheInterface<T> {
    return this.store.cache(
      this.namespace,
      'quizzes',
      params,
      this.api.get(this.getBaseUrl('/quizzes'), params),
    );
  }

  public getQuiz<T = QuizEntity>(id: string | number, params?: RequestParamsInterface): StoreCacheInterface<T> {
    return this.store.cache(
      this.namespace,
      'quiz',
      { id, ...params },
      this.api.get(this.getBaseUrl('/quizzes', id), params).pipe(
        map((result: QuizEntity) => {
          const items = (result.items || []).map((item: ItemsEntity) => {
            const group = String(item.group);
            return { ...item, group };
          });
          return { ...result, items };
        }),
      ),
    );
  }

  public updateQuiz(id: any, data: RequestParamsInterface): Observable<AxiosResponse> {
    return this.api.put(this.getBaseUrl('/quizzes', id), data);
  }

  public createQuiz(data: RequestParamsInterface): Observable<AxiosResponse> {
    return this.api.post(this.getBaseUrl('/quizzes'), data);
  }

  private getBaseUrl(path?: string, id?: string | number, action?: string): string {
    if (process.env.NEXT_PUBLIC_API_QUIZZES) {
      if (id && action) {
        return `${process.env.NEXT_PUBLIC_API_QUIZZES}${path}/${id}/${action}`;
      }

      if (id) {
        return `${process.env.NEXT_PUBLIC_API_QUIZZES}${path}/${id}`;
      }

      return `${process.env.NEXT_PUBLIC_API_QUIZZES}${path}`;
    }

    throw new Error(`BaseUrl not set for service ${this.constructor.name}`);
  }
}
