import Icon from '@mdi/react';
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import {
  mdiPower, mdiAirConditioner, mdiCamera,
  mdiCeilingFanLight, mdiFan, mdiFridgeOutline,
  mdiGarage, mdiGarageVariant, mdiMicrowave,
  mdiPrinter, mdiPrinterWireless, mdiSpeaker,
  mdiTelevision, mdiTelevisionAmbientLight,
  mdiToaster, mdiToasterOven, mdiWaterPump,
  mdiLightbulbOn, mdiSpeakerMultiple
} from '@mdi/js';
import { BlockFormControlLabel } from '../../../../../components';
import { ChannelState } from '../../../redux/types/channel';
import { MDIIcon } from '../../tooltips/MDIicon';

export function selectHomeAssistantIcon(data: ChannelState,
  handleChannelStateValueChange: (name: keyof ChannelState) => (event: any) => void) {
  return (<BlockFormControlLabel
    control={<Select
      style={{ marginLeft: 10, verticalAlign: "middle", height: 30 }}
      value={data.homeAssistantIcon}
      onChange={handleChannelStateValueChange('homeAssistantIcon')}
             >
      <MenuItem value={"mdi:air-conditioner"}><Icon size={1} path={mdiAirConditioner} />air-conditioner</MenuItem>
      <MenuItem value={"mdi:camera"}><Icon size={1} path={mdiCamera} />camera</MenuItem>
      <MenuItem value={"mdi:ceiling-fan-light"}><Icon size={1} path={mdiCeilingFanLight} />ceiling-fan-light</MenuItem>
      <MenuItem value={"mdi:fan"}><Icon size={1} path={mdiFan} />fan</MenuItem>
      <MenuItem value={"mdi:fridge"}><Icon size={1} path={mdiFridgeOutline} />fridge</MenuItem>
      <MenuItem value={"mdi:garage"}><Icon size={1} path={mdiGarage} />garage</MenuItem>
      <MenuItem value={"mdi:garage-variant"}><Icon size={1} path={mdiGarageVariant} />garage-variant</MenuItem>
      <MenuItem value={"mdi:lightbulb"}><Icon size={1} path={mdiLightbulbOn} />light</MenuItem>
      <MenuItem value={"mdi:microwave"}><Icon size={1} path={mdiMicrowave} />microwave</MenuItem>
      <MenuItem value={"mdi:power"}><Icon size={1} path={mdiPower} />power</MenuItem>
      <MenuItem value={"mdi:printer"}><Icon size={1} path={mdiPrinter} />printer</MenuItem>
      <MenuItem value={"mdi:printer-wireless"}><Icon size={1} path={mdiPrinterWireless} />printer-wireless</MenuItem>
      <MenuItem value={"mdi:speaker"}><Icon size={1} path={mdiSpeaker} />speaker</MenuItem>
      <MenuItem value={"mdi:speaker-wireless"}><Icon size={1} path={mdiSpeakerMultiple} />speaker-wireless</MenuItem>
      <MenuItem value={"mdi:television-ambient-light"}><Icon size={1} path={mdiTelevisionAmbientLight} />television-ambient-light</MenuItem>
      <MenuItem value={"mdi:television"}><Icon size={1} path={mdiTelevision} />television</MenuItem>
      <MenuItem value={"mdi:toaster"}><Icon size={1} path={mdiToaster} />toaster</MenuItem>
      <MenuItem value={"mdi:toaster-oven"}><Icon size={1} path={mdiToasterOven} />toaster-oven</MenuItem>
      <MenuItem value={"mdi:water-pump"}><Icon size={1} path={mdiWaterPump} />water pump</MenuItem>
             </Select>}
    label={(<MDIIcon />)}
          />);
}
