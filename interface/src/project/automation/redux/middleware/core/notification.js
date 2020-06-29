import {removeNotification, SET_NOTIFICATION, setNotification} from "../../actions/notification";

export const notificationMiddleware = () => (next) => (action) => {
  //note the use of includes as the actions are feature prepended
  if (action.type && action.type.includes(SET_NOTIFICATION)) {
    const {payload, meta} = action;
    const id = new Date().getMilliseconds();

    // enrich the original payload with an id
    const notification = {
      feature: meta.feature,
      id,
      massage: payload
    };

    // fire a new action with the enriched payload
    next(setNotification({message: notification, feature: meta.feature}));

    // dispatch a delayed clear action
    setTimeout(() => {
      next(removeNotification({notificationId: id, feature: meta.feature}))
    }, 120000)

  } else {
    next(action);
  }
};