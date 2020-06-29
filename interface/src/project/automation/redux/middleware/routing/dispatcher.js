import { SET_CHANNEL_SCHEDULE } from '../../types/channel';
import { reStartChannelSchedule } from '../../actions/channel';

// this routing middleware needs to come earlier than the others that depend on it
export const dispatcherMiddleware = (state) => (next) => (action) => {
    //next(action);
    switch (action.type) {
        case SET_CHANNEL_SCHEDULE:
            //let the action fall through
            next(action);
            // Each time schedule is modified restart the schedule 5 seconds later
            setTimeout(() => { next(reStartChannelSchedule(action.meta.channel)); }, 5000); 
            break;

        default:
            next(action);
            break;
    }
};