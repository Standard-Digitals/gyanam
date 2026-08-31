export interface ParsedQuestion {
  id: number;
  type: 'mcq' | 'fill_blank';
  question: string;
  options: string[];
  correctAnswer: number;
  correctAnswerText: string;
  explanation: string;
}

export interface ParseResult {
  questions: ParsedQuestion[];
  warnings: string[];
}

const QUESTION_START = /^Q\s*\d+\s*[.)]\s*(.*)$/i;
const OPTION_LINE = /^([A-Za-z0-9])[.)]\s*(.+)$/;
const ANSWER_LINE = /^answer\s*:\s*(.+)$/i;
const EXPLANATION_LINE = /^explanation\s*:\s*(.+)$/i;
const FILL_TAG = /^\[\s*fill(?:\s*in\s*the\s*blank)?\s*\]\s*/i;

interface DraftQuestion {
  type: 'mcq' | 'fill_blank';
  question: string;
  options: string[];
  answerRaw: string | null;
  explanation: string;
}

export function parseQuestionsFromText(rawText: string): ParseResult {
  const lines = rawText.replace(/\r\n/g, '\n').split('\n').map((l) => l.trim());

  const warnings: string[] = [];
  const questions: ParsedQuestion[] = [];
  let current: DraftQuestion | null = null;

  const flush = () => {
    if (!current) return;
    const qNum = questions.length + 1;
    let correctAnswer = 0;
    let correctAnswerText = '';

    if (current.type === 'fill_blank') {
      correctAnswerText = current.answerRaw?.trim() ?? '';
      if (!correctAnswerText) {
        warnings.push(`Question ${qNum}: no "Answer:" line found — please fill it in manually.`);
      }
    } else {
      if (!current.answerRaw) {
        warnings.push(`Question ${qNum}: no "Answer:" line found — defaulted to option A, please review.`);
      } else {
        const ans = current.answerRaw.trim();
        const letterIdx = ans.length === 1 && /[A-Za-z]/.test(ans) ? ans.toUpperCase().charCodeAt(0) - 65 : -1;
        const digitIdx = /^\d+$/.test(ans) ? parseInt(ans, 10) - 1 : -1;
        const textIdx = current.options.findIndex((o) => o.trim().toLowerCase() === ans.toLowerCase());
        if (letterIdx >= 0 && letterIdx < current.options.length) correctAnswer = letterIdx;
        else if (digitIdx >= 0 && digitIdx < current.options.length) correctAnswer = digitIdx;
        else if (textIdx >= 0) correctAnswer = textIdx;
        else warnings.push(`Question ${qNum}: couldn't match answer "${ans}" to an option — defaulted to option A, please review.`);
      }
      if (current.options.length < 2) {
        warnings.push(`Question ${qNum}: fewer than 2 options found — please review.`);
      }
    }

    if (!current.explanation) {
      warnings.push(`Question ${qNum}: no "Explanation:" line found — please add one before saving.`);
    }

    questions.push({
      id: qNum,
      type: current.type,
      question: current.question.trim(),
      options: current.options.length > 0 ? current.options : ['', ''],
      correctAnswer,
      correctAnswerText,
      explanation: current.explanation.trim(),
    });
    current = null;
  };

  for (const line of lines) {
    if (!line) continue;

    const qMatch = line.match(QUESTION_START);
    if (qMatch) {
      flush();
      let rest = qMatch[1] ?? '';
      let type: 'mcq' | 'fill_blank' = 'mcq';
      const fillMatch = rest.match(FILL_TAG);
      if (fillMatch) {
        type = 'fill_blank';
        rest = rest.slice(fillMatch[0].length);
      }
      current = { type, question: rest, options: [], answerRaw: null, explanation: '' };
      continue;
    }
    if (!current) continue;

    const answerMatch = line.match(ANSWER_LINE);
    if (answerMatch) {
      current.answerRaw = answerMatch[1];
      continue;
    }
    const explanationMatch = line.match(EXPLANATION_LINE);
    if (explanationMatch) {
      current.explanation = explanationMatch[1];
      continue;
    }
    const optionMatch = current.type === 'mcq' ? line.match(OPTION_LINE) : null;
    if (optionMatch) {
      current.options.push(optionMatch[2]);
      continue;
    }
    if (current.options.length === 0 && current.answerRaw === null) {
      current.question = current.question ? `${current.question} ${line}` : line;
    }
  }
  flush();

  if (questions.length === 0) {
    warnings.push('No questions could be parsed. Make sure each question starts with "Q1.", "Q2.", etc. on its own line, matching the template.');
  }

  return { questions, warnings };
}
