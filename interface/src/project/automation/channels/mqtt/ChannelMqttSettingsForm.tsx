import { FC, useCallback, useState } from "react";
import { ValidateFieldsError } from "async-validator";

import { Button } from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';

import { ButtonRow, FormLoader, SectionContent, ValidatedTextField } from "../../../../components";
import { validate } from "../../../../validators";
import { useRest, updateValue } from "../../../../utils";

import * as Api from '../../api/channelApi';

import { ChannelMqttSettings } from "../../redux/types/mqtt";
import { CHANNEL_MQTT_SETTINGS_VALIDATOR } from "../validators";
import { ChannelMqttSettingsFormProps } from "./mqtt";
import RemoteConfiguration from '../RemoteConfiguration';

const ChannelMqttSettingsForm: FC<ChannelMqttSettingsFormProps> = ({ channelId }) => {
  const [fieldErrors, setFieldErrors] = useState<ValidateFieldsError>();

  const read = useCallback(
    () => Api.createReadChannelBrokerSettingsApi(channelId)
    ,[channelId]
  );

  const update = useCallback(
    (channelMqttSettings: ChannelMqttSettings) => Api.createUpdateChannelBrokerSettingsApi(channelId, channelMqttSettings)
    ,[channelId]
  );

  const {
    loadData, saveData, saving, setData, data, errorMessage
  } = useRest<ChannelMqttSettings>({read, update});

  const updateFormValue = updateValue(setData);

  const content = () => {
    if (!data) {
      return (<FormLoader onRetry={loadData} errorMessage={errorMessage} />);
    }

    const validateAndSubmit = async () => {
      try {
        setFieldErrors(undefined);
        await validate(CHANNEL_MQTT_SETTINGS_VALIDATOR, data);
        saveData();
      } catch (errors: any) {
        setFieldErrors(errors);
      }
    };

    return (
      <>
        <RemoteConfiguration/>
        <ValidatedTextField
          fieldErrors={fieldErrors}
          name="unique_id"
          label="Unique ID"
          fullWidth
          variant="outlined"
          value={data.unique_id}
          onChange={updateFormValue}
          margin="normal"
        />
        <ValidatedTextField
          fieldErrors={fieldErrors}
          name="name"
          label="Name"
          fullWidth
          variant="outlined"
          value={data.name}
          onChange={updateFormValue}
          margin="normal"
        />
        <ValidatedTextField
          fieldErrors={fieldErrors}
          name="mqtt_path"
          label="MQTT Path"
          fullWidth
          variant="outlined"
          value={data.mqtt_path}
          onChange={updateFormValue}
          margin="normal"
        />
        <ButtonRow mt={1}>
          <Button startIcon={<SaveIcon />} disabled={saving} variant="contained" color="primary" type="submit" onClick={validateAndSubmit}>
            Save
          </Button>
        </ButtonRow>
      </>
    );
  };

  return (
    <SectionContent title='MQTT Settings' titleGutter>
      {content()}
    </SectionContent>
  );
};

export default ChannelMqttSettingsForm;
