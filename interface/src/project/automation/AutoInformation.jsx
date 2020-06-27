import React, { Component } from 'react';
import { Typography, Box, List, ListItem, ListItemText } from '@material-ui/core';
import { SectionContent } from '../../components';

class AutoInformation extends Component {

  render() {
    return (
      <SectionContent title='Automation Information' titleGutter>
        <Typography variant="body1" paragraph>
          This simple app allows you to control a switch through a schedule. It comes with defaults that can be changed by user.
        </Typography>
        <Typography variant="body1" paragraph>
          Channel Schedule is active only between the 'Start Time' and 'End Time' periods. Changes to the schedule 
          must be saved to take effect after system is reset.
        </Typography>      
        <List>
          <ListItem>
            <ListItemText
              primary="Channel control pin"
              secondary="This is the hardware pin on the micro-controller you may connect a relay if you want to controls a device."
            />
          </ListItem> 
          <ListItem>
            <ListItemText
              primary="Schedule"
              secondary="Is a set of user selected options that determine the periods during which the connected device may be controlled automatically."
            />
          </ListItem> 
          <ListItem>
            <ListItemText
              primary="Enable schedule?"
              secondary="When checked the schedule is active."
            />
          </ListItem>   
          <ListItem>
            <ListItemText
              primary="Enable TimeSpan?"
              secondary="When checked the switch is activated only during the time period from 'Start Time' to 'End Time'"
            />
          </ListItem> 
          <ListItem>
            <ListItemText
              primary="Randomize Switch?"
              secondary="When checked the switch is activated/deactivated randomly within the 'Run Every' and 'Off After' time definitions"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Channel Name"
              secondary="User defined channel name that shows on the screen, if one is not provided system defaults to factory settings."
            />
          </ListItem> 
          <ListItem>
            <ListItemText
              primary="Run Every"
              secondary="Turns on the switch repeatedly at this time frequency. If 'Enable TimeSpan' is checked the option is disabled and is ignored"
            />
          </ListItem>  
          <ListItem>
            <ListItemText
              primary="Off After"
              secondary="Turns off the switch at the end of this time period automatically after switch is activated by the 'Run Every' event. If 'Enable TimeSpan' is checked the option is disabled and is ignored"
            />
          </ListItem>    
          <ListItem>
            <ListItemText
              primary="Start Time"
              secondary="The start time when the schedule is active"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="End Time"
              secondary="The end time when the schedule is active"
            />
          </ListItem> 
        </List>
        <Box mt={2}>
          <Typography variant="body1">
            See the project <a href="https://github.com/tichaonax/esp8266-react-scheduler/">README</a> for a full description of the project.
          </Typography>
        </Box>
      </SectionContent>
    )
  }

}

export default AutoInformation;
