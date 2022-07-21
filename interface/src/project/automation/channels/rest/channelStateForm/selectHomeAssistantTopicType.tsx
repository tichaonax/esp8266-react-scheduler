import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { BlockFormControlLabel } from '../../../../../components';
import { ChannelState } from '../../../redux/types/channel';
import { SwitchType } from '../../tooltips/SwitchType';

export function selectHomeAssistantTopicType(data: ChannelState,
  handleChannelStateValueChange: (name: keyof ChannelState) => (event: any) => void) {
  return (<BlockFormControlLabel
    control={<Select
      style={{ marginLeft: 10, height: 30 }}
      value={data.homeAssistantTopicType}
      onChange={handleChannelStateValueChange('homeAssistantTopicType')}
             >
      <MenuItem value={0}>Light</MenuItem>
      <MenuItem value={1}>Switch</MenuItem>
             </Select>}
    label={(<SwitchType />)}
          />);
}
