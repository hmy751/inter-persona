"use client";
import { useAudioStore } from "@/store/useAudioStore";
import React, { useEffect, useRef } from "react";

const AudioPlayer = () => {
  const { audioFile, setAudioElement } = useAudioStore();
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      setAudioElement(audioRef.current);
    }
  }, [setAudioElement]);

  return (
    <audio ref={audioRef} autoPlay style={{ display: "none" }}>
      <source src={audioFile} type="audio/mpeg" />
    </audio>
  );
};

export default AudioPlayer;
