import React, { useState } from "react";
import classNames from "../utils/class-names";
import useInterval from "../utils/useInterval";
import Button from './Button'
import SessionHeader from "./SessionHeader";
import SessionSection from "./SessionSection";

// These functions are defined outside of the component to ensure they do not have access to state
// and are, therefore, more likely to be pure.

/**
 * Update the session state with new state after each tick of the interval.
 * @param prevState
 *  the previous session state
 * @returns
 *  new session state with timing information updated.
 */
function nextTick(prevState) {
  const timeRemaining = Math.max(0, prevState.timeRemaining - 1);

  return {
    ...prevState,
    timeRemaining,
  };
}

/**
 * Higher-order function that returns a function to update the session state with the next session type upon timeout.
 * @param focusDuration
 *    the current focus duration
 * @param breakDuration
 *    the current break duration
 * @returns
 *  function to update the session state.
 */
function nextSession(focusDuration, breakDuration) {
  /**
   * State function to transition the current session type to the next session. e.g. On Break -> Focusing or Focusing -> On Break
   */
  return (currentSession) => {
    if (currentSession.label === "Focusing") {
      return {
        label: "On Break",
        timeRemaining: breakDuration * 60,
      };
    }
    return {
      label: "Focusing",
      timeRemaining: focusDuration * 60,
    };
  };
}

function Pomodoro() {
  // Timer starts out paused
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  // The current session - null where there is no session running
  const [session, setSession] = useState(null);
	const [focusDuration, setFocusDuration] = useState(() => 25);
	const [breakDuration, setBreakDuration] = useState(() => 5);

	const decrementFocusDuration = () => setFocusDuration((prevFocusDuration) => Math.max(5, prevFocusDuration - 5));
	const incrementFocusDuration = () => setFocusDuration((prevFocusDuration) => Math.min(60, prevFocusDuration + 5));

	const decrementBreakDuration = () => setBreakDuration((prevBreakDuration) => Math.max(1, prevBreakDuration - 1));
	const incrementBreakDuration = () => setBreakDuration((prevBreakDuration) => Math.min(15, prevBreakDuration + 1));

  // ToDo: Allow the user to adjust the focus and break duration.


  /**
   * Custom hook that invokes the callback function every second
   *
   * NOTE: You won't need to make changes to the callback function
   */
  useInterval(() => {
      if (session.timeRemaining === 0) {
        new Audio("https://bigsoundbank.com/UPLOAD/mp3/1482.mp3").play();
        return setSession(nextSession(focusDuration, breakDuration));
      }
      return setSession(nextTick);
    },
    isTimerRunning ? 1000 : null
  );

	// // useInterval hook to update label/width values
	const focusLabelInSeconds = focusDuration * 60;
	const breakLabelInSeconds = breakDuration * 60;
	const shouldUseFocus = session?.label === "Focusing";
	const num = shouldUseFocus ? focusLabelInSeconds : breakLabelInSeconds;

  /**
   * Called whenever the play/pause button is clicked.
   */
  function playPause() {
    setIsTimerRunning((prevState) => {
      const nextState = !prevState;
      if (nextState) {
        setSession((prevStateSession) => {
          // If the timer is starting and the previous session is null,
          // start a focusing session.
          if (prevStateSession === null) {
            return {
              label: "Focusing",
              timeRemaining: focusDuration * 60,
            };
          }
          return prevStateSession;
        });
      }
      return nextState;
    });
  }
  /**
   * Called whenever the stop button is clicked.
   */
  function stop() {
    setIsTimerRunning(() => {
        setSession(() => null);
      return false;
    });
  }
	// a function that shows a numeric value as time in mm:ss format
	const formatTime = (duration) => `${duration < 10 ? '0' : ''}${duration}:00`

	// a function that formats seconds to minutes and seconds in mm:ss format
	const formatSeconds = (seconds) => {
		if (!seconds) return

		const minutes = Math.floor(seconds / 60)
		const remainingSeconds = seconds % 60
		return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
	}

  return (
    <div className="pomodoro">
      <div className="row">
        <div className="col">
          <div className="input-group input-group-lg mb-2">
            <span className="input-group-text" data-testid="duration-focus">
              Focus Duration: {formatTime(focusDuration)}
            </span>
            <div className="input-group-append">

              <Button
                className="btn btn-secondary"
                data-testid="decrease-focus"
								onClick={decrementFocusDuration}
              >
                <span className="oi oi-minus" />
              </Button>

              <Button
                className="btn btn-secondary"
                data-testid="increase-focus"
								onClick={incrementFocusDuration}
              >
                <span className="oi oi-plus" />
              </Button>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="float-right">
            <div className="input-group input-group-lg mb-2">
              <span className="input-group-text" data-testid="duration-break">
                Break Duration: {formatTime(breakDuration)}
              </span>
              <div className="input-group-append">

                <Button
                  className="btn btn-secondary"
                  data-testid="decrease-break"
									onClick={decrementBreakDuration}
                >
                  <span className="oi oi-minus" />
                </Button>

                <Button
                  className="btn btn-secondary"
                  data-testid="increase-break"
									onClick={incrementBreakDuration}
                >
                  <span className="oi oi-plus" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div
            className="btn-group btn-group-lg mb-2"
            role="group"
            aria-label="Timer controls"
          >
            <Button
              className="btn btn-primary"
              data-testid="play-pause"
              title="Start or pause timer"
              onClick={playPause}
            >
              <span
                className={classNames({
                  oi: true,
                  "oi-media-play": !isTimerRunning,
                  "oi-media-pause": isTimerRunning,
                })}
              />
            </Button>

            <Button
              className="btn btn-secondary"
              data-testid="stop"
              title="Stop the session"
							disabled={!isTimerRunning}
							onClick={stop}
            >
              <span className="oi oi-media-stop" />
            </Button>
          </div>
        </div>
      </div>
      <div>
				<SessionSection session={session}>
					<SessionHeader
						label={`${session?.label} for ${formatTime(session?.label === 'Focusing' ? focusDuration : breakDuration)} minutes`}>
						{formatSeconds(session?.timeRemaining)} remaining
					</SessionHeader>
					<div className="row mb-2">
						<div className="col">
							<div className="progress" style={{ height: "20px" }}>
								<div
									className="progress-bar"
									role="progressbar"
									aria-valuemin="0"
									aria-valuemax="100"
									aria-valuenow={100 - (session?.timeRemaining / num * 100)} // TODO: Increase aria-valuenow as elapsed time increases
									style={{ width: `${100 - (session?.timeRemaining / num * 100)}%` }} // TODO: Increase width % as elapsed time increases
								/>
							</div>
						</div>
					</div>
				</SessionSection>
      </div>
    </div>
  );
}

export default Pomodoro;
