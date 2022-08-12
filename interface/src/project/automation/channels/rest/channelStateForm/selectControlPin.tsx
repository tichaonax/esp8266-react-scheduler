import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { BlockFormControlLabel } from '../../../../../components';
import { ChannelState } from '../../../redux/types/channel';
import { ControlPin } from '../../tooltips/ControlPin';

export function selectControlPin(data: ChannelState, handleChannelStateValueChange: (name: keyof ChannelState) => (event: any) => void) {
  return (<BlockFormControlLabel
    control={<Select
      style={{ marginLeft: 10, height: 30 }}
      value={data.controlPin}
      disabled={data.enabled}
      onChange={handleChannelStateValueChange('controlPin')}
             >
      <MenuItem value={0}>GPIO0</MenuItem>
      <MenuItem value={4}>GPO4</MenuItem>
      <MenuItem value={5}>GPIO5</MenuItem>
      <MenuItem value={12}>GPIO12</MenuItem>
      <MenuItem value={13}>GPIO13</MenuItem>
      <MenuItem value={14}>GPIO14</MenuItem>
      <MenuItem value={18}>GPIO18</MenuItem>
      <MenuItem value={19}>GPIO19</MenuItem>
      <MenuItem value={21}>GPIO21</MenuItem>
             </Select>}
    label={(<ControlPin />)}
          />);
}
