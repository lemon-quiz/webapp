import {
  ApiServiceInterface,
  CookiesServiceInterface, StoreServiceInterface,
} from 'react-miniverse/src/interfaces';

import AccountsService from '../services/accounts.service';
import QuizzesService from '../services/quizzes.service';
import SnackbarService from '../services/snackbar.service';

export interface ServicesModule {
  apiInstance: ApiServiceInterface;
  cookiesService: CookiesServiceInterface;
  accountsService: AccountsService;
  quizzesService: QuizzesService;
  snackbarService: SnackbarService;
  storeService: StoreServiceInterface;
  profile?: any;

  [key: string]: any;
}
