from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

users = []

@app.route("/register", methods=["POST"])
def register():
    data = request.json
    users.append(data)
    return jsonify({"message": "User registered successfully"}), 201

@app.route("/login", methods=["POST"])
def login():
    data = request.json

    for user in users:
        if user["email"] == data["email"] and user["password"] == data["password"]:
            return jsonify({
                "message": "Login successful",
                "user_id": user["id"]
            }), 200

    return jsonify({"message": "Invalid credentials"}), 401
if __name__ == "__main__":
    app.run(debug=True)