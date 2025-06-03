import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Moon, Sun } from "lucide-react";

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());
  const [theme, setTheme] = useState("light");
  const [gradientAngle, setGradientAngle] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (theme === "light") {
      const interval = setInterval(() => {
        setGradientAngle((prev) => (prev + 1) % 360);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [theme]);

  const formattedTime = useMemo(() => {
    const hours = String(time.getHours()).padStart(2, "0");
    const minutes = String(time.getMinutes()).padStart(2, "0");
    const seconds = String(time.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }, [time]);

  const generateStar = useCallback(() => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    opacity: Math.random(),
    delay: Math.random() * 2,
  }), []);

  const [stars, setStars] = useState(() =>
    Array.from({ length: 50 }, generateStar),
  );

  useEffect(() => {
    if (theme === "dark") {
      const interval = setInterval(() => {
        setStars((prevStars) =>
          prevStars.map((star) => {
            const newOpacity = star.opacity - 0.02;
            if (newOpacity <= 0) {
              return generateStar();
            }
            return { ...star, opacity: newOpacity };
          }),
        );
      }, 100);
      return () => clearInterval(interval);
    }
  }, [theme, generateStar]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div
      className={`relative flex min-h-screen flex-col items-center justify-center transition-colors duration-500 ${
        theme === "dark" ? "bg-black" : "bg-gradient-to-r from-purple-100 to-blue-200"
      }`}
      style={{
        background:
          theme === "light"
            ? `linear-gradient(${gradientAngle}deg, hsl(${gradientAngle % 360}, 70%, 90%), hsl(${(gradientAngle + 120) % 360}, 70%, 90%))`
            : undefined,
      }}
    >
      {theme === "dark" && (
        <>
          {stars.map((star, i) => (
            <div
              key={i}
              className="absolute size-1 rounded-full bg-white"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                opacity: star.opacity,
                animation: `twinkle ${2 + Math.random() * 2}s infinite ${star.delay}s`,
              }}
            />
          ))}
          <style jsx>{`
            @keyframes twinkle {
              0%, 100% { opacity: ${0.2 + Math.random() * 0.5}; }
              50% { opacity: ${0.7 + Math.random() * 0.3}; }
            }
          `}</style>
        </>
      )}

      <div
        className={`rounded-lg p-8 shadow-2xl ${
          theme === "dark" ? "bg-black bg-opacity-75" : "bg-white bg-opacity-90"
        } transition-colors duration-500`}
      >
        <div className="text-6xl font-bold tracking-wider text-white md:text-8xl">
          <span
            className={`font-mono ${theme === "dark" ? "text-white" : "text-gray-800"}`}
          >
            {formattedTime}
          </span>
        </div>
      </div>

      <button
        onClick={toggleTheme}
        className="absolute right-4 top-4 rounded-full p-2 transition-colors duration-300 hover:bg-white hover:bg-opacity-20"
        aria-label="Toggle theme"
      >
        {theme === "light" ? (
          <Moon className="size-6 text-gray-800" />
        ) : (
          <Sun className="size-6 text-yellow-400" />
        )}
      </button>
    </div>
  );
};

export default DigitalClock;
