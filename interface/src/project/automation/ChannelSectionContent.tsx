import React from 'react';

import { RestFormLoader, SectionContent, RestControllerProps } from '../../components';

import ChannelStateForm from './ChannelStateForm';
import { ChannelState } from './types';

type ChannelStateRestControllerFormProps = RestControllerProps<ChannelState>;
const ChannelSectionContent = (props : ChannelStateRestControllerFormProps) => {
    return (
        <SectionContent title="" titleGutter>
            <RestFormLoader
                {...props}
                render={renderProps => (
                <ChannelStateForm {...renderProps} />
                )}
            />
        </SectionContent>
    )
}

export default ChannelSectionContent;