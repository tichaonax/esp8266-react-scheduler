import { FC } from 'react';

import ChannelStateForm from './ChannelStateForm';

const ChannelTwoStateRestForm: FC = () => {
 const channelStateRestFormProps  = {channelId: 'Two'};
  return (<ChannelStateForm  {...channelStateRestFormProps}/>);
};

export default ChannelTwoStateRestForm;
