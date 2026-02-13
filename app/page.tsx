import Link from "next/link";
import { QUESTIONS } from "@/lib/questions";

export default function HomePage() {
  const econCount = QUESTIONS.filter((q) => q.axis === "econ").length;
  const socCount = QUESTIONS.filter((q) => q.axis === "social").length;

  return (
    <main className="container">
      <div className="card fadeIn" style={{ textAlign: "center" }}>

        <h1 className="heroTitle">Political Compass Quiz</h1>

        <p className="heroSub">
          Answer a quick set of statements and get a clean economic + social result with a visual compass.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap", marginTop: 18 }}>
          <Link href="/quiz" className="btn btn-primary">
            Start the Quiz
          </Link>

          <a
            href="https://github.com/bmaww/poli-quiz-site"
            className="btn btn-secondary"
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: "none" }}
          >
            View Source
          </a>
        </div>

        <p className="muted" style={{ marginTop: 18, fontSize: 14 }}>
          ~4 minutes • {econCount} economic + {socCount} social
      </div>
    </main>
  );
}
