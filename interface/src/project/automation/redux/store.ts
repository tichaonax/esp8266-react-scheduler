import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import { dispatcherMiddleware } from './middleware/routing/dispatcher';
import { channelMiddleware } from './middleware/feature/channel';

import { actionSplitterMiddleware } from "./middleware/core/actionSplitter";
import { apiMiddleware } from './middleware/core/api';
import { notificationMiddleware} from "./middleware/core/notification";

import { uiReducer } from "./reducers/uiReducer";
import { notificationsReducer } from "./reducers/notificationReducer";
import { channelReducer } from './reducers/channelReducer';

const rootReducer = combineReducers({
  ui: uiReducer,
  notification: notificationsReducer,
  channels: channelReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

// create the feature middleware array
const routingMiddleware = [
    dispatcherMiddleware,
];

// create the feature middleware array
const featureMiddleware = [
  channelMiddleware,
];

// create the core middleware array in the order
// the actions are forwarded from one to the other
const coreMiddleware = [
  actionSplitterMiddleware,
  apiMiddleware,
  notificationMiddleware,
];
const composeEnhancers = composeWithDevTools({
  // Specify here name, actionsBlacklist, actionsCreators and other options
});

const enhancer = composeEnhancers(
    applyMiddleware(
        ...routingMiddleware,
        ...featureMiddleware,
        ...coreMiddleware,
        ));

// create and configure the store
export const store = createStore(rootReducer, {}, enhancer);
