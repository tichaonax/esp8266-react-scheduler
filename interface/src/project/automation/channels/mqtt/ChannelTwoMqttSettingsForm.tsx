import { FC } from "react";

import ChannelMqttSettingsForm from './ChannelMqttSettingsForm';

const ChannelTwoMqttSettingsForm: FC = () => {
  const channelMqttSettingsFormProps  = {channelId: 'Two'};
  return (<ChannelMqttSettingsForm  {...channelMqttSettingsFormProps}/>);
};

export default ChannelTwoMqttSettingsForm;
