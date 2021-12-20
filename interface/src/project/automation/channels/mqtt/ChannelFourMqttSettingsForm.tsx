import { FC } from "react";

import ChannelMqttSettingsForm from './ChannelMqttSettingsForm';

const ChannelFourMqttSettingsForm: FC = () => {
  const channelMqttSettingsFormProps  = {channelId: 'Four'};
  return (<ChannelMqttSettingsForm  {...channelMqttSettingsFormProps}/>);
};

export default ChannelFourMqttSettingsForm;
