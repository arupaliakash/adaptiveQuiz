from flask import Blueprint, request, jsonify
from db import get_db_connection

profile_bp = Blueprint('profile_bp', __name__)

@profile_bp.route('/save-profile', methods=['POST'])
def save_profile():
    data = request.json

    user_id = data.get('user_id')
    subject = data.get('subject')
    difficulty = data.get('difficulty')
    question_type = data.get('question_type')

    if not user_id:
        return jsonify({"error": "user_id missing"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO user_profile (user_id, subject, difficulty, question_type) VALUES (?, ?, ?, ?)",
        (user_id, subject, difficulty, question_type),
    )

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Profile saved"})