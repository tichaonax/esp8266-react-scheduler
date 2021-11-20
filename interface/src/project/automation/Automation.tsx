import React, { Component } from 'react';
import { Redirect, Switch, RouteComponentProps } from 'react-router-dom'

import { Tabs, Tab } from '@material-ui/core';

import { PROJECT_PATH, CHANNEL_ONE, CHANNEL_TWO, CHANNEL_THREE, CHANNEL_FOUR } from '../../api';
import { MenuAppBar } from '../../components';
import { AuthenticatedRoute } from '../../authentication';

import ChannelOne from './channels/ChannelOne';
import ChannelTwo from './channels/ChannelTwo';
import ChannelThree from './channels/ChannelThree';
import ChannelFour from './channels/ChannelFour';
//import AutoInformation from './AutoInformation';

class Automation extends Component<RouteComponentProps> {

  handleTabChange = (event: React.ChangeEvent<{}>, path: string) => {
    this.props.history.push(path);
  };

  render() {

    let defaultShow;
    if(CHANNEL_ONE === 'true'){
      defaultShow = 'channelOne';
    } else if (CHANNEL_TWO === 'true') {
      defaultShow = 'channelTwo';
    } else if(CHANNEL_THREE === 'true') {
      defaultShow = 'channelThree';
    } else if(CHANNEL_FOUR === 'true'){
      defaultShow = 'channelFour';
    }

    return (
      <MenuAppBar sectionTitle="Automation System">
        <Tabs value={this.props.match.url} onChange={this.handleTabChange} variant="fullWidth">
          {/*<Tab value={`/${PROJECT_PATH}/auto/information`} label="Info" /> */}
          {(CHANNEL_ONE === 'true') &&
           <Tab value={`/${PROJECT_PATH}/auto/channelOne`} label="Channel One" />}
          {(CHANNEL_TWO === 'true') &&
            <Tab value={`/${PROJECT_PATH}/auto/channelTwo`} label="Channel Two" />}
          {(CHANNEL_THREE === 'true') &&
            <Tab value={`/${PROJECT_PATH}/auto/channelThree`} label="Channel Three" />}
          {(CHANNEL_FOUR === 'true') &&
            <Tab value={`/${PROJECT_PATH}/auto/channelFour`} label="Channel Four" />}
        </Tabs>
        <Switch>
          {/*<AuthenticatedRoute exact path={`/${PROJECT_PATH}/auto/information`} component={AutoInformation} />*/}
          {(CHANNEL_ONE === 'true') &&
            <AuthenticatedRoute exact path={`/${PROJECT_PATH}/auto/channelOne`} component={ChannelOne} />}
          {(CHANNEL_TWO === 'true') &&
            <AuthenticatedRoute exact path={`/${PROJECT_PATH}/auto/channelTwo`} component={ChannelTwo} />}
          {(CHANNEL_THREE === 'true') &&
            <AuthenticatedRoute exact path={`/${PROJECT_PATH}/auto/channelThree`} component={ChannelThree} />}
          {(CHANNEL_FOUR === 'true') &&
            <AuthenticatedRoute exact path={`/${PROJECT_PATH}/auto/channelFour`} component={ChannelFour} />}
        
          <Redirect to={`/${PROJECT_PATH}/auto/${defaultShow}`} />
        </Switch>
      </MenuAppBar>
    )
  }

}

export default Automation;
