import React, { Component } from 'react';

import { ENDPOINT_ROOT } from '../../api';
import { restController, RestControllerProps, RestFormLoader, SectionContent } from '../../components';

import { ChannelMqttSettings } from './types';
import ChannelMqttSectionContent from './ChannelMqttSectionContent';

export const CHANNEL_BROKER_SETTINGS_ENDPOINT = ENDPOINT_ROOT + "channelOneBrokerSettings";

type ChannelOneMqttSettingsControllerProps = RestControllerProps<ChannelMqttSettings>;

class ChannelOneMqttSettingsController extends Component<ChannelOneMqttSettingsControllerProps> {

  componentDidMount() {
    this.props.loadData();
  }

  render() {
    return (
      <SectionContent title='MQTT Controller' titleGutter>
        <RestFormLoader
          {...this.props}
          render={props => (
            <ChannelMqttSectionContent {...props} />
          )}
        />
      </SectionContent>
    )
  }
}

export default restController(CHANNEL_BROKER_SETTINGS_ENDPOINT, ChannelOneMqttSettingsController);
