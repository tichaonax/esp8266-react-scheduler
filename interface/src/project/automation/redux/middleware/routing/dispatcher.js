/* eslint-disable max-len */
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
            const {
                restChannelRestartEndPoint,
                oldControlPin, controlPin,
                oldHomeAssistantTopicType,
                homeAssistantTopicType,
                enableDateRange,
            } = action.payload;

            const restartScheduleEndPoint = restChannelRestartEndPoint.split('/').pop();

            setTimeout(() => {
                next(reStartChannelSchedule(
                    `${restartScheduleEndPoint}?oldControlPin=${oldControlPin}&controlPin=${controlPin}&oldHomeAssistantTopicType=${oldHomeAssistantTopicType}&homeAssistantTopicType=${homeAssistantTopicType}&enableDateRange=${enableDateRange}`
                    )); }, 5000);
            break;

        default:
            next(action);
            break;
    }
};
