"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import QRCode from "qrcode";
import { useOps } from "@/lib/ops-dict";
import { getCertificate, useDb, type Certificate } from "@/lib/db";
import { site } from "@/lib/site";
import { withBase } from "@/lib/base";

const verifyUrl = (id: string) => `${site.url}/certificate/?id=${id}`;

export default function CertificateView() {
  const o = useOps();
  const params = useSearchParams();
  const router = useRouter();
  const id = (params.get("id") || "").trim().toUpperCase();
  const [input, setInput] = useState(id);
  const [copied, setCopied] = useState(false);
  const { data: cert, error } = useDb(() => getCertificate(id), [id]);
  const loading = Boolean(id) && cert === null && !error;

  return (
    <section className="container-edge mx-auto max-w-edge pb-24 pt-32 md:pt-40">
      <div className="print:hidden">
        <p className="text-xs uppercase tracking-ultra text-mint">{o.cert.kicker}</p>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tightest text-bone-50 md:text-6xl">
          {o.cert.verifyTitle}
        </h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (input.trim()) router.replace(`/certificate/?id=${input.trim().toUpperCase()}`);
          }}
          className="mt-8 flex max-w-lg gap-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value.toUpperCase())}
            placeholder={o.cert.verifyPh}
            dir="ltr"
            className="min-w-0 grow rounded-xl border border-line/15 bg-ink-900 px-4 py-3 font-mono text-sm tracking-wider text-bone-50 placeholder:text-bone-500/50 focus:border-mint/60 focus:outline-none"
          />
          <button type="submit" className="btn btn-primary shrink-0 px-7">
            {o.cert.verifyBtn}
          </button>
        </form>

        {id && !loading && !cert && (
          <p className="mt-6 text-sm text-bone-400">{o.cert.notFound}</p>
        )}
        {cert && (
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-mint/15 px-4 py-2 text-sm font-medium text-mint">
              {o.cert.valid}
            </span>
            <button type="button" onClick={() => window.print()} className="btn btn-primary px-6 py-2.5 text-sm">
              {o.cert.print}
            </button>
            <button
              type="button"
              onClick={() =>
                navigator.clipboard?.writeText(verifyUrl(cert.id)).then(() => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1800);
                })
              }
              className="btn btn-ghost px-6 py-2.5 text-sm"
            >
              {copied ? o.cert.copied : o.cert.share}
            </button>
          </div>
        )}
      </div>

      {cert && (
        <div className="mt-10 overflow-x-auto print:mt-0 print:overflow-visible">
          <CertificateSheet cert={cert} />
        </div>
      )}

      {/* print just the sheet, edge to edge, on landscape A4 */}
      <style>{`
        @media print {
          @page { size: A4 landscape; margin: 0; }
          html, body { background: #fff !important; }
          body * { visibility: hidden !important; }
          .cert-sheet, .cert-sheet * { visibility: visible !important; }
          .cert-sheet { position: fixed !important; inset: 0 !important; width: 297mm !important;
            height: 210mm !important; max-width: none !important; border-radius: 0 !important;
            box-shadow: none !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
    </section>
  );
}

// ----------------------------------------------------------------------------
// The sheet itself. Sized in container units so it scales from phone to print.
export function CertificateSheet({ cert }: { cert: Certificate }) {
  const [qr, setQr] = useState("");

  useEffect(() => {
    QRCode.toDataURL(verifyUrl(cert.id), {
      margin: 0,
      width: 220,
      color: { dark: "#141219", light: "#00000000" },
    }).then(setQr);
  }, [cert.id]);

  const date = new Date(cert.issuedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div
      className="cert-sheet relative mx-auto aspect-[297/210] w-full min-w-[640px] max-w-[1100px] overflow-hidden rounded-xl shadow-[0_30px_90px_rgb(0_0_0/0.45)]"
      style={{ containerType: "inline-size", background: "#F7F4EF", color: "#141219" }}
      dir="ltr"
    >
      {/* guilloche: fine concentric linework, the classic anti-copy texture */}
      <svg aria-hidden className="absolute inset-0 h-full w-full" viewBox="0 0 297 210" preserveAspectRatio="none">
        <defs>
          <linearGradient id="cg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#E237C7" />
            <stop offset="1" stopColor="#38D1E0" />
          </linearGradient>
        </defs>
        <g fill="none" stroke="url(#cg)" strokeWidth="0.12" opacity="0.32">
          {Array.from({ length: 34 }, (_, i) => (
            <ellipse key={i} cx="250" cy="170" rx={18 + i * 4.2} ry={10 + i * 2.6} transform={`rotate(${i * 5} 250 170)`} />
          ))}
        </g>
        <rect x="6" y="6" width="285" height="198" fill="none" stroke="#141219" strokeWidth="0.35" />
        <rect x="8" y="8" width="281" height="194" fill="none" stroke="url(#cg)" strokeWidth="0.6" />
      </svg>

      {/* ink band with the brand */}
      <div className="absolute inset-y-[3.8%] start-[3.6%] flex w-[15%] flex-col items-center justify-between rounded-[0.6cqw] bg-[#141219] py-[3cqw] text-[#F7F4EF]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={withBase("/lms/logo.svg")} alt="" className="w-[8.5cqw] rounded-full ring-1 ring-white/20" />
        <p
          className="font-display font-semibold uppercase"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", fontSize: "1.25cqw", letterSpacing: "0.5em" }}
        >
          Mohamed Tarek Academy
        </p>
        <span className="h-[0.25cqw] w-[6cqw] rounded-full" style={{ background: "linear-gradient(90deg,#E237C7,#38D1E0)" }} />
      </div>

      {/* body */}
      <div className="absolute inset-y-[9%] end-[6%] start-[24%] flex flex-col">
        <p className="font-display font-semibold uppercase" style={{ fontSize: "1.3cqw", letterSpacing: "0.55em" }}>
          Certificate of completion
        </p>
        <p className="mt-[3.2cqw] font-serif italic text-[#5a5466]" style={{ fontSize: "1.7cqw" }}>
          This certifies that
        </p>
        <p
          className="mt-[0.6cqw] font-serif italic leading-[1.05]"
          style={{ fontSize: cert.name.length > 24 ? "4.6cqw" : "5.8cqw" }}
          dir="auto"
        >
          {cert.name}
        </p>
        <span className="mt-[1.4cqw] h-[0.18cqw] w-[38%]" style={{ background: "linear-gradient(90deg,#E237C7,#38D1E0)" }} />
        <p className="mt-[1.8cqw] max-w-[78%] text-[#3b3644]" style={{ fontSize: "1.45cqw", lineHeight: 1.5 }}>
          has completed the course and passed a personally reviewed final project in
        </p>
        <p className="mt-[0.8cqw] font-display font-semibold tracking-tight" style={{ fontSize: "3cqw", lineHeight: 1.1 }}>
          {cert.courseTitle}
        </p>

        {/* footer row */}
        <div className="mt-auto flex items-end justify-between gap-[3cqw]">
          <div>
            <p className="font-serif italic" style={{ fontSize: "2.6cqw", lineHeight: 1 }}>
              Mohamed Tarek
            </p>
            <span className="mt-[0.6cqw] block h-px w-[20cqw] bg-[#141219]" />
            <p className="mt-[0.6cqw] uppercase text-[#5a5466]" style={{ fontSize: "0.95cqw", letterSpacing: "0.2em" }}>
              Instructor · Sr Designer &amp; Team Lead
            </p>
          </div>
          <div>
            <p className="uppercase text-[#5a5466]" style={{ fontSize: "0.9cqw", letterSpacing: "0.22em" }}>
              Issued
            </p>
            <p className="mt-[0.3cqw] font-semibold" style={{ fontSize: "1.4cqw" }}>
              {date}
            </p>
            <p className="mt-[1cqw] uppercase text-[#5a5466]" style={{ fontSize: "0.9cqw", letterSpacing: "0.22em" }}>
              Certificate ID
            </p>
            <p className="mt-[0.3cqw] font-mono font-semibold" style={{ fontSize: "1.4cqw" }}>
              {cert.id}
            </p>
          </div>
          <div className="flex flex-col items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {qr && <img src={qr} alt="" className="w-[8cqw]" />}
            <p className="mt-[0.5cqw] text-[#5a5466]" style={{ fontSize: "0.75cqw" }}>
              Scan to verify
            </p>
          </div>
        </div>
      </div>

      {/* seal */}
      <div className="absolute end-[5%] top-[7%] w-[13cqw]">
        <svg viewBox="0 0 120 120" className="w-full">
          <defs>
            <path id="sealPath" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
            <linearGradient id="sg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#E237C7" />
              <stop offset="1" stopColor="#38D1E0" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="60" r="57" fill="none" stroke="url(#sg)" strokeWidth="2.4" />
          <circle cx="60" cy="60" r="35" fill="#141219" />
          <text fill="#141219" style={{ fontSize: 8.6, letterSpacing: 2.4, fontWeight: 600 }}>
            <textPath href="#sealPath">PERSONALLY REVIEWED · FINAL PROJECT ·</textPath>
          </text>
          <text x="60" y="66" textAnchor="middle" fill="#F7F4EF" className="font-serif" style={{ fontSize: 20, fontStyle: "italic" }}>
            MT
          </text>
        </svg>
      </div>

    </div>
  );
}
