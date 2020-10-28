import {AxiosResponse} from "axios";
import {Observable} from "rxjs";
import {tap} from "rxjs/operators";
import {ProfileInterface} from "../module/accounts.module";
import {
  ApiServiceInterface,
  StoreServiceInterface
} from "react-miniverse";
import {
  CookiesServiceInterface,
  StoreCacheInterface
} from "react-miniverse/src/interfaces";
import {PaginatedResources} from "../module/PaginatedResources";

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
    private cookiesService: CookiesServiceInterface
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
        tap((data: any) => {
          this.cookiesService.set('token', data.access_token)
        })
      );
  }

  public profile<T = ProfileInterface>(): StoreCacheInterface<T> {
    return this.store.cache(
      this.namespace,
      'profile',
      undefined,
      this.api.get(this.getBaseUrl('/profile'))
    );
  }

  public getAccounts<T = PaginatedResources<ProfileInterface>>(params?: RequestParamsInterface): StoreCacheInterface<T> {

    return this.store.cache(
      this.namespace,
      'accounts',
      params,
      this.api.get(this.getBaseUrl('/accounts'), params)
    );
  }

  private getBaseUrl(path?: string): string {
    if (process.env.NEXT_PUBLIC_API_ACCOUNTS) {
      return `${process.env.NEXT_PUBLIC_API_ACCOUNTS}${path}`;
    }

    throw new Error(`BaseUrl not set for service ${this.constructor.name}`);
  }
}
