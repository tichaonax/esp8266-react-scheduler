import { withStyles } from "@material-ui/core/styles";
import ToggleButton from "@mui/lab/ToggleButton";
import ToggleButtonGroup from "@mui/lab/ToggleButtonGroup";
import { blueGrey, yellow } from '@mui/material/colors';
import { ChannelState } from "../../../redux/types/channel";

const DAYS = [
  {
    key: "sunday",
    label: "S"
  },
  {
    key: "monday",
    label: "M"
  },
  {
    key: "tuesday",
    label: "T"
  },
  {
    key: "wednesday",
    label: "W"
  },
  {
    key: "thursday",
    label: "T"
  },
  {
    key: "friday",
    label: "F"
  },
  {
    key: "saturday",
    label: "S"
  }
];

const StyledToggleButtonGroup = withStyles((theme) => ({
  grouped: {
    margin: theme.spacing(2),
    padding: theme.spacing(0, 1),
    "&:not(:first-child)": {
      border: "1px solid",
      borderColor: blueGrey[800],
      borderRadius: "50%"
    },
    "&:first-child": {
      border: "1px solid",
      borderColor: blueGrey[800],
      borderRadius: "50%"
    }
  }
}))(ToggleButtonGroup);

const StyledToggle = withStyles({
  root: {
    color: yellow[500],
    "&$selected": {
      color: "white",
      background: "#eb8934"
    },
    "&:hover": {
      borderColor: "#346beb",
      background: "#eb34cc"
    },
    "&:hover$selected": {
      borderColor: "#346beb",
      background: "#eb8934"
    },
    minWidth: 32,
    maxWidth: 32,
    height: 32,
    textTransform: "unset",
    fontSize: "0.75rem"
  },
  selected: {}
})(ToggleButton);

export function selectWeekDays(
    data: ChannelState,
    handleChannelSelectWeekDaysValueChange: (value: number[]) => void)
    {
  return (
    <>
    <p>Active week days orange</p>
      <StyledToggleButtonGroup
        size="small"
        arial-label="Days of the week"
        value={data.schedule.weekDays}
        onChange={(_event, value) => handleChannelSelectWeekDaysValueChange(value)}
      >
        {DAYS.map((day, index) => (
          <StyledToggle key={day.key} value={index} aria-label={day.key}>
            {day.label}
          </StyledToggle>
        ))}
      </StyledToggleButtonGroup>
    </>
  );
}
