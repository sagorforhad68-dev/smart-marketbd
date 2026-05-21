"use client";

import { useState, useEffect, useRef } from "react";

const PUNCH_LINES = [
  "কোটা ফালান দিলাম!",
  "হাইয়া! নিয়া যান!",
  "এইডা কিনবেন না তা ঘুষি খাবেন!",
  "দাম বেশি লাগলে ঘুষি খাবেন!",
  "অফার নিন নইলে মার খাবেন!",
  "বিক্রি করলাম আর ঘুষিও দিলাম!",
  "ডিসকাউন্ট চান? আগে ঘুষি নিন!",
  "এক ঘুষিতে ৫০% ছাড়!",
];

const MOVE_LINES = [
  "আের ভাই দাঁড়ান!",
  "এত কেন দাঁড়িয়ে আছেন?",
  "পণ্য না দেখাই যাচ্ছেন?",
  "আসেন ভাই, কথা আছে!",
  "দাম কমাবো, থেমে যান!",
  "ভাই ভাই ভাই!",
  "আের মিয়া!",
];

const IDLE_LINES = [
  "কী দেখছেন ভাই?",
  "কিছু কিনবেন?",
  "দাম একদম কম!",
  "অফার আছে ভাই!",
  "আমি মনু মিয়া! আমি এইখানেই আছি!",
  "মনু মিয়া এর সাথে কিনুন!",
];

