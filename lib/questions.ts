export type Axis = "econ" | "social";

export type Question = {
  id: number;
  axis: Axis;
  text: string;
  reverse?: boolean;
};

export const ANSWERS = [
  { label: "Strongly disagree", value: -3 },
  { label: "Disagree", value: -2 },
  { label: "Somewhat disagree", value: -1 },
  { label: "Neutral", value: 0 },
  { label: "Somewhat agree", value: 1 },
  { label: "Agree", value: 2 },
  { label: "Strongly agree", value: 3 }
] as const;

export const QUESTIONS: Question[] = [
 // Economic (E1–E10) — reverse=true means Agree pushes Left (negative)
  { id: 1, axis: "econ", text: "Government should raise taxes on high earners to expand social programs.", reverse: true },
  { id: 2, axis: "econ", text: "Lowering taxes usually helps the economy more than increasing government spending.", reverse: false },
  { id: 3, axis: "econ", text: "Essential healthcare should be guaranteed by government, even if public spending rises.", reverse: true },
  { id: 4, axis: "econ", text: "Business regulations are too strict and should be reduced.", reverse: false },
  { id: 5, axis: "econ", text: "Unions and collective bargaining are essential for fair wages and working conditions.", reverse: true },
  { id: 6, axis: "econ", text: "Private-sector competition generally delivers better services than government-run programs.", reverse: false },
  { id: 7, axis: "econ", text: "Government should invest more in affordable housing, even if it increases taxes or debt.", reverse: true },
  { id: 8, axis: "econ", text: "Governments should balance budgets most years, even if it means cutting programs.", reverse: false },
  { id: 9, axis: "econ", text: "Tuition and student debt should be significantly reduced through public funding.", reverse: true },
  { id: 10, axis: "econ", text: "Free trade generally benefits the economy more than it harms it.", reverse: false },

  // Social (S1–S10) — reverse=true means Agree pushes Progressive (negative)
  { id: 11, axis: "social", text: "Immigration levels should be reduced.", reverse: false },
  { id: 12, axis: "social", text: "Abortion access should be legal in most cases.", reverse: true },
  { id: 13, axis: "social", text: "Gender identity and sexual orientation should have strong legal protections against discrimination.", reverse: true },
  { id: 14, axis: "social", text: "Police and law enforcement should receive increased funding and stronger legal support.", reverse: false },
  { id: 15, axis: "social", text: "Personal possession of drugs should be decriminalized, with more focus on treatment than punishment.", reverse: true },
  { id: 16, axis: "social", text: "Schools should emphasize national identity, shared civic values, and cultural traditions more than they do now.", reverse: false },
  { id: 17, axis: "social", text: "Climate policy should prioritize cutting emissions even if energy costs rise short-term.", reverse: true },
  { id: 18, axis: "social", text: "Sentences for repeat violent offenders should be much longer, even if prisons become more crowded.", reverse: false },
  { id: 19, axis: "social", text: "Civilian firearm ownership should be more strictly regulated.", reverse: true },
  { id: 20, axis: "social", text: "Free speech protections should extend to offensive views, as long as they don’t directly incite violence.", reverse: true },

  // Current debates (C1–C10)
  { id: 21, axis: "social", text: "If DHS funding is at risk of lapsing, Congress should only pass a funding bill that includes stronger oversight and limits on federal immigration enforcement.", reverse: true },
  { id: 22, axis: "social", text: "The U.S. should require strict national-security controls for major social media platforms with foreign ownership/control, even if it means forcing divestment or banning the app if requirements aren’t met.", reverse: false },
  { id: 23, axis: "social", text: "Voter registration should require documentary proof of citizenship nationwide (a federal standard).", reverse: false },
  { id: 24, axis: "econ", text: "Canada should move forward with national pharmacare that publicly covers essential prescription drugs, even if it increases federal spending.", reverse: true },
  { id: 25, axis: "social", text: "Federal party leaders should be required to obtain top-secret security clearance so they can receive full briefings on foreign interference and national security threats.", reverse: false },
  { id: 26, axis: "econ", text: "Canada should keep consumer carbon pricing removed to reduce costs for households (fuel/home heating).", reverse: false },
  { id: 27, axis: "econ", text: "Canada should cut fees/taxes/red tape to increase housing supply, even if it reduces government revenue.", reverse: false },
  { id: 28, axis: "social", text: "Canada should reduce targets for new temporary residents to ease pressure on housing and public services.", reverse: false },
  { id: 29, axis: "social", text: "Canada should make it easier to transition established temporary workers into permanent residency.", reverse: true },
  { id: 30, axis: "social", text: "Canada should strengthen industrial carbon pricing standards even if it increases costs for large emitters.", reverse: true },
];

export function calculateScores(answers: number[]): { econScore: number; socScore: number } {
  let econScore = 0;
  let socScore = 0;

  QUESTIONS.forEach((question, index) => {
    const answerValue = answers[index] ?? 0;
    const adjustedValue = question.reverse ? -answerValue : answerValue;

    if (question.axis === "econ") {
      econScore += adjustedValue;
    } else {
      socScore += adjustedValue;
    }
  });

  return { econScore, socScore };
}

export function axisLabel(axis: Axis, score: number): string {
  const count = QUESTIONS.filter((q) => q.axis === axis).length;
  const max = count * 3;                 // each question contributes -3..+3
  const cutoff = Math.round(max * 0.5);  // 50% of max magnitude

  if (axis === "econ") {
    if (score <= -cutoff) return "Left";
    if (score >= cutoff) return "Right";
    return "Mixed";
  }

  if (score <= -cutoff) return "Progressive";
  if (score >= cutoff) return "Traditional";
  return "Mixed";
}

export function getQuadrantText(econScore: number, socScore: number): string {
  if (econScore < 0 && socScore < 0) {
    return "You lean toward economic redistribution and socially progressive values.";
  }
  if (econScore > 0 && socScore < 0) {
    return "You lean toward market economics with socially progressive values.";
  }
  if (econScore < 0 && socScore > 0) {
    return "You lean toward economic intervention with socially traditional values.";
  }
  if (econScore > 0 && socScore > 0) {
    return "You lean toward market economics and socially traditional values.";
  }

  return "Your results are near the center, suggesting a balanced or mixed outlook.";
}
