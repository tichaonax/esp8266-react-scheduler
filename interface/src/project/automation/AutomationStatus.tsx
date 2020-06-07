import React, { Component } from 'react';
import { Redirect, Switch, RouteComponentProps } from 'react-router-dom'

import { Tabs, Tab } from '@material-ui/core';

import { PROJECT_PATH } from '../../api';
import { MenuAppBar } from '../../components';
import { AuthenticatedRoute } from '../../authentication';

import ChannelWebSocketController from './ChannelWebSocketController';


class AutomationStatus extends Component<RouteComponentProps> {

  handleTabChange = (event: React.ChangeEvent<{}>, path: string) => {
    this.props.history.push(path);
  };

  render() {
    return (
      <MenuAppBar sectionTitle="Channel Status">
        <Tabs value={this.props.match.url} onChange={this.handleTabChange} variant="fullWidth">
          <Tab value={`/${PROJECT_PATH}/status/wsStatus`} label="Channel Status" />
        </Tabs>
        <Switch>
          <AuthenticatedRoute exact path={`/${PROJECT_PATH}/status/wsStatus`} component={ChannelWebSocketController} />
          <Redirect to={`/${PROJECT_PATH}/status/wsStatus`} />
        </Switch>
      </MenuAppBar>
    )
  }

}

export default AutomationStatus;
