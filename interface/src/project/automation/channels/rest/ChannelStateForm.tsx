/* eslint-disable max-len */
import { FC, Dispatch, useEffect, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { useSnackbar } from "notistack";
import { ValidateFieldsError } from "async-validator";

import type {} from '@mui/lab/themeAugmentation';

import { SectionContent } from '../../../../components';
import { updateValue, useRest } from '../../../../utils';

import { AppState } from '../../redux/store';
import { uiLoaderProjector } from '../../redux/selectors/uiLoaderProjector';
import { setChannelSettings} from '../../redux/actions/channel';
import { channelSettingsSelector } from '../../redux/selectors/channel';
import { removeLoader } from '../../redux/actions/ui';
import { Loader, LoaderActions } from '../../redux/types/ui';
import { CHANNEL, Channels, ChannelSettings, ChannelSettingsActions, ChannelState, RESTART } from '../../redux/types/channel';

import { ChannelStateRestFormProps } from "./rest";
import { ThemeProvider } from '@mui/material/styles';
import { DateRangePicker } from 'rsuite';
import { DateRange } from "rsuite/DateRangePicker";
import { channelStateContent } from './channelStateContent';

import * as Api from '../../api/channelApi';
import 'rsuite/dist/rsuite.min.css';
import '../svg-styles.css';
import { theme } from './channelStateForm/theme';

const ChannelStateRestForm: FC<ChannelStateRestFormProps> = ({
  loader, onRemoveLoader, onSetChannelSettings, channelId
}) => {
  const [fieldErrors, setFieldErrors] = useState<ValidateFieldsError>();
  const [oldControlPin, setOldControlPin] = useState<number>(-1);
  const [oldHomeAssistantTopicType, setOldHomeAssistantTopicType] = useState<number>(-1);
  const [activeDateRange, setDateRange] = useState<DateRange>([new Date(), new Date()]);

  const read = useCallback(
    () => Api.createReadChannelApi(channelId)
    ,[channelId]
  );

  const update = useCallback(
    (channelState: ChannelState) => Api.createUpdateChannelApi(channelId, channelState)
    ,[channelId]
  );

  const {
    loadData, saveData, saving, setData, data, errorMessage
  } = useRest<ChannelState>({ read, update });

  const updateFormValue = updateValue(setData);

  useEffect(() => {
    if(data && (oldControlPin === -1)){
      setOldControlPin(data.controlPin);
    }
  }, [data, oldControlPin]);

  useEffect(() => {
    if(data && (oldHomeAssistantTopicType === -1)){
      setOldHomeAssistantTopicType(data.homeAssistantTopicType);
    }
  }, [data, oldHomeAssistantTopicType]);

  useEffect(() => {
    if(data && data.activeDateRange){
     setDateRange([new Date(data.activeDateRange[0]),new Date(data.activeDateRange[1])]);
    }
  }, [data]);

  const { allowedMaxDays } = DateRangePicker;

  const content = channelStateContent(data, loadData,
    errorMessage, setData, onSetChannelSettings,
    oldControlPin, oldHomeAssistantTopicType,
    setFieldErrors, saveData, fieldErrors,
    updateFormValue, activeDateRange,
    setDateRange, allowedMaxDays, saving);

  const { enqueueSnackbar } = useSnackbar();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const restartSuccessMessage = (name: string | undefined, controlPin: number) => {
    if(loader.success){
      enqueueSnackbar(name +  " Schedule Restarted Successfully!", { variant: 'success' });
      setOldControlPin(controlPin);
      }else{
        enqueueSnackbar(name + " " + loader.errorMessage, { variant: 'error' });
      }
      onRemoveLoader(`${CHANNEL}${RESTART}`);
  };

  useEffect(() => {
    if(loader && !loader.loading ){
      restartSuccessMessage(data?.name, data?.controlPin || -1);
    }
  },[loader, enqueueSnackbar, data?.name, restartSuccessMessage, data?.controlPin]);

  return (
    <ThemeProvider theme={theme}>
      <SectionContent title='Channel Schedule' titleGutter>
        {content()}
      </SectionContent>
    </ThemeProvider>
  );

};
const mapStateToProps = (state: AppState ) => {
  const channels: Channels = channelSettingsSelector(state);
  const loader: Loader = uiLoaderProjector(`${CHANNEL}${RESTART}`)(state);
  return {channels, loader};
};

const mapDispatchToProps = (dispatch: Dispatch<ChannelSettingsActions | LoaderActions>) => {
  return {
      onSetChannelSettings: (settings: ChannelSettings) => {
        dispatch(setChannelSettings(settings));
      },
      onRemoveLoader: (feature: string) => {
        dispatch(removeLoader(feature));
      }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChannelStateRestForm);

