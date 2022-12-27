export function hotTimeHourFormat() {
  return (hotTimeHour: number) => {
    const totalTimeSeconds = hotTimeHour * 3600;
    const hours: number = Math.floor((hotTimeHour));
    const minutes: number = Math.floor(((totalTimeSeconds - (hours * 3600)) / 60));
    const seconds: number = Math.floor(totalTimeSeconds - (hours * 3600) - (minutes * 60));

    let hString: string = hours.toString();
    if (hours < 10) { hString = "0" + hours; }
    if (hours === 0) {
      hString = "";
    } else {
      hString = hString + "h ";
    }

    let mString: string = minutes.toString();
    if (minutes < 10) { mString = "0" + minutes; }
    if (minutes === 0) {
      mString = "";
    } else {
      mString = mString + "m ";
    }

    let sString: string = seconds.toString();
    if (seconds < 10) { sString = "0" + seconds; }
    if (seconds === 0) {
      sString = "";
    } else {
      sString = sString + "s";
    }

    return (hString + mString + sString);
  };
}
