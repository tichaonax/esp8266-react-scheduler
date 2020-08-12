import React, { Component } from 'react';
import { Typography, Box, List, ListItem, ListItemText } from '@material-ui/core';
import { SectionContent } from '../../components';

class AutoInformation extends Component {

  render() {
    return (
      <SectionContent title='Automation Information' titleGutter>
        <Typography variant="body1" paragraph>
          This simple app allows user to control a switch through a simple schedule. It comes with default settings that can be changed by user.
        </Typography>
        <Typography variant="body1" paragraph>
          Channel Schedule is active only between the 'Start Time' and 'End Time' periods. Changes to the schedule 
          must be saved to take effect. The changes take effect after 5s from time changes are saved. The schedule for the Channel is restarted with the new settings. The system also provides the device time as well as the IPAddress of the device if connected to WIFI.
        </Typography>      
        <List>
          <ListItem>
            <ListItemText
              primary="Channel control pin"
              secondary="This is the hardware pin on the micro-controller user may connect a relay in order to control a device. Solid State Relays (SSR) may be connected directly to the pin without the need for buffering transistors."
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
              secondary="When checked disabled 'Randomize', the switch is activated only during the time period from 'Start Time' to 'End Time'."
            />
          </ListItem> 
          <ListItem>
            <ListItemText
              primary="Randomize Switch?"
              secondary="When checked enables 'Hot Time' feature, the switch is on/off randomly within the 'Run Every' and 'Off After' limits. Disabled when 'TimeSpan' is active."
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Channel Name"
              secondary="User defined channel name that shows on the screen, if one is not provided system defaults to factory settings value."
            />
          </ListItem> 
          <ListItem>
            <ListItemText
              primary="Run Every"
              secondary="Turns on the switch repeatedly at the selected time frequency. If 'Enable TimeSpan' is checked the option is disabled and is ignored. If 'Randomize' option is enabled the switch can turn on after a random delay up to 'Run Every' minus 'Off After' duration. This is useful to simulate person turning lights on/off at night in bedrooms."
            />
          </ListItem>  
          <ListItem>
            <ListItemText
              primary="Off After"
              secondary="Turns off the switch at the end of this time period automatically after switch is activated by the 'Run Every' event. If 'Enable TimeSpan' is checked the option is disabled and is ignored. If 'Randomize' option is enabled the switch can turn off after a random delay up to 'Off After' duration."
            />
          </ListItem>    
          <ListItem>
            <ListItemText
              primary="Start Time"
              secondary="The start time when the schedule is active. If the start time is greater than the end time then schedule ends the following day."
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Hot Time"
              secondary="The duration that the switch is on before randomize feature takes over."
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="End Time"
              secondary="The end time when the schedule is active."
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
