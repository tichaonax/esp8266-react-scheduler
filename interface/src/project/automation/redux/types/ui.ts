import { Feature } from "./common";

export const SET_LOADER = 'Set Loader';
export const REMOVE_LOADER = 'Remove Loader';

export interface Loader {
    loading: boolean;
    success: boolean;
    feature?: string;
    errorMessage?: string;
}

export interface SetLoaderAction {
    type: string;
    payload: Loader;
    meta: Feature;
}

export interface RemoveLoaderAction {
    type: string;
    payload: undefined,
    meta: Feature;
}

export type RemoveLoaderType = (feature: string) => void;
export type SetLoaderType = (loader: Loader) => void;

  export type LoaderActions = SetLoaderAction | RemoveLoaderAction;

  export type LoaderActionsTypes = SetLoaderType | RemoveLoaderType;
