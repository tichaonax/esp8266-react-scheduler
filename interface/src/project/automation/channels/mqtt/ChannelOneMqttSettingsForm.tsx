import { FC } from "react";

import ChannelMqttSettingsForm from './ChannelMqttSettingsForm';

const ChannelOneMqttSettingsForm: FC = () => {
  const channelMqttSettingsFormProps  = {channelId: 'One'};
  return (<ChannelMqttSettingsForm  {...channelMqttSettingsFormProps}/>);
};

export default ChannelOneMqttSettingsForm;
