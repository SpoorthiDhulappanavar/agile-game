import { useEffect, useState, useMemo, useContext } from "react";
import { Link } from "react-router-dom";
import { getTime } from "../utils/Utils";
import { useNavigate } from "react-router-dom";
import sfx from "../sounds/mixkit-alert-alarm-1005.mp3";
import {
    GameScoreContext,
    GameIterationContext,
    TimerContext,
    EstimateContext,
    TeamNameContext,
} from "../App";

const TimerPage = ({ timeInSeconds, soundEnabled }) => {
    const [time, setTime] = useState(timeInSeconds);
    const [typeOfTimer] = useContext(TimerContext);
    const navigate = useNavigate();
    const audio = useMemo(() => new Audio(sfx), []);
    const [gameScore, setGameScore] = useContext(GameScoreContext);
    const [gameIteration, setGameIteration] = useContext(GameIterationContext);
    const [, setEstimateScore] = useContext(EstimateContext);
    const [teamName, setTeamName] = useContext(TeamNameContext);

    useEffect(() => {
        const timerId = setInterval(() => {
            if (Math.round(time * 10) / 10 >= 0.1) {
                setTime((time) => time - 1);
                return;
            }
        }, 1000);

        if (Math.round(time * 10) / 10 === 0) {
            setTime(0);
            if (soundEnabled) audio.play();
            return;
        }

        return () => {
            clearInterval(timerId);
        };
    }, [time, navigate, timeInSeconds, audio, soundEnabled]);

    useEffect(() => {
        let intervalId;

        if (soundEnabled && typeOfTimer === "oneMin" && time !== 0) {
            intervalId = setInterval(() => {
                setGameScore((prevGameScore) => {
                    const updatedGameScore = [...prevGameScore];
                    updatedGameScore[gameIteration - 1] = {
                        ...updatedGameScore[gameIteration - 1],
                        ballsInBox:
                            updatedGameScore[gameIteration - 1].ballsInBox + 1,
                    };
                    return updatedGameScore;
                });
            }, 1000);
        }

        return () => {
            clearInterval(intervalId);
        };
    }, [time, gameIteration, gameScore, soundEnabled, setGameScore, typeOfTimer]);

    return (
        <div className="text-center py-40 text-slate-50">
            <div className="text-7xl md:text-8xl lg:text-9xl">
                {getTime(time)}
            </div>
            {!soundEnabled && (
                <div className="flex flex-col justify-center items-center">
                    <div className="w-4/5 mb-10 text-3xl md:text-4xl lg:text-5xl">
                        Enter Your Team Name and Estimate How Many Points You
                        Will Score In Iteration 1!
                    </div>
                    <div className="flex flex-row mb-10">
                        <span className="mx-2 mt-2 text-2xl md:text-3xl lg:text-4xl">
                            Team Name:
                        </span>
                        <input
                            autoComplete="false"
                            type="text"
                            className="border border-black rounded-lg w-fit h-16 text-center text-2xl md:text-3xl lg:text-4xl"
                            placeholder="Enter Team Name..."
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                        />
                        <span className="mx-2 mt-2 text-2xl md:text-3xl lg:text-4xl">
                            Estimated Score:
                        </span>
                        <input
                            autoComplete="false"
                            type="number"
                            className="border border-black rounded-lg w-44 h-16 text-center text-2xl md:text-3xl lg:text-4xl"
                            onChange={(e) => {
                                setEstimateScore(
                                    isNaN(parseInt(e.target.value))
                                        ? 0
                                        : parseInt(e.target.value)
                                );
                                setGameScore((prevGameScore) => {
                                    return prevGameScore.map((score, index) => {
                                        if (index === 0) {
                                            return {
                                                ...score,
                                                estimatedScore: parseInt(
                                                    e.target.value
                                                ),
                                            };
                                        } else {
                                            return score;
                                        }
                                    });
                                });
                            }}
                        />
                    </div>
                </div>
            )}
            <div className="text-4xl md:text-5xl lg:text-6xl">
                {" "}
                {time === 0 ? "Time's Up!" : ""}
            </div>
            {time === 0 && soundEnabled ? (
                <Link
                    to="/game"
                    className="text-6xl px-5"
                    onClick={
                        typeOfTimer === "oneMin"
                            ? () => {
                                  audio.pause();
                                  setGameIteration(gameIteration + 1);
                                  setGameScore((prevGameScore) => {
                                      return prevGameScore.map(
                                          (score, index) => {
                                              if (index === gameIteration - 1) {
                                                  return {
                                                      ...score,
                                                      delta:
                                                          -1 *
                                                          (prevGameScore[index]
                                                              .estimatedScore -
                                                              prevGameScore[
                                                                  index
                                                              ].ballsInBox +
                                                              prevGameScore[
                                                                  index
                                                              ].defects),

                                                      totalScore:
                                                          prevGameScore[index]
                                                              .ballsInBox -
                                                          prevGameScore[index]
                                                              .defects,
                                                  };
                                              } else {
                                                  return score;
                                              }
                                          }
                                      );
                                  });
                              }
                            : () => {
                                  audio.pause();
                                  setGameScore((prevGameScore) => {
                                      return prevGameScore.map(
                                          (score, index) => {
                                              if (index === gameIteration - 1) {
                                                  return {
                                                      ...score,
                                                      estimatedScore:
                                                          prevGameScore[index]
                                                              .estimatedScore,
                                                  };
                                              } else {
                                                  return score;
                                              }
                                          }
                                      );
                                  });
                              }
                    }
                >
                    Next
                </Link>
            ) : time === 0 && !soundEnabled ? (
                <Link
                    to="/game"
                    className="px-5 text-3xl md:text-4xl lg:text-5xl"
                >
                    Press Here to Continue!
                </Link>
            ) : null}
        </div>
    );
};
export default TimerPage;
