import produce from 'immer'
import { createReducer } from '../createReducer';
import {SET_CHANNEL_SCHEDULE} from "../types/channel";

export const channelReducer = createReducer(
    {},
    {
        [SET_CHANNEL_SCHEDULE](state, {payload, meta}) {
            return produce(state, draft => {
                switch (meta.channel) {
                    case 1:
                            draft.channelOne = payload;         
                        break;
                    case 2:
                            draft.channelTwo = payload;         
                        break;
                    case 3:
                            draft.channelThree = payload;         
                        break;
                    case 4:
                            draft.channelFour = payload;         
                        break;
                    default:
                            draft.channelOne = payload;
                        break;
                };
            });
        },
    },
);

export default channelReducer;