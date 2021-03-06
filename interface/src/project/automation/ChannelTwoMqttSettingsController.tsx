import React, { Component } from 'react';

import { ENDPOINT_ROOT } from '../../api';
import { restController, RestControllerProps, RestFormLoader, SectionContent } from '../../components';

import { ChannelMqttSettings } from './types';
import ChannelMqttSettingsControllerForm from './ChannelMqttSettingsControllerForm';

export const CHANNEL_BROKER_SETTINGS_ENDPOINT = ENDPOINT_ROOT + "channelTwoBrokerSettings";

type ChannelMqttSettingsControllerProps = RestControllerProps<ChannelMqttSettings>;

class ChannelTwoMqttSettingsController extends Component<ChannelMqttSettingsControllerProps> {

  componentDidMount() {
    this.props.loadData();
  }

  render() {
    return (
      <SectionContent title='Settings' titleGutter>
        <RestFormLoader
          {...this.props}
          render={props => (
            <ChannelMqttSettingsControllerForm {...props} />
          )}
        />
      </SectionContent>
    )
  }
}

export default restController(CHANNEL_BROKER_SETTINGS_ENDPOINT, ChannelTwoMqttSettingsController);
