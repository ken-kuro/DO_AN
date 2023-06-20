import json

from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from modules.spacy_parser import process_file
from modules.gpt_parser import ResumeParser
from modules.utils import parse_uploaded_file
import os

main_bp = Blueprint('main', __name__)


@main_bp.route('/parse-resume', methods=['POST'])
def parse_resume():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        upload_directory = os.path.join(os.getcwd(), current_app.config['UPLOAD_FOLDER'])
        if not os.path.exists(upload_directory):
            os.makedirs(upload_directory)
        file_path = os.path.join(upload_directory, filename)
        file.save(file_path)
        parser = ResumeParser(current_app.config['ACCESS_TOKEN'])
        result = parser.query_resume(file_path)
        print(result)

        json_filename = os.path.splitext(filename)[0] + '.json'
        json_filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], json_filename)
        with open(json_filepath, 'w') as f:
            json.dump(result, f, indent=4)

        # os.remove(file_path)
        return jsonify(result)
    else:
        return jsonify({'error': 'Unsupported file type'}), 400

@main_bp.route('/parse-resume-spacy', methods=['POST'])
def parse_resume_spacy():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        upload_directory = os.path.join(os.getcwd(), current_app.config['UPLOAD_FOLDER'])
        if not os.path.exists(upload_directory):
            os.makedirs(upload_directory)
        file_path = os.path.join(upload_directory, filename)
        file.save(file_path)
        result = process_file(file_path)
        print(result)

        # os.remove(file_path)
        return jsonify(result)
    else:
        return jsonify({'error': 'Unsupported file type'}), 400


def allowed_file(filename):
    allowed_extensions = current_app.config['ALLOWED_EXTENSIONS']
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions
