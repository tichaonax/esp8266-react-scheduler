import { createAction } from 'redux-actions';

export const SET_NOTIFICATION    = 'SET_NOTIFICATION';
export const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION';

export const setNotification = ({message, feature}) => (
    createAction(
        `${feature} ${SET_NOTIFICATION}`,
        () => message,
        () => ({feature})
    )
)({message, feature});

export const removeNotification = ({notificationId, feature}) => (
    createAction(
        `${feature} ${REMOVE_NOTIFICATION}`,
        () => notificationId,
        () => ({feature})
        )
)({notificationId, feature});
