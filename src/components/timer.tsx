import { type ReactElement } from "react";
import { secondsToMinutes } from "../utils/seconds-to-minutes";

interface Props {
  mainTime: number;
}

export function Timer(props: Props): ReactElement {
  return (<div className="timer">{secondsToMinutes(props.mainTime)}</div>)
}