export default function RobotCursor() {
  const [pos, setPos] = useState({ x: 300, y: 300 });
  const [msg, setMsg] = useState("আমি মনু মিয়া! Smart Market BD-তে স্বাগতম!");
  const [punch, setPunch] = useState(false);
  const [dir, setDir] = useState(1);
  const [running, setRunning] = useState(false);
  const [boom, setBoom] = useState<{ x: number; y: number } | null>(null);

  const target = useRef({ x: 300, y: 300 });
  const cur = useRef({ x: 300, y: 300 });
  const raf = useRef<number | undefined>(undefined);
  const idleT = useRef<NodeJS.Timeout | undefined>(undefined);

  const rand = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;

      if (e instanceof MouseEvent) {
        clientX = e.clientX;
        clientY = e.clientY;
      } else if (e instanceof TouchEvent && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }

      target.current = { x: clientX, y: clientY };

      if (idleT.current) clearTimeout(idleT.current);

      idleT.current = setTimeout(() => {
        setRunning(false);
        setMsg(rand(IDLE_LINES));
      }, 2000);
    };

    const onClick = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;

      if (e instanceof MouseEvent) {
        clientX = e.clientX;
        clientY = e.clientY;
      } else if (e instanceof TouchEvent && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }

      setPunch(true);
      setBoom({ x: clientX, y: clientY });
      setMsg(rand(PUNCH_LINES));
      setTimeout(() => {
        setPunch(false);
        setBoom(null);
      }, 600);
    };

    window.addEventListener("mousemove", onMove as EventListener);
    window.addEventListener("touchmove", onMove as EventListener);
    window.addEventListener("click", onClick as EventListener);
    window.addEventListener("touchstart", onClick as EventListener);

    return () => {
      window.removeEventListener("mousemove", onMove as EventListener);
      window.removeEventListener("touchmove", onMove as EventListener);
      window.removeEventListener("click", onClick as EventListener);
      window.removeEventListener("touchstart", onClick as EventListener);
    };
  }, []);

  useEffect(() => {
    const loop = () => {
      const dx = target.current.x - cur.current.x;
      const dy = target.current.y - cur.current.y;
      const d = Math.sqrt(dx * dx + dy * dy);

      if (d > 5) {
        cur.current = {
          x: cur.current.x + dx * 0.13,
          y: cur.current.y + dy * 0.13,
        };
        setPos({ ...cur.current });
        setDir(dx > 0 ? 1 : -1);
        setRunning(d > 25);

        if (d > 100 && Math.random() < 0.02) {
          setMsg(rand(MOVE_LINES));
        }
      }

      raf.current = requestAnimationFrame(loop);
    };

    raf.current = requestAnimationFrame(loop);

    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  const styles = `
    @keyframes legR { 0%,100%{transform:rotate(28deg)} 50%{transform:rotate(-28deg)} }
    @keyframes legL { 0%,100%{transform:rotate(-28deg)} 50%{transform:rotate(28deg)} }
    @keyframes boom { 0%{transform:scale(0.3);opacity:1} 100%{transform:scale(2.5);opacity:0} }
    @keyframes bob  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
    @keyframes glow { 0%,100%{opacity:0.6} 50%{opacity:1} }
    body { cursor: none; }
  `;

  return (
    <>
      <style>{styles}</style>

      {/* BOOM EFFECT */}
      {boom && (
        <div
          style={{
            position: "fixed",
            left: boom.x - 30,
            top: boom.y - 30,
            fontSize: 48,
            pointerEvents: "none",
            zIndex: 99999,
            animation: "boom 0.6s ease-out forwards",
          }}
        >
          💥
        </div>
      )}

      {/* SPEECH BUBBLE */}
      <div
        style={{
          position: "fixed",
          left: pos.x + (dir > 0 ? 38 : -200),
          top: pos.y - 80,
          background: "#fff",
          color: "#111",
          borderRadius: 12,
          padding: "7px 14px",
          fontSize: 13,
          fontWeight: 700,
          fontFamily: "'Hind Siliguri', sans-serif",
          whiteSpace: "nowrap",
          pointerEvents: "none",
          zIndex: 99998,
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          border: "2px solid #e63946",
          transition: "left 0.12s, top 0.12s",
          maxWidth: 220,
          overflowWrap: "break-word",
          wordWrap: "break-word",
        }}
      >
        {msg}
        <div
          style={{
            position: "absolute",
            bottom: -10,
            left: dir > 0 ? 16 : "auto",
            right: dir < 0 ? 16 : "auto",
            borderLeft: "8px solid transparent",
            borderRight: "8px solid transparent",
            borderTop: "10px solid #e63946",
          }}
        />
      </div>

      {/* ROBOT NAME BADGE */}
      <div
        style={{
          position: "fixed",
          left: pos.x - 22,
          top: pos.y - 75,
          background: "#e63946",
          color: "#fff",
          padding: "4px 12px",
          borderRadius: 20,
          fontSize: 11,
          fontWeight: 900,
          fontFamily: "'Hind Siliguri', sans-serif",
          pointerEvents: "none",
          zIndex: 99996,
          textAlign: "center",
          transition: "left 0.12s, top 0.12s",
        }}
      >
        মনু মিয়া
      </div>

      {/* ROBOT SVG */}
      <div
        style={{
          position: "fixed",
          left: pos.x - 22,
          top: pos.y - 55,
          pointerEvents: "none",
          zIndex: 99997,
          transform: `scaleX(${dir})`,
          transition: "transform 0.15s",
          filter: "drop-shadow(0 6px 14px rgba(230,57,70,0.4))",
        }}
      >
        <svg width="44" height="64" viewBox="0 0 44 64">
          {/* Shadow */}
          <ellipse cx="22" cy="62" rx="11" ry="3" fill="rgba(0,0,0,0.2)" />

          {/* Legs */}
          <g
            style={{
              transformOrigin: "15px 44px",
              animation: running
                ? "legL 0.3s infinite"
                : "none",
            }}
          >
            <rect x="11" y="44" width="8" height="12" rx="3" fill="#1565c0" />
            <rect x="9" y="54" width="11" height="6" rx="3" fill="#1e90ff" />
          </g>
          <g
            style={{
              transformOrigin: "29px 44px",
              animation: running
                ? "legR 0.3s infinite"
                : "none",
            }}
          >
            <rect x="25" y="44" width="8" height="12" rx="3" fill="#1565c0" />
            <rect x="24" y="54" width="11" height="6" rx="3" fill="#1e90ff" />
          </g>

          {/* Body */}
          <rect x="8" y="22" width="28" height="24" rx="7" fill="#1976d2" />
          <circle
            cx="22"
            cy="34"
            r="4"
            fill={punch ? "#ff4444" : "#00cfff"}
            style={{
              filter: `drop-shadow(0 0 5px ${punch ? "#f00" : "#0cf"})`,
            }}
          />
          <circle cx="15" cy="41" r="2" fill="#00cfff" />
          <circle cx="22" cy="41" r="2" fill="#ffd60a" />
          <circle cx="29" cy="41" r="2" fill="#06d6a0" />

          {/* Arms */}
          <g
            style={{
              transformOrigin: "8px 28px",
              transform: punch
                ? "rotate(-40deg) translateX(-8px)"
                : running
                ? "rotate(20deg)"
                : "rotate(0deg)",
              transition: "transform 0.1s",
            }}
          >
            <rect x="1" y="24" width="8" height="18" rx="4" fill="#1e90ff" />
            <rect x="0" y="40" width="10" height="8" rx="4" fill="#00cfff" />
          </g>
          <g
            style={{
              transformOrigin: "36px 28px",
              transform: running ? "rotate(-20deg)" : "rotate(0deg)",
              transition: "transform 0.1s",
            }}
          >
            <rect x="35" y="24" width="8" height="18" rx="4" fill="#1e90ff" />
            <rect x="34" y="40" width="10" height="8" rx="4" fill="#00cfff" />
          </g>

          {/* Head */}
          <rect x="6" y="4" width="32" height="20" rx="8" fill="#1976d2" />

          {/* Antenna */}
          <rect x="20" y="0" width="4" height="6" rx="2" fill="#90caf9" />
          <circle
            cx="22"
            cy="0"
            r="4"
            fill={punch ? "#f44" : "#ffd60a"}
            style={{ animation: "glow 1s ease-in-out infinite" }}
          />

          {/* Eyes */}
          {punch ? (
            <>
              <rect x="10" y="9" width="8" height="5" rx="2" fill="#f44" />
              <rect x="26" y="9" width="8" height="5" rx="2" fill="#f44" />
              <line
                x1="9"
                y1="7"
                x2="19"
                y2="11"
                stroke="#f44"
                strokeWidth="2"
              />
              <line
                x1="35"
                y1="7"
                x2="25"
                y2="11"
                stroke="#f44"
                strokeWidth="2"
              />
            </>
          ) : (
            <>
              <ellipse
                cx="16"
                cy="12"
                rx="5"
                ry="5"
                fill="#00e5ff"
                style={{ filter: "drop-shadow(0 0 3px #0cf)" }}
              />
              <ellipse
                cx="28"
                cy="12"
                rx="5"
                ry="5"
                fill="#00e5ff"
                style={{ filter: "drop-shadow(0 0 3px #0cf)" }}
              />
              <circle cx="17" cy="11" r="2" fill="#fff" />
              <circle cx="29" cy="11" r="2" fill="#fff" />
            </>
          )}

          {/* Mouth */}
          <path
            d={
              punch ? "M14 19 Q22 16 30 19" : "M14 19 Q22 23 30 19"
            }
            stroke="#90caf9"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </>
  );
}
