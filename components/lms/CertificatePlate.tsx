"use client";

import { useCallback } from "react";
import { useLang } from "@/lib/i18n";
import { getCourse } from "@/lib/courses";
import type { Certificate } from "@/lib/store";

// The Atelier certificate: a charcoal plate with hairline double border,
// serif italics and an amber seal. Rendered as DOM for display and drawn to
// canvas (1600×1131) for a crisp PNG download.
export default function CertificatePlate({
  cert,
  className = "",
}: {
  cert: Certificate;
  className?: string;
}) {
  const { t, lang } = useLang();
  const course = getCourse(cert.slug);
  const dateStr = new Date(cert.date).toLocaleDateString(
    lang === "ar" ? "ar-EG" : "en-GB",
    { year: "numeric", month: "long", day: "numeric" }
  );

  const download = useCallback(() => {
    if (!course) return;
    const W = 1600;
    const H = 1131;
    const cv = document.createElement("canvas");
    cv.width = W;
    cv.height = H;
    const x = cv.getContext("2d");
    if (!x) return;

    // plate
    x.fillStyle = "#100F0D";
    x.fillRect(0, 0, W, H);
    // ember glow bottom-left
    const g = x.createRadialGradient(W * 0.12, H * 1.05, 60, W * 0.12, H * 1.05, H * 0.9);
    g.addColorStop(0, "rgba(255,90,31,0.32)");
    g.addColorStop(0.45, "rgba(255,90,31,0.08)");
    g.addColorStop(1, "rgba(255,90,31,0)");
    x.fillStyle = g;
    x.fillRect(0, 0, W, H);
    // double hairline border
    x.strokeStyle = "rgba(243,239,231,0.35)";
    x.lineWidth = 2;
    x.strokeRect(48, 48, W - 96, H - 96);
    x.strokeStyle = "rgba(243,239,231,0.14)";
    x.strokeRect(64, 64, W - 128, H - 128);

    const ivory = "#F3EFE7";
    const faded = "rgba(243,239,231,0.55)";
    const amber = "#FF5A1F";
    x.textAlign = "center";

    // masthead
    x.fillStyle = faded;
    x.font = "600 22px Arial";
    x.letterSpacing = "14px";
    x.fillText("ATELIER — SCHOOL OF VISUAL DIRECTION", W / 2, 150);
    x.letterSpacing = "0px";

    x.fillStyle = ivory;
    x.font = "italic 44px Georgia";
    x.fillText("Certificate of Completion", W / 2, 240);

    // student name
    x.fillStyle = amber;
    x.font = "italic 86px Georgia";
    x.fillText(cert.name, W / 2, 400);

    // line
    x.strokeStyle = "rgba(243,239,231,0.25)";
    x.beginPath();
    x.moveTo(W / 2 - 300, 440);
    x.lineTo(W / 2 + 300, 440);
    x.stroke();

    // course
    x.fillStyle = faded;
    x.font = "600 20px Arial";
    x.letterSpacing = "8px";
    x.fillText("HAS COMPLETED THE COURSE", W / 2, 510);
    x.letterSpacing = "0px";
    x.fillStyle = ivory;
    x.font = "600 46px Arial";
    const title = course.title.en;
    // wrap long titles
    if (x.measureText(title).width > W - 300) {
      const cut = title.indexOf("—") > 0 ? title.indexOf("—") : Math.floor(title.length / 2);
      x.fillText(title.slice(0, cut).trim(), W / 2, 590);
      x.fillText(title.slice(cut).trim(), W / 2, 650);
    } else {
      x.fillText(title, W / 2, 610);
    }

    // completion facts
    x.fillStyle = faded;
    x.font = "24px Arial";
    x.fillText(
      "All modules · Checkpoint quiz passed · Final project submitted",
      W / 2,
      730
    );

    // seal
    x.beginPath();
    x.arc(W / 2, 850, 56, 0, Math.PI * 2);
    x.strokeStyle = amber;
    x.lineWidth = 2.5;
    x.stroke();
    x.fillStyle = amber;
    x.font = "italic 52px Georgia";
    x.fillText("A", W / 2, 870);

    // footer row
    x.textAlign = "left";
    x.fillStyle = faded;
    x.font = "20px Arial";
    x.fillText(`Date: ${new Date(cert.date).toLocaleDateString("en-GB")}`, 120, H - 140);
    x.fillText(`Certificate ID: ${cert.id}`, 120, H - 105);
    x.textAlign = "right";
    x.fillStyle = ivory;
    x.font = "italic 34px Georgia";
    x.fillText("Mohamed Tarek", W - 120, H - 140);
    x.fillStyle = faded;
    x.font = "18px Arial";
    x.fillText("Instructor & Art Director", W - 120, H - 105);

    const a = document.createElement("a");
    a.download = `atelier-certificate-${cert.id}.png`;
    a.href = cv.toDataURL("image/png");
    a.click();
  }, [cert, course]);

  if (!course) return null;

  return (
    <div className={className}>
      {/* display plate */}
      <div className="relative overflow-hidden rounded-2xl border border-line/15 bg-ink-800 p-1.5">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(90% 70% at 10% 110%, rgb(var(--mint) / 0.22) 0%, transparent 60%)",
          }}
        />
        <div className="relative rounded-xl border border-line/15 px-6 py-10 text-center md:px-12 md:py-14">
          <p className="text-[10px] uppercase tracking-ultra text-bone-400 md:text-xs">
            Atelier — School of Visual Direction
          </p>
          <p className="mt-4 font-serif text-lg italic text-bone-200 md:text-xl">
            Certificate of Completion
          </p>
          <p className="mt-5 font-serif text-3xl italic text-mint md:text-5xl">
            {cert.name}
          </p>
          <div className="mx-auto mt-5 h-px w-40 bg-line/20 md:w-64" />
          <p className="mt-5 text-[10px] uppercase tracking-ultra text-bone-500">
            {t.course.certLabel}
          </p>
          <p className="mx-auto mt-2 max-w-lg text-balance text-lg font-semibold tracking-tight text-bone-50 md:text-xl">
            {course.title[lang]}
          </p>
          <div className="mx-auto mt-7 grid h-12 w-12 place-items-center rounded-full border border-mint/60 font-serif text-xl italic text-mint">
            A
          </div>
          <div className="mt-7 flex flex-wrap items-center justify-between gap-3 text-xs text-bone-500">
            <span>
              {t.certs.issuedOn}: {dateStr}
            </span>
            <span dir="ltr">{cert.id}</span>
            <span className="font-serif italic text-bone-200">Mohamed Tarek</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-xs text-bone-500">{t.certs.verify}</p>
        <button
          type="button"
          onClick={download}
          className="rounded-full bg-mint px-5 py-2.5 text-sm font-medium text-ink-900 transition-transform duration-300 hover:scale-[1.04]"
        >
          {t.common.downloadPng}
        </button>
      </div>
    </div>
  );
}
