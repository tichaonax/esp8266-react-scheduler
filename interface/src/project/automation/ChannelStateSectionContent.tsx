import React from 'react';

import { RestFormLoader, SectionContent, RestControllerProps } from '../../components';

import ChannelStateForm from './ChannelStateForm';
import { ChannelState } from './types';

type ChannelStateRestControllerFormProps = RestControllerProps<ChannelState>;
const ChannelStateSectionContent = (props : ChannelStateRestControllerFormProps) => {
    return (
        <div style={{ marginTop: -20}}>
        <SectionContent title="" titleGutter>
            <RestFormLoader
                {...props}
                render={renderProps => (
                <ChannelStateForm {...renderProps} />
                )}
            />
        </SectionContent>
        </div>
    )
}

export default ChannelStateSectionContent;