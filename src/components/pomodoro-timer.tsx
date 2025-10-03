import { useEffect, type ReactElement } from "react";
import { useState, useCallback } from "react";
import { useInterval } from "../hooks/use-interval";
import { Button } from "./button";
import { Timer } from "./timer";

import bellStart from '../sounds/bell-start.mp3';
import bellFinish from '../sounds/bell-finish.mp3';
import { secondsToTime } from "../utils/seconds-to-time";

const audioStartWorking = new Audio(bellStart);
const audioStopWorking = new Audio(bellFinish);

interface Props {
  pomodoroTime: number;
  shortRestTime: number;
  longRestTime: number;
  cycles: number;

}

export function PomodoroTimer(props: Props): ReactElement{
  const [mainTime, setMainTime] = useState(props.pomodoroTime);
  const [timeCounting, setTimeCounting] = useState(false);
  const [working, setWorking] = useState(false);
  const [resting, setResting] = useState(false);
  const [cyclesQtdMananger, setCyclesQtdMananger] = useState(
    new Array(props.cycles - 1).fill(true),
  );

  const [completedCycles, setCompletedCycles] = useState(0);
  const [fullWorkingTime, setfullWorkingTime] = useState(0);
  const [numberOfPomodoros, setnumberOfPomodoros] = useState(0);


  useInterval(() => {
    setMainTime(mainTime - 1);
    if (working) setfullWorkingTime(fullWorkingTime + 1);
  },
  timeCounting ? 1000 : null,
  );

  const configureWork = useCallback(() => {
    setTimeCounting(true);
    setWorking(true);
    setResting(false);
    setMainTime(props.pomodoroTime);
    audioStartWorking.play();
  }, [
    setTimeCounting,
    setWorking,
    setResting,
    setMainTime,
    props.pomodoroTime
  ]);

  const configureRest = useCallback((long: boolean) => {
    setTimeCounting(true);
    setWorking(false);
    setResting(true)

    if (long) {
      setMainTime(props.longRestTime)
    } else {
      setMainTime(props.shortRestTime);
    }

    audioStopWorking.play();
  }, [
    setTimeCounting,
    setWorking, setResting,
    setMainTime,
    props.longRestTime,
    props.shortRestTime
  ]);

  useEffect(() => {
    if (working) document.body.classList.add('working');
    if(resting) document.body.classList.remove('working');

    if(mainTime > 0) return;

    if (working && cyclesQtdMananger.length > 0) {
      configureRest(false);
      cyclesQtdMananger.pop();
    } else if (working && cyclesQtdMananger.length <= 0) {
      configureRest(true);
      setCyclesQtdMananger(new Array(props.cycles - 1).fill(true));
      setCompletedCycles(completedCycles + 1);
    }

    if (working) setnumberOfPomodoros (numberOfPomodoros + 1);
    if (resting) configureWork();
  }, [
    working,
    resting,
    mainTime,
    cyclesQtdMananger,
    numberOfPomodoros,
    completedCycles,
    configureRest,
    configureWork,
    props.cycles,
  ]);


  return <div className="pomodoro">
    <h2>Você esta: {working ? 'Trabalhando' : 'Descansando'}</h2>
    <Timer mainTime={mainTime} />
    <div className="controls">
      <Button text="Work" onClick={() => configureWork()}></Button>
      <Button text="Rest" onClick={() => configureRest(false)}></Button>
      <Button
      className={!working && !resting ? 'hidden' : ''}
       text={timeCounting ? 'Pause' : 'Play'}
       onClick={() => setTimeCounting(!timeCounting)}></Button>
    </div>

    <div className="details">
      <p>Ciclos concluídos: {completedCycles}</p>
      <p>Horas trabalhadas: {secondsToTime(fullWorkingTime)}</p>
      <p>Pomodoros concluídos: {numberOfPomodoros}</p>
    </div>
  </div>
}
