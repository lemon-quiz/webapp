import {AxiosError, AxiosResponse} from "axios";
import {FORM_ERROR} from "final-form";
import {Observable} from "rxjs";

type resolveType = (res?: any) => void;
type callbackType = (res?: any) => void;


export class FormResponse {

  static handleRequest(res: AxiosResponse, resolve: resolveType, callback?: resolveType): void {
    if (res.statusText !== 'ok') {
      if (typeof res.data.errors !== 'undefined') {
        resolve(res.data.errors);
        return;
      }
    }

    if (typeof callback === 'function') {
      callback(res);
    }

    resolve();
  }

  static handleError(res: AxiosError, resolve: resolveType, callback?: callbackType): void {

    if (typeof callback === 'function') {
      callback(res);
    }

    if (typeof res.response !== 'undefined') {
      const {response: {data}} = res;
      if (typeof data === 'string') {
        resolve({[FORM_ERROR]: data});
        return;
      }

      if (typeof data.error !== 'undefined') {
        resolve(data.error);
        return;
      }

      if (typeof data.errors !== 'undefined') {
        resolve(data.errors);
        return;
      }
      resolve(data);
      return
    }

    resolve(res);
  }

  static finalFormResponse<T = any>(promise: Observable<AxiosResponse<T>>, callback?: callbackType): Promise<T> {

    return new Promise(resolve => {
      promise
        .toPromise()
        .then((res: AxiosResponse) => this.handleRequest(res, resolve, callback))
        .catch((res: AxiosError) => this.handleError(res, resolve, callback));
    });
  }
}
