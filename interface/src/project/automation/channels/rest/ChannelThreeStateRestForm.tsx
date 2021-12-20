import { FC } from 'react';

import ChannelStateForm from './ChannelStateForm';

const ChannelThreeStateRestForm: FC = () => {
 const channelStateRestFormProps  = {channelId: 'Three'};
  return (<ChannelStateForm  {...channelStateRestFormProps}/>);
};

export default ChannelThreeStateRestForm;
