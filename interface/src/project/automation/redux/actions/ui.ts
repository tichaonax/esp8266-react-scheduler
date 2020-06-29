import { createAction } from 'redux-actions';

import {SET_LOADER, REMOVE_LOADER, Loader} from '../types/ui';

export const setLoader = ({loading, success, feature, errorMessage} : Loader) => (
    createAction(
        `${feature} ${SET_LOADER}`,
        () => ({loading, success, errorMessage}),
        () => ({feature})
    )
)({loading, success, feature, errorMessage});

export const removeLoader = (feature: string) => (
    createAction(
        `${feature} ${REMOVE_LOADER}`,
        () => undefined,
        () => ({feature})
    )
)(feature);