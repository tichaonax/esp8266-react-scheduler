import React from 'react';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

import { Typography, Box } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';

import { RestFormProps, FormActions, FormButton } from '../../../components';
import { ChannelMqttSettings } from '../types';
import SystemStateWebSocketController from '../ws/SystemStateWebSocketController';
import { RemoteUtils } from '../../../utils/remoteUtils';

type ChannelMqttSettingsControllerFormProps = RestFormProps<ChannelMqttSettings>;

const ChannelMqttSettingsControllerForm = (props: ChannelMqttSettingsControllerFormProps) => {
  const { data, saveData, loadData, handleValueChange } = props;
  return (
    <ValidatorForm onSubmit={saveData}>
      <Typography variant="h6">{data.name} <SystemStateWebSocketController/></Typography>
      <Box bgcolor="primary.main" color="primary.contrastText" p={2} mt={2} mb={2}>
        <Typography variant="body1">
          Controllable via MQTT with Home Assistant's auto discovery feature.
        </Typography>
      </Box>
      <TextValidator
        validators={['required']}
        errorMessages={['Unique ID is required']}
        name="unique_id"
        label="Unique ID"
        fullWidth
        variant="outlined"
        value={data.unique_id}
        onChange={handleValueChange('unique_id')}
        margin="normal"
        disabled={RemoteUtils.isRemoteIpDevice()}
      />
      <TextValidator
        validators={['required']}
        errorMessages={['Name is required']}
        name="name"
        label="Name"
        fullWidth
        variant="outlined"
        value={data.name}
        onChange={handleValueChange('name')}
        margin="normal"
        disabled={RemoteUtils.isRemoteIpDevice()}
      />
      <TextValidator
        validators={['required']}
        errorMessages={['MQTT Path is required']}
        name="mqtt_path"
        label="MQTT Path"
        fullWidth
        variant="outlined"
        value={data.mqtt_path}
        onChange={handleValueChange('mqtt_path')}
        margin="normal"
        disabled={RemoteUtils.isRemoteIpDevice()}
      />
      <FormActions>
        <FormButton startIcon={<SaveIcon />} variant="contained" color="primary" type="submit" disabled={RemoteUtils.isRemoteIpDevice()} >
          Save
        </FormButton>
        <FormButton variant="contained" color="secondary" onClick={loadData} disabled={RemoteUtils.isRemoteIpDevice()}>
          Reset
        </FormButton>
      </FormActions>
    </ValidatorForm>
  );
}

export default ChannelMqttSettingsControllerForm;