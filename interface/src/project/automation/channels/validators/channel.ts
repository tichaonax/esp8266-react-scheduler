import Schema from "async-validator";
import { IP_ADDRESS_VALIDATOR } from "../../../../validators/shared";

import { ChannelState } from "../../redux/types/channel";

export const createChannelStateValidator = (channelState: ChannelState) => new Schema({
    name: { required: true, message: "Please provide a channel name" },
    //startTime: { required: true, message: "Please provide a schedule start time" },
    //endTime: { required: true, message: "Please provide a schedule start time" },
    ...(channelState.enableRemoteConfiguration) && {
        masterIPAddress: [
            { required: true, message: "Local IP address is required" },
            IP_ADDRESS_VALIDATOR
          ],
    }
     });
