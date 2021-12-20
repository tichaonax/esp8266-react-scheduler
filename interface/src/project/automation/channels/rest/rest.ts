import { ChannelSettings } from "../../redux/types/channel";
import { Loader } from "../../redux/types/ui";

export interface ChannelStateRestFormProps {
    onRemoveLoader: (feature: string) => void;
    loader: Loader;
    channelId: string;
    onSetChannelSettings: (settings: ChannelSettings) => void;
  }
