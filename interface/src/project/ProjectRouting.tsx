import React, { Component } from 'react';
import { Redirect, Switch } from 'react-router';

import { PROJECT_PATH } from '../api';
import { AuthenticatedRoute } from '../authentication';

import Automation from './automation/Automation';
import AutomationStatus from './automation/AutomationStatus';
//import DemoProject from './DemoProject';

class ProjectRouting extends Component {

  render() {
    return (
      <Switch>
        {/* <AuthenticatedRoute exact path={`/${PROJECT_PATH}/demo/*`} component={DemoProject} /> */}
        <AuthenticatedRoute exact path={`/${PROJECT_PATH}/auto/*`} component={Automation} />
        <AuthenticatedRoute exact path={`/${PROJECT_PATH}/status/*`} component={AutomationStatus} />
        <Redirect to={`/${PROJECT_PATH}/status/`} />
      </Switch>
    )
  }

}

export default ProjectRouting;
