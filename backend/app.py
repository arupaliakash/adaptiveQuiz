from flask import Flask, request, jsonify
from flask_cors import CORS

from routes.profile_routes import profile_bp
from routes.content_routes import content_bp
from routes.quiz_routes import quiz_bp
from db import get_db_connection

app = Flask(__name__)
CORS(app)


@app.route("/register", methods=["POST"])
def register():
  data = request.json

  conn = get_db_connection()
  cursor = conn.cursor()

  query = "INSERT INTO users (email, username, password) VALUES (?, ?, ?)"
  values = (data["email"], data["username"], data["password"])

  cursor.execute(query, values)
  conn.commit()

  cursor.close()
  conn.close()

  return jsonify({"message": "User registered successfully"})


@app.route("/login", methods=["POST"])
def login():
  data = request.json

  conn = get_db_connection()
  cursor = conn.cursor()

  query = "SELECT * FROM users WHERE email=? AND password=?"
  values = (data["email"], data["password"])

  cursor.execute(query, values)
  user = cursor.fetchone()

  cursor.close()
  conn.close()

  if user:
    return jsonify({
      "message": "Login successful",
      "data": {
        "user_id": user["id"]
      }
    })
  else:
    return jsonify({"message": "Invalid credentials"}), 401


app.register_blueprint(profile_bp)
app.register_blueprint(content_bp)
app.register_blueprint(quiz_bp, url_prefix="/quiz")

if __name__ == "__main__":
  app.run(debug=True)