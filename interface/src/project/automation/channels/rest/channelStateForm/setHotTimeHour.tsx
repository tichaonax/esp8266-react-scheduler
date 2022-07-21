import { Typography } from '@mui/material';
import Slider from '@mui/material/Slider';
import { ChannelState } from '../../../redux/types/channel';
import { HotTime } from '../../tooltips/HotTime';

export function setHotTimeHour(formatHotTimeHour: (hotTimeHour: number) => string,
data: ChannelState, marks: { value: number; label: string; }[],
handleSliderChange: (event: any, newValue: number | number[]) => void) {
  return (<div>
    <Typography id="discrete-slider" gutterBottom>
      {(<HotTime />)}{formatHotTimeHour(data.schedule.hotTimeHour)}
    </Typography>
    <Slider
      disabled={!data.randomize}
      defaultValue={data.schedule.hotTimeHour}
      aria-labelledby="discrete-slider-custom"
      step={0.0167}
      valueLabelDisplay="off"
      marks={marks}
      min={0}
      max={4}
      onChange={handleSliderChange}
    />
          </div>);
}
