export const SET_LOADER = 'Set Loader';
export const REMOVE_LOADER = 'Remove Loader';

export interface Loader {
    loading: boolean;
    success: boolean;
    feature: string;
    errorMessage?: string;
}

export interface SetLoaderAction {
    type: typeof SET_LOADER;
    payload: Loader;
    meta?: object;
}

export interface RemoveLoaderAction {
    type: typeof REMOVE_LOADER;
    meta?: object;
}

  export type LoaderActionTypes = 
    | SetLoaderAction
    | RemoveLoaderAction;
  
  export type LoaderActions = LoaderActionTypes;
