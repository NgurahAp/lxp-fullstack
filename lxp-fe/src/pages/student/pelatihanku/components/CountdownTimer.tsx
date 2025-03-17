import React, { useState, useEffect, useRef } from "react";

interface CountdownTimerProps {
  initialDuration: number;
  onTimeUp: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  initialDuration,
  onTimeUp,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(initialDuration);
  const hasTimedUp = useRef<boolean>(false);

  useEffect(() => {
    if (timeLeft <= 0 && !hasTimedUp.current) {
      hasTimedUp.current = true;
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  // Reset the ref when the component unmounts
  useEffect(() => {
    return () => {
      hasTimedUp.current = false;
    };
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <span
      className={`font-bold ${
        timeLeft <= 60 ? "text-red-600" : "text-red-500"
      }`}
    >
      {minutes}:{seconds.toString().padStart(2, "0")}
    </span>
  );
};

export default CountdownTimer;
