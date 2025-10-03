import { type ReactElement } from "react";

interface Props {
  text: string;
  onClick?: () => void;
  className?: string;
}

export function Button(props: Props): ReactElement {
  return (
    <button onClick={props.onClick} className={props.className}>
      {props.text}
    </button>
  )
}
