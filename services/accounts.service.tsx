import { AxiosResponse } from 'axios';
import {
  ApiServiceInterface,
  StoreServiceInterface,
} from 'react-miniverse';
import {
  CookiesServiceInterface,
  StoreCacheInterface,
} from 'react-miniverse/src/interfaces';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ProfileInterface, RolesEntity } from '../module/accounts.module';
import { EventsServiceInterface } from '../module/events.module';
import { PaginatedResources } from '../module/PaginatedResources';

export type ExpectedRoleObject = {[key: string]: string};

export type ExpectedRoleType = Array<string| ExpectedRoleObject>;

interface AccountLoginInterface {
  username: string;
  password: string;
}

interface RequestParamsInterface {
  [key: string]: any;
}

export default class AccountsService {
  private namespace = 'AccountsService';

  constructor(
    private api: ApiServiceInterface,
    private store: StoreServiceInterface,
    private cookiesService: CookiesServiceInterface,
    // eslint-disable-next-line no-empty-function
  ) {
  }

  public logout() {
    this.cookiesService.remove('token');
    this.store.clear(this.namespace, 'profile');
    this.store.set(this.namespace, 'profile', undefined, null);
  }

  public login(data: AccountLoginInterface): Observable<AxiosResponse> {
    return this.api.post(this.getBaseUrl('/login'), data)
      .pipe(
        tap((next: any) => {
          this.cookiesService.set('token', next.access_token);
        }),
      );
  }

  public profile<T = ProfileInterface>(): StoreCacheInterface<T> {
    return this.store.cache(
      this.namespace,
      'profile',
      undefined,
      this.api.get(this.getBaseUrl('/profile')),
    );
  }

  public hasAccess(expectedRole: ExpectedRoleType): boolean {
    return expectedRole.reduce((previous: boolean, current: string| ExpectedRoleObject) => {
      if (!previous) {
        return false;
      }

      if (typeof current === 'string') {
        return this.accessPerRole(current, 'read');
      }

      const [role] = Object.keys(current);
      return this.accessPerRole(role, current[role]);
    }, true);
  }

  private accessPerRole(role: string, method: string) {
    const profile: ProfileInterface = this.store.getStatic(this.namespace, 'profile');
    if (!profile?.roles) {
      return false;
    }

    const found = profile.roles.find((item) => item.name === role);

    if (!found) {
      return false;
    }

    switch (method) {
      case 'read':
        return found.pivot.req_get;
      case 'write':
        return found.pivot.req_post;
      case 'update':
        return found.pivot.req_put;
      case 'delete':
        return found.pivot.req_delete;
      default: return false;
    }
  }

  public getAccounts<T = PaginatedResources<ProfileInterface>>(params?: RequestParamsInterface): StoreCacheInterface<T> {
    return this.store.cache(
      this.namespace,
      'accounts',
      params,
      this.api.get(this.getBaseUrl('/accounts'), params),
    );
  }

  public getAccount<T = ProfileInterface>(id: string | number, params?: RequestParamsInterface): StoreCacheInterface<T> {
    return this.store.cache(
      this.namespace,
      'account',
      { id, ...params },
      this.api.get(this.getBaseUrl('/accounts', id), params),
    );
  }

  public updateAccount(id: any, data: RequestParamsInterface): Observable<AxiosResponse> {
    return this.api.put(this.getBaseUrl('/accounts', id), data);
  }

  public updateAccountRole(id: any, data: any) {
    return this.api.post(this.getBaseUrl('/accounts', id, 'role'), data);
  }

  public createAccount(data: RequestParamsInterface): Observable<AxiosResponse> {
    return this.api.post(this.getBaseUrl('/accounts'), data);
  }

  public getRoles<T = PaginatedResources<RolesEntity>>(params?: RequestParamsInterface): StoreCacheInterface<T> {
    return this.store.cache(
      this.namespace,
      'roles',
      params,
      this.api.get(this.getBaseUrl('/roles'), params),
    );
  }

  public getRole<T = RolesEntity>(id: string | number, params?: RequestParamsInterface): StoreCacheInterface<T> {
    return this.store.cache(
      this.namespace,
      'role',
      { id, ...params },
      this.api.get(this.getBaseUrl('/roles', id), params),
    );
  }

  public deleteRole(id: string | number) {
    return this.api.delete(this.getBaseUrl('/roles', id));
  }

  public getEvents<T = PaginatedResources<EventsServiceInterface>>(params?: RequestParamsInterface): StoreCacheInterface<T> {
    return this.store.cache(
      this.namespace,
      'events',
      params,
      this.api.get(this.getBaseUrl('/events'), params),
    );
  }

  public updateRole(id: any, data: RequestParamsInterface): Observable<AxiosResponse> {
    return this.api.put(this.getBaseUrl('/roles', id), data);
  }

  public createRole(data: RequestParamsInterface): Observable<AxiosResponse> {
    return this.api.post(this.getBaseUrl('/roles'), data);
  }

  private getBaseUrl(path?: string, id?: string | number, action?: string): string {
    if (process.env.NEXT_PUBLIC_API_ACCOUNTS) {
      if (id && action) {
        return `${process.env.NEXT_PUBLIC_API_ACCOUNTS}${path}/${id}/${action}`;
      }

      if (id) {
        return `${process.env.NEXT_PUBLIC_API_ACCOUNTS}${path}/${id}`;
      }

      return `${process.env.NEXT_PUBLIC_API_ACCOUNTS}${path}`;
    }

    throw new Error(`BaseUrl not set for service ${this.constructor.name}`);
  }
}
