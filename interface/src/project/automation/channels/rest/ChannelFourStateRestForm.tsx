import { FC } from 'react';

import ChannelStateForm from './ChannelStateForm';

const ChannelFourStateRestForm: FC = () => {
 const channelStateRestFormProps  = {channelId: 'Four'};
  return (<ChannelStateForm  {...channelStateRestFormProps}/>);
};

export default ChannelFourStateRestForm;
