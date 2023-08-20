import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { BlockFormControlLabel } from '../../../../../components';
import { ChannelState } from '../../../redux/types/channel';
import { Schedule } from '../../../redux/types/schedule';
import { OverrideTime } from '../../tooltips/OverrideTime';

export function selectOverrideTime(data: ChannelState,
  handleChannelScheduleValueChange: (name: keyof Schedule) => (event: any) => void) {
  return (<BlockFormControlLabel
    control={<Select
      style={{ marginLeft: 10, height: 30 }}
      value={data.schedule.overrideTime}
      onChange={handleChannelScheduleValueChange('overrideTime')}
             >
      <MenuItem value={960}>none</MenuItem>
      <MenuItem value={0.033}>02 seconds</MenuItem>
      <MenuItem value={0.05}>03 seconds</MenuItem>
      <MenuItem value={0.066}>04 seconds</MenuItem>
      <MenuItem value={0.083}>05 seconds</MenuItem>
      <MenuItem value={0.1}>06 seconds</MenuItem>
      <MenuItem value={0.166}>10 seconds</MenuItem>
      <MenuItem value={0.2}>12 seconds</MenuItem>
      <MenuItem value={0.25}>15 seconds</MenuItem>
      <MenuItem value={0.333}>20 seconds</MenuItem>
      <MenuItem value={0.5}>30 seconds</MenuItem>
      <MenuItem value={1}>1 minute</MenuItem>
      <MenuItem value={2}>2 minutes</MenuItem>
      <MenuItem value={3}>3 minutes</MenuItem>
      <MenuItem value={4}>4 minutes</MenuItem>
      <MenuItem value={5}>5 minutes</MenuItem>
      <MenuItem value={6}>6 minutes</MenuItem>
      <MenuItem value={8}>8 minutes</MenuItem>
      <MenuItem value={10}>10 minutes</MenuItem>
      <MenuItem value={11}>11 minutes</MenuItem>
      <MenuItem value={12}>12 minutes</MenuItem>
      <MenuItem value={13}>13 minutes</MenuItem>
      <MenuItem value={15}>15 minutes</MenuItem>
      <MenuItem value={17}>17 minutes</MenuItem>
      <MenuItem value={20}>20 minutes</MenuItem>
      <MenuItem value={30}>30 minutes</MenuItem>
      <MenuItem value={40}>40 minutes</MenuItem>
      <MenuItem value={60}>1 hour</MenuItem>
      <MenuItem value={120}>2 hours</MenuItem>
      <MenuItem value={150}>2.5 hours</MenuItem>
      <MenuItem value={180}>3 hours</MenuItem>
      <MenuItem value={210}>3.5 hours</MenuItem>
      <MenuItem value={240}>4 hours</MenuItem>
             </Select>}
    label={(<OverrideTime />)}
          />);
}
