import { useContext, useEffect, useState } from "react";
import { GameContext } from '../context/GameContext';
import { useGetData, useUpdateData } from '../api/Api';
import './Navbar.scss';

export default function Navbar() {
  const context = useContext(GameContext);
  const [timer, setTimer] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [finalTimerResult, setFinalTimerResult] = useState<number | null>(null);

  const initialId = '67c8881551d111d53dd71c90';

  
  const {
    data,
    loadingGet,
    errorGet,
    getData,
  } = useGetData(initialId);

  const {
    loadingUpdate,
    errorUpdate,
    updateData,
  } = useUpdateData(initialId);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (!loadingUpdate && !errorUpdate) {
      getData();
    }
  }, [loadingUpdate]);

  useEffect(() => {
    if (data !== null && errorGet === null && !loadingGet) {
      if (context?.score && Number(context.score) > Number(data.score)) {
        updateData(initialId, context?.score);
      } else {
        setBestScore(data.score);
      }
    }
  }, [data]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (context?.gameStatus === true) {
      // game started
      setFinalTimerResult(null);
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer + 10);
      }, 10);
    } else if (context?.gameStatus === null) {
      // game reset
      setFinalTimerResult(null);
      setTimer(0);
    } else if (context?.gameStatus === false) {
      // game over and paused
      getData();
      setFinalTimerResult(timer);
      setTimer(0);
    }
    return () => clearInterval(interval);
  }, [context?.gameStatus]);

  const formatTime = (time: number) => {
    const seconds = Math.floor(time / 1000);
    const milliseconds = time % 1000;
    return `${seconds}.${milliseconds.toString().padStart(3, '0')}s`;
  };

  return (
    <div className="navbar">
      <nav className="navbar__container">
        <div className="navbar__timer">
          Timer: <span className="navbar__vt">{finalTimerResult !== null ? formatTime(finalTimerResult) : formatTime(timer)}</span>
        </div>
        <span className="navbar__score">
          Best score: <span className="navbar__vt">{loadingGet ? "...loading" : bestScore}</span>
        </span>
        <span className="navbar__score">
          Score: <span className="navbar__vt">{context?.score}</span>
        </span>
      </nav>
    </div>
  );
}
