import os

from flask import Blueprint, jsonify, request

from services.question_generator import generate_questions_from_pdf
from db import get_db_connection

quiz_bp = Blueprint("quiz", __name__)


UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")


@quiz_bp.route("/generate", methods=["GET"])
def generate_quiz():
  """
  Generate questions from the most recently uploaded PDF.
  Uses the user's last saved difficulty and question_type (from user_profile)
  to filter the generated questions.
  Expects ?user_id=<id>, optionally ?file=<filename.pdf>.
  """
  filename = request.args.get("file")
  user_id = request.args.get("user_id")

  if filename:
    pdf_path = os.path.join(UPLOAD_FOLDER, filename)
  else:
    if not os.path.isdir(UPLOAD_FOLDER):
      return jsonify({"error": "No uploads directory found"}), 400

    pdf_files = [
      f for f in os.listdir(UPLOAD_FOLDER)
      if f.lower().endswith(".pdf")
    ]

    if not pdf_files:
      return jsonify({"error": "No PDF files uploaded"}), 400

    latest = max(
      pdf_files,
      key=lambda f: os.path.getmtime(os.path.join(UPLOAD_FOLDER, f)),
    )
    pdf_path = os.path.join(UPLOAD_FOLDER, latest)

  if not os.path.exists(pdf_path):
    return jsonify({"error": "Requested PDF not found"}), 404

  questions = generate_questions_from_pdf(pdf_path)

  profile_used = None

  if user_id:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
      "SELECT difficulty, question_type FROM user_profile WHERE user_id = ? ORDER BY id DESC LIMIT 1",
      (user_id,),
    )
    row = cursor.fetchone()
    cursor.close()
    conn.close()

    if row is not None:
      selected_difficulty = str(row["difficulty"] or "").strip()
      selected_qtype = str(row["question_type"] or "").strip()

      # Map UI values to internal question types
      qtype_map = {
        "mcq": "mcq",
        "true/false": "true_false",
        "truefalse": "true_false",
      }
      mapped_qtype = ""
      if selected_qtype:
        key = selected_qtype.lower().replace(" ", "").replace("_", "")
        mapped_qtype = qtype_map.get(key, "")

      profile_used = {
        "difficulty": selected_difficulty,
        "question_type": selected_qtype,
        "mapped_type": mapped_qtype,
      }

      difficulty_lower = selected_difficulty.lower() if selected_difficulty else ""

      if difficulty_lower and mapped_qtype:
        questions = [
          q for q in questions
          if str(q.get("difficulty", "")).strip().lower() == difficulty_lower
          and str(q.get("type", "")).strip().lower() == mapped_qtype
        ]
      elif difficulty_lower:
        questions = [
          q for q in questions
          if str(q.get("difficulty", "")).strip().lower() == difficulty_lower
        ]
      elif mapped_qtype:
        questions = [
          q for q in questions
          if str(q.get("type", "")).strip().lower() == mapped_qtype
        ]

  return jsonify({"questions": questions, "profile": profile_used})


@quiz_bp.route("/submit", methods=["POST"])
def submit_quiz():
  data = request.get_json(silent=True) or {}
  answers = data.get("answers", [])
  score = 100 if answers else 0
  return jsonify({"score": score})