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
  { id: 1, axis: "econ", text: "Government should expand social welfare programs.", reverse: true },
  { id: 2, axis: "econ", text: "Free markets usually deliver better outcomes than heavy regulation." },
  { id: 3, axis: "econ", text: "High-income earners should pay substantially higher taxes.", reverse: true },
  { id: 4, axis: "econ", text: "Privatization improves efficiency in essential services." },
  { id: 5, axis: "econ", text: "Labor unions are necessary to protect workers.", reverse: true },
  { id: 6, axis: "econ", text: "Reducing business taxes helps the overall economy." },
  { id: 7, axis: "econ", text: "Universal basic income is a good long-term policy.", reverse: true },
  { id: 8, axis: "econ", text: "Trade barriers are generally harmful to economic growth." },
  { id: 9, axis: "econ", text: "The state should cap prices on key consumer goods.", reverse: true },
  { id: 10, axis: "econ", text: "Entrepreneurship should face fewer licensing restrictions." },

  { id: 11, axis: "social", text: "Society should be open to rapidly changing social norms.", reverse: true },
  { id: 12, axis: "social", text: "Schools should emphasize traditional values and discipline." },
  { id: 13, axis: "social", text: "Personal lifestyle choices should rarely be restricted by law.", reverse: true },
  { id: 14, axis: "social", text: "National identity should be prioritized over multiculturalism." },
  { id: 15, axis: "social", text: "Censorship is sometimes necessary to preserve social cohesion." },
  { id: 16, axis: "social", text: "Gender roles should remain flexible rather than fixed.", reverse: true },
  { id: 17, axis: "social", text: "Religious traditions should have a stronger role in public life." },
  { id: 18, axis: "social", text: "Criminal justice should focus more on rehabilitation than punishment.", reverse: true },
  { id: 19, axis: "social", text: "Strict border control is essential for national stability." },
  { id: 20, axis: "social", text: "Public institutions should actively challenge long-standing customs.", reverse: true }
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
  if (axis === "econ") {
    if (score <= -8) return "Left";
    if (score >= 8) return "Right";
    return "Mixed";
  }

  if (score <= -8) return "Progressive";
  if (score >= 8) return "Traditional";
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
