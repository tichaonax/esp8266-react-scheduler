import React, { Component } from 'react';
import { Redirect, Switch } from 'react-router';

import { PROJECT_PATH } from '../api';
import { AuthenticatedRoute } from '../authentication';

//import DemoProject from './DemoProject';
import Automation from './automation/Automation';
import AutomationStatus from './automation/AutomationStatus';

class ProjectRouting extends Component {

  render() {
    return (
      <Switch>
        {
          /*
          * Add your project page routing below.
          */
        }
{/*         <AuthenticatedRoute exact path={`/${PROJECT_PATH}/demo/*`} component={DemoProject} /> */}
        <AuthenticatedRoute exact path={`/${PROJECT_PATH}/auto/*`} component={Automation} />
        <AuthenticatedRoute exact path={`/${PROJECT_PATH}/status/*`} component={AutomationStatus} />
        {
          /*
          * The redirect below caters for the default project route and redirecting invalid paths.
          * The "to" property must match one of the routes above for this to work correctly.
          */
        }
        <Redirect to={`/${PROJECT_PATH}/status/`} />
      </Switch>
    )
  }

}

export default ProjectRouting;
