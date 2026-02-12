"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ANSWERS, QUESTIONS, calculateScores } from "@/lib/questions";

export default function QuizPage() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(QUESTIONS.length).fill(null));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const current = QUESTIONS[index];
  const progress = ((index + 1) / QUESTIONS.length) * 100;
  const selected = answers[index];
  const allAnswered = useMemo(() => answers.every((a) => a !== null), [answers]);

  const onSelect = (value: number) => {
    setError(null);
    const next = [...answers];
    next[index] = value;
    setAnswers(next);
  };

  const onSubmit = async () => {
    if (!allAnswered || submitting) return;
    setSubmitting(true);
    setError(null);

    try {
      const numericAnswers = answers.map((a) => a ?? 0);
      const { econScore, socScore } = calculateScores(numericAnswers);

      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ econScore, socScore, quizVersion: "v1" })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Could not submit quiz.");
        return;
      }

      router.push(`/results?econ=${econScore}&soc=${socScore}`);
    } catch {
      setError("Unexpected network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="container">
      <div className="card">
        <div className="row">
          <h2>
            Question {index + 1} / {QUESTIONS.length}
          </h2>
          <small>{current.axis === "econ" ? "Economic" : "Social"} axis</small>
        </div>

        <div className="progressTrack">
          <div className="progressFill" style={{ width: `${progress}%` }} />
        </div>

        <p>{current.text}</p>

        <div className="answers" role="listbox" aria-label="Answer choices">
          {ANSWERS.map((choice) => (
            <button
              key={choice.label}
              type="button"
              className={`answerButton ${selected === choice.value ? "selected" : ""}`}
              onClick={() => onSelect(choice.value)}
            >
              {choice.label}
            </button>
          ))}
        </div>

        <div className="row" style={{ marginTop: "1.1rem" }}>
          <button className="btn btn-secondary" disabled={index === 0} onClick={() => setIndex((i) => i - 1)}>
            Back
          </button>

          {index < QUESTIONS.length - 1 ? (
            <button
              className="btn btn-primary"
              disabled={selected === null}
              onClick={() => setIndex((i) => Math.min(QUESTIONS.length - 1, i + 1))}
            >
              Next
            </button>
          ) : (
            <button className="btn btn-primary" disabled={!allAnswered || submitting} onClick={onSubmit}>
              {submitting ? "Submitting..." : "Submit Quiz"}
            </button>
          )}
        </div>

        {error ? <p className="error">{error}</p> : null}
      </div>
    </main>
  );
}
