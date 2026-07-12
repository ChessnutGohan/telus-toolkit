"use client";

import { useTheme } from "@/context/ThemeContext";

const PETALS = [
    { left: "5%",  delay: "0s",   duration: "6s",  char: "🌸" },
    { left: "15%", delay: "1.5s", duration: "8s",  char: "🍃" },
    { left: "25%", delay: "3s",   duration: "7s",  char: "🌸" },
    { left: "35%", delay: "0.5s", duration: "9s",  char: "🍃" },
    { left: "50%", delay: "2s",   duration: "6.5s",char: "🌸" },
    { left: "60%", delay: "4s",   duration: "8s",  char: "🍃" },
    { left: "70%", delay: "1s",   duration: "7.5s",char: "🌸" },
    { left: "80%", delay: "3.5s", duration: "6s",  char: "🍃" },
    { left: "90%", delay: "2.5s", duration: "9s",  char: "🌸" },
    { left: "95%", delay: "0s",   duration: "7s",  char: "🍃" },
]

export default function PetalOverlay() {
    const { mangaMode } = useTheme();
    if (!mangaMode) return null;

    return (
        <>
            {PETALS.map((p, i) => (
                <div
                    key={i}
                    className="petal"
                    style={{
                        left: p.left,
                        top: "-20px",
                        animationDelay: p.delay,
                        animationDuration: p.duration
                    }}
                >
                    {p.char}
                </div>
            ))}
        </>
    );
}