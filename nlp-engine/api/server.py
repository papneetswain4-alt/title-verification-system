import os
import sys
from flask import Flask, request, jsonify # type: ignore
from flask_cors import CORS # type: ignore

# Add parent directory to sys.path to help with package resolution
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.append(parent_dir)

# Import the engine from models
try:
    from models.semantic_similarity import engine # type: ignore
except ImportError:
    # Fallback for different execution contexts
    from nlp_engine.models.semantic_similarity import engine # type: ignore

app = Flask(__name__)
CORS(app)

@app.route('/api/v1/semantic/verify', methods=['POST'])
def verify_semantic():
    data = request.json
    if not data or 'title' not in data:
        return jsonify({'error': 'Title is required'}), 400

    title = data['title']
    threshold = data.get('threshold', 0.75) # Optional threshold

    result = engine.check_similarity(title, threshold)
    return jsonify(result), 200

@app.route('/api/v1/semantic/seed', methods=['POST'])
def seed_titles():
    """ Allow backend to push new/existing titles into the vector store. """
    data = request.json
    if not data or 'titles' not in data:
        return jsonify({'error': 'List of titles is required'}), 400
        
    titles = data['titles']
    if not isinstance(titles, list):
         return jsonify({'error': 'titles must be an array'}), 400

    try:
         engine.add_titles(titles)
         return jsonify({'status': 'Success', 'message': f'Added {len(titles)} titles'}), 200
    except Exception as e:
         return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'OK', 'vector_count': engine.index.ntotal if engine.index else 0}), 200

if __name__ == '__main__':
    # Run the NLP microservice on port 5000
    print("Starting Semantic Search NLP API on port 5000")
    app.run(host='0.0.0.0', port=5000, debug=False)
