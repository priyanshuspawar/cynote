"use client";

import { motion } from "motion/react";
import { stringToColor } from "@/lib/utils";
const FollowPointer = ({
  x,
  y,
  info,
}: {
  x: number;
  y: number;
  info: {
    email: string;
    avatar: string;
  };
}) => {
  const color = stringToColor(info?.email || "");
  return (
    <motion.div
      className="w-4 h-4 rounded-full absolute z-50"
      style={{
        top: y,
        left: x,
        pointerEvents: "none",
      }}
      initial={{
        scale: 1,
        opacity: 1,
      }}
      exit={{
        scale: 0,
        opacity: 0,
      }}
    >
      <svg
        stroke={color}
        fill={color}
        stroke-width="1"
        viewBox="0 0 16 16"
        className={`h-6 w-6 text-[${color}] transform -rotate-[70deg] -translate-x-[12px] -translate-y-[10px] stroke-[${color}]`}
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L7.57 10.094.803 8.652a.5.5 0 1 0-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z"></path>
      </svg>
      <motion.div
        className="absolute top-3 left-2 rounded-3xl p-2"
        style={{ backgroundColor: color, borderRadius: 20 }}
        initial={{
          scale: 0.5,
          opacity: 0,
        }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        exit={{
          scale: 0.5,
          opacity: 0,
        }}
      >
        <p className="whitespace-nowrap text-sm leading-relaxed text-white">
          {info.email}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default FollowPointer;
