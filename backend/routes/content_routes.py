from flask import Blueprint, request, jsonify, send_from_directory
import os

content_bp = Blueprint("content", __name__)

UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@content_bp.route("/upload", methods=["POST"])
def upload():
    file = request.files["file"]
    file.save(os.path.join(UPLOAD_FOLDER, file.filename))
    return jsonify({"message": "File uploaded successfully", "filename": file.filename})


@content_bp.route("/files", methods=["GET"])
def list_files():
    files = []
    for name in os.listdir(UPLOAD_FOLDER):
        path = os.path.join(UPLOAD_FOLDER, name)
        if os.path.isfile(path):
            files.append(name)
    return jsonify({"files": files})


@content_bp.route("/files/<filename>", methods=["GET"])
def get_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename, as_attachment=True)


@content_bp.route("/files/<filename>", methods=["DELETE"])
def delete_file(filename):
    path = os.path.join(UPLOAD_FOLDER, filename)
    if not os.path.exists(path):
        return jsonify({"message": "File not found"}), 404
    os.remove(path)
    return jsonify({"message": "File deleted successfully"})