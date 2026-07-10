"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n";
import type { QuizQ } from "@/lib/courses";

const PASS = 5; // out of 6

// Checkpoint quiz: six decision-questions, pass 5 to clear. Feedback per
// answer after checking; the parent handles what "passed" unlocks.
export default function QuizPanel({
  quiz,
  onPass,
  passed,
}: {
  quiz: QuizQ[];
  onPass: () => void;
  passed: boolean;
}) {
  const { t } = useLang();
  const [answers, setAnswers] = useState<(number | null)[]>(
    quiz.map(() => null)
  );
  const [checked, setChecked] = useState(false);

  const score = quiz.reduce(
    (n, q, i) => n + (answers[i] === q.a ? 1 : 0),
    0
  );
  const allAnswered = answers.every((a) => a !== null);

  const check = () => {
    setChecked(true);
    if (score >= PASS) onPass();
  };

  const retry = () => {
    setAnswers(quiz.map(() => null));
    setChecked(false);
  };

  return (
    <div>
      <p className="text-sm leading-relaxed text-bone-400">{t.learn.quizIntro}</p>

      <ol className="mt-8 grid gap-8">
        {quiz.map((q, qi) => {
          const chosen = answers[qi];
          return (
            <li key={qi}>
              <p className="flex items-baseline gap-3 text-base font-medium text-bone-50 md:text-lg">
                <span className="font-serif text-sm italic text-mint">
                  {String(qi + 1).padStart(2, "0")}
                </span>
                {q.q}
              </p>
              <div className="mt-3 grid gap-2 ps-8 sm:grid-cols-2">
                {q.opts.map((opt, oi) => {
                  const isChosen = chosen === oi;
                  const isRight = q.a === oi;
                  let cls =
                    "border-line/15 text-bone-200 hover:border-mint/40 hover:text-bone-50";
                  if (checked) {
                    if (isRight) cls = "border-mint/70 bg-mint/10 text-mint";
                    else if (isChosen)
                      cls = "border-red-500/50 bg-red-500/5 text-bone-400 line-through";
                    else cls = "border-line/10 text-bone-500";
                  } else if (isChosen) {
                    cls = "border-mint bg-mint/10 text-bone-50";
                  }
                  return (
                    <button
                      key={oi}
                      type="button"
                      disabled={checked}
                      onClick={() =>
                        setAnswers((a) =>
                          a.map((v, i) => (i === qi ? oi : v))
                        )
                      }
                      className={`rounded-lg border px-4 py-3 text-start text-sm transition-colors duration-200 ${cls}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-line/10 pt-6">
        {!checked ? (
          <button
            type="button"
            disabled={!allAnswered}
            onClick={check}
            className="rounded-full bg-mint px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t.learn.quizCheck}
          </button>
        ) : score >= PASS || passed ? (
          <p className="flex items-center gap-3 text-mint">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-mint/15">✓</span>
            {t.learn.quizPassed}
            <span className="text-bone-400">
              — {t.learn.quizScore}: {score}/{quiz.length}
            </span>
          </p>
        ) : (
          <>
            <p className="text-bone-400">
              {t.learn.quizFailed}{" "}
              <span className="text-bone-200">
                {t.learn.quizScore}: {score}/{quiz.length}
              </span>
            </p>
            <button
              type="button"
              onClick={retry}
              className="rounded-full border border-line/20 px-6 py-3 text-sm text-bone-50 transition-colors hover:border-mint/50"
            >
              {t.learn.quizRetry}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
