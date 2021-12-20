import { FC } from 'react';

import ChannelStateForm from './ChannelStateForm';

const ChannelOneStateRestForm: FC = () => {
 const channelStateRestFormProps  = {channelId: 'One'};
  return (<ChannelStateForm  {...channelStateRestFormProps}/>);
};

export default ChannelOneStateRestForm;
