import React, { Component } from 'react';
import { Redirect, Switch, RouteComponentProps } from 'react-router-dom'

import { Tabs, Tab } from '@material-ui/core';

import { PROJECT_PATH } from '../../api';
import { MenuAppBar } from '../../components';
import { AuthenticatedRoute } from '../../authentication';

import ChannelOne from './ChannelOne';
import ChannelTwo from './ChannelTwo';
import ChannelThree from './ChannelThree';
import ChannelFour from './ChannelFour';
import AutoInformation from './AutoInformation';

class Automation extends Component<RouteComponentProps> {

  handleTabChange = (event: React.ChangeEvent<{}>, path: string) => {
    this.props.history.push(path);
  };

  render() {
    return (
      <MenuAppBar sectionTitle="Automation System">
        <Tabs value={this.props.match.url} onChange={this.handleTabChange} variant="fullWidth">
          <Tab value={`/${PROJECT_PATH}/auto/information`} label="Channel Info" />
          <Tab value={`/${PROJECT_PATH}/auto/channelOne`} label="Channel One" />
          <Tab value={`/${PROJECT_PATH}/auto/channelTwo`} label="Channel Two" />
          <Tab value={`/${PROJECT_PATH}/auto/channelThree`} label="Channel Three" />
          <Tab value={`/${PROJECT_PATH}/auto/channelFour`} label="Channel Four" />
        </Tabs>
        <Switch>
          <AuthenticatedRoute exact path={`/${PROJECT_PATH}/auto/information`} component={AutoInformation} />
          <AuthenticatedRoute exact path={`/${PROJECT_PATH}/auto/channelOne`} component={ChannelOne} />
          <AuthenticatedRoute exact path={`/${PROJECT_PATH}/auto/channelTwo`} component={ChannelTwo} />
          <AuthenticatedRoute exact path={`/${PROJECT_PATH}/auto/channelThree`} component={ChannelThree} />
          <AuthenticatedRoute exact path={`/${PROJECT_PATH}/auto/channelFour`} component={ChannelFour} />
          <Redirect to={`/${PROJECT_PATH}/auto/information`} />
        </Switch>
      </MenuAppBar>
    )
  }

}

export default Automation;
