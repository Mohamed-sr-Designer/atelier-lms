"use client";

import { useEffect, useRef } from "react";

// Plays whatever the admin pasted for a lesson: Bunny Stream, YouTube,
// Vimeo or a plain video file. Direct files and Bunny report the playhead,
// which drives resume, auto-complete at 90% and timestamped notes.

type Kind = "file" | "bunny" | "youtube" | "vimeo" | "iframe";

export function videoKind(url: string): { kind: Kind; src: string } {
  const u = url.trim();
  const yt = u.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  if (yt)
    return {
      kind: "youtube",
      src: `https://www.youtube-nocookie.com/embed/${yt[1]}?rel=0&modestbranding=1`,
    };
  const vm = u.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return { kind: "vimeo", src: `https://player.vimeo.com/video/${vm[1]}?dnt=1` };
  if (/mediadelivery\.net/.test(u))
    return {
      kind: "bunny",
      src: u.replace("/play/", "/embed/") + (u.includes("?") ? "&" : "?") + "preload=true&responsive=true",
    };
  if (/\.(mp4|webm|mov)(\?|$)/i.test(u)) return { kind: "file", src: u };
  return { kind: "iframe", src: u };
}

export default function LessonPlayer({
  url,
  startAt = 0,
  onTime,
}: {
  url: string;
  startAt?: number;
  onTime?: (sec: number, total: number) => void; // throttled, ~every 5s
}) {
  const { kind, src } = videoKind(url);
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const lastSent = useRef(0);
  const report = useRef(onTime);
  report.current = onTime;

  const tick = (sec: number, total: number) => {
    if (Math.abs(sec - lastSent.current) < 5 && !(total && sec / total >= 0.9)) return;
    lastSent.current = sec;
    report.current?.(sec, total);
  };

  // Bunny's embed speaks the player.js postMessage protocol.
  useEffect(() => {
    if (kind !== "bunny") return;
    const send = (method: string, value?: unknown) =>
      frameRef.current?.contentWindow?.postMessage(
        JSON.stringify({ context: "player.js", version: "0.0.11", method, value }),
        "*"
      );
    const onMsg = (e: MessageEvent) => {
      if (e.source !== frameRef.current?.contentWindow) return;
      let d: { context?: string; event?: string; value?: { seconds?: number; duration?: number } };
      try {
        d = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
      } catch {
        return;
      }
      if (d?.context !== "player.js") return;
      if (d.event === "ready") {
        send("addEventListener", "timeupdate");
        if (startAt > 5) send("setCurrentTime", startAt);
      }
      if (d.event === "timeupdate" && d.value?.seconds != null) {
        tick(d.value.seconds, d.value.duration || 0);
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind, src]);

  if (kind === "file") {
    return (
      <video
        ref={videoRef}
        key={src}
        src={src}
        controls
        playsInline
        controlsList="nodownload"
        onContextMenu={(e) => e.preventDefault()}
        onLoadedMetadata={(e) => {
          const v = e.currentTarget;
          if (startAt > 5 && startAt < v.duration - 5) v.currentTime = startAt;
        }}
        onTimeUpdate={(e) => tick(e.currentTarget.currentTime, e.currentTarget.duration || 0)}
        className="absolute inset-0 h-full w-full bg-black"
      />
    );
  }

  return (
    <iframe
      ref={frameRef}
      key={src}
      src={src}
      title="Lesson video"
      allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
      allowFullScreen
      className="absolute inset-0 h-full w-full border-0 bg-black"
    />
  );
}

// "mm:ss" for notes and labels
export const clock = (sec: number) =>
  `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, "0")}`;
