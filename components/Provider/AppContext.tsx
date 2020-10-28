import * as React from 'react';
import AccountsService from "../../services/accounts.service";
import {
  ApiServiceInterface,
  CookiesServiceInterface, StoreServiceInterface
} from "react-miniverse/src/interfaces";

export interface AppContextInterface {
  apiInstance: ApiServiceInterface;
  cookiesService: CookiesServiceInterface;
  accountsService: AccountsService;
  storeService: StoreServiceInterface;
  profile?: any;

  [key: string]: any;
}

const AppContext = React.createContext<any>({});

export function withAppContext<T>(Component: React.ComponentType<T>) {
  return (props: any) => {
    return (<AppContext.Consumer>{(context) => (
      <Component context={context} {...props} />)}</AppContext.Consumer>);
  };
}

export const AppProvider = AppContext.Provider;
export const AppConsumer = AppContext.Consumer;
export default AppContext;

