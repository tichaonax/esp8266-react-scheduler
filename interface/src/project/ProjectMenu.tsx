import React, { Component } from 'react';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';

import {List, ListItem, ListItemIcon, ListItemText} from '@material-ui/core';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import BlurCircularIcon from '@material-ui/icons/BlurCircular';

import { PROJECT_PATH } from '../api';

class ProjectMenu extends Component<RouteComponentProps> {

  render() {
    const path = this.props.match.url;
    return (
      <List>
        <ListItem to={`/${PROJECT_PATH}/status/`} selected={path.startsWith(`/${PROJECT_PATH}/status/`)} button component={Link}>
          <ListItemIcon>
            <BlurCircularIcon />
          </ListItemIcon>
        <ListItemText primary="Status" />
        </ListItem>
        <ListItem to={`/${PROJECT_PATH}/auto/`} selected={path.startsWith(`/${PROJECT_PATH}/auto/`)} button component={Link}>
          <ListItemIcon>
            <AccessAlarmIcon />
          </ListItemIcon>
          <ListItemText primary="Automation" />
        </ListItem>
      </List>
    )
  }

}

export default withRouter(ProjectMenu);
