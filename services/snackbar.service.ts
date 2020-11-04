/* eslint-disable no-underscore-dangle */
import { BehaviorSubject, Observable } from 'rxjs';

interface SnackInterface {
  type: 'error' | 'warning' | 'info' | 'success';
  message: string;
}

export default class SnackbarService {
  private _subject = new BehaviorSubject<SnackInterface | null>(null);

  public get subject(): Observable<SnackInterface | null> {
    return this._subject.asObservable();
  }

  public error(message: string) {
    this._subject.next({ type: 'error', message });
  }

  public warning(message: string) {
    this._subject.next({ type: 'warning', message });
  }

  public info(message: string) {
    this._subject.next({ type: 'info', message });
  }

  public success(message: string) {
    this._subject.next({ type: 'success', message });
  }
}
