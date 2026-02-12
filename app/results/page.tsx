import Link from "next/link";
import { axisLabel, getQuadrantText } from "@/lib/questions";

function CompassChart({ econScore, socScore }: { econScore: number; socScore: number }) {
  const maxAxis = 30;
  const size = 320;
  const center = size / 2;
  const scale = center / maxAxis;

  const x = center + econScore * scale;
  const y = center + socScore * scale;

  return (
    <svg width="100%" viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Political compass chart">
      <rect x="0" y="0" width={size} height={size} fill="#f8fafc" rx="12" />
      <line x1={center} y1="0" x2={center} y2={size} stroke="#94a3b8" strokeWidth="2" />
      <line x1="0" y1={center} x2={size} y2={center} stroke="#94a3b8" strokeWidth="2" />

      <text x="8" y="20" fontSize="12" fill="#334155">
        Left / Progressive
      </text>
      <text x={size - 108} y="20" fontSize="12" fill="#334155">
        Right / Progressive
      </text>
      <text x="8" y={size - 10} fontSize="12" fill="#334155">
        Left / Traditional
      </text>
      <text x={size - 102} y={size - 10} fontSize="12" fill="#334155">
        Right / Traditional
      </text>

      <circle cx={x} cy={y} r="7" fill="#2563eb" />
    </svg>
  );
}

export default function ResultsPage({ searchParams }: { searchParams: { econ?: string; soc?: string } }) {
  const econScore = Number(searchParams.econ ?? 0);
  const socScore = Number(searchParams.soc ?? 0);

  const econResult = axisLabel("econ", econScore);
  const socResult = axisLabel("social", socScore);

  return (
    <main className="container">
      <div className="card" style={{ display: "grid", gap: "1rem" }}>
        <h1>Your Results</h1>

        <div className="grid-2">
          <div className="stat">
            <h3>Economic Axis</h3>
            <p>Score: {econScore}</p>
            <span className="badge">{econResult}</span>
          </div>
          <div className="stat">
            <h3>Social Axis</h3>
            <p>Score: {socScore}</p>
            <span className="badge">{socResult}</span>
          </div>
        </div>

        <div className="stat">
          <h3>Compass Position</h3>
          <CompassChart econScore={econScore} socScore={socScore} />
        </div>

        <div className="stat">
          <h3>Interpretation</h3>
          <p>{getQuadrantText(econScore, socScore)}</p>
        </div>

        <Link className="btn btn-secondary" href="/">
          Retake Quiz
        </Link>
      </div>
    </main>
  );
}
