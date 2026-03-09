import os
import re
from typing import List, Dict

from pdfminer.high_level import extract_text


def extract_text_from_pdf(path: str, max_chars: int = 20000) -> str:
  if not os.path.exists(path):
    return ""

  text = extract_text(path)
  if not text:
    return ""

  normalized = " ".join(text.split())
  return normalized[:max_chars]


def _split_into_sentences(text: str) -> List[str]:
  parts = re.split(r"(?<=[.!?])\s+", text)
  return [p.strip() for p in parts if len(p.strip()) > 20]


def _tokenize(sentence: str) -> List[str]:
  tokens = re.findall(r"[A-Za-z]+", sentence)
  return tokens


def _classify_difficulty(sentence_text: str) -> str:
  tokens = _tokenize(sentence_text)
  length = len(tokens)
  word_lengths = [len(t) for t in tokens]
  avg_len = sum(word_lengths) / len(word_lengths) if word_lengths else 0

  if length <= 10 and avg_len <= 5:
    return "Easy"
  if length <= 20:
    return "Medium"
  return "Hard"


def _pick_distractors(answer: str, vocab: List[str], max_distractors: int = 3) -> List[str]:
  answer_lower = answer.lower()
  candidates = []
  for w in vocab:
    lw = w.lower()
    if lw == answer_lower:
      continue
    if len(w) < 3:
      continue
    if w not in candidates:
      candidates.append(w)
  return candidates[:max_distractors]


def _generate_from_sentence(sentence: str, vocab: List[str]) -> List[Dict]:
  questions: List[Dict] = []
  tokens = _tokenize(sentence)
  if not tokens:
    return questions

  content_tokens = [t for t in tokens if len(t) > 3]
  if not content_tokens:
    content_tokens = tokens

  target = content_tokens[0]
  blank_sentence = re.sub(r"\b" + re.escape(target) + r"\b", "_____", sentence, count=1)
  difficulty = _classify_difficulty(sentence)

  questions.append({
    "type": "fill_blank",
    "question": blank_sentence,
    "options": [],
    "answer": target,
    "difficulty": difficulty,
  })

  distractors = _pick_distractors(target, vocab, max_distractors=3)
  if distractors:
    options = [target] + distractors
    options_sorted = sorted(options)
    questions.append({
      "type": "mcq",
      "question": blank_sentence,
      "options": options_sorted,
      "answer": target,
      "difficulty": difficulty,
    })

  difficulty_tf = _classify_difficulty(sentence)
  questions.append({
    "type": "true_false",
    "question": sentence,
    "options": ["True", "False"],
    "answer": "True",
    "difficulty": difficulty_tf,
  })

  return questions


def generate_questions_from_text(text: str, max_questions: int = 15) -> List[Dict]:
  sentences = _split_into_sentences(text)
  all_tokens = []
  for s in sentences:
    all_tokens.extend(_tokenize(s))

  vocab = sorted(set(all_tokens))
  questions: List[Dict] = []

  for sent in sentences:
    if len(questions) >= max_questions:
      break
    questions.extend(_generate_from_sentence(sent, vocab))

  return questions[:max_questions]


def generate_questions_from_pdf(pdf_path: str, max_questions: int = 15) -> List[Dict]:
  text = extract_text_from_pdf(pdf_path)
  if not text:
    return []
  return generate_questions_from_text(text, max_questions=max_questions)


def generate_questions(text: str) -> List[Dict]:
  return generate_questions_from_text(text)
