import React, { useState, useEffect } from "react";

interface CountdownTimerProps {
  initialDuration: number;
  onTimeUp: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  initialDuration,
  onTimeUp,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(initialDuration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

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
