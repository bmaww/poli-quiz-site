import Link from "next/link";

export default function HomePage() {
  return (
    <main className="container">
      <div className="card">
        <h1>Political Compass Quiz</h1>
        <p>
          Take a 30-question quiz to discover where you land on the economic axis (Left ↔ Right) and social
          axis (Progressive ↔ Traditional).
        </p>
        <p>It takes around 3–5 minutes and gives you a clear two-axis result with a visual compass.</p>
        <Link href="/quiz" className="btn btn-primary">
          Start Quiz
        </Link>
      </div>
    </main>
  );
}
