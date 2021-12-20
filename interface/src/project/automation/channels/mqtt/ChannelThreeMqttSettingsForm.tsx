import { FC } from "react";

import ChannelMqttSettingsForm from './ChannelMqttSettingsForm';

const ChannelThreeMqttSettingsForm: FC = () => {
  const channelMqttSettingsFormProps  = {channelId: 'Three'};
  return (<ChannelMqttSettingsForm  {...channelMqttSettingsFormProps}/>);
};

export default ChannelThreeMqttSettingsForm;
