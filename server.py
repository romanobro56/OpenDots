from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import importlib.util
import os

app = Flask(__name__)
CORS(app)

IMAGES_DIR = os.path.join(os.path.dirname(__file__), 'assets', 'keys')

spec = importlib.util.spec_from_file_location(
    "image_to_matrix",
    os.path.join(os.path.dirname(__file__), "image_to_matrix.py")
)
img_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(img_module)


def load_all_images():
    images = {}
    if not os.path.exists(IMAGES_DIR):
        print(f"Warning: {IMAGES_DIR} not found")
        return images
    for filename in os.listdir(IMAGES_DIR):
        name, ext = os.path.splitext(filename)
        if ext.lower() in ('.png', '.jpg', '.jpeg'):
            images[name] = Image.open(os.path.join(IMAGES_DIR, filename)).convert('L')
            print(f"  Loaded: {filename} → key '{name}'")
    return images


print("Loading key images...")
IMAGE_MAP = load_all_images()
print(f"Ready — {len(IMAGE_MAP)} keys loaded")


@app.route('/key', methods=['POST'])
def handle_key():
    data = request.get_json()
    key = data.get('key', '')
    if not key:
        return jsonify({'error': 'no key'}), 400

    img = IMAGE_MAP.get(key)
    if img is None:
        return jsonify({'error': f'no image for key: {key}'}), 404

    try:
        matrix = img_module.image_to_matrix(img)
        flat = [val for row in matrix for val in row]
        return jsonify({'key': key, 'matrix': flat})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/keys', methods=['GET'])
def list_keys():
    return jsonify({'keys': sorted(IMAGE_MAP.keys())})


@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'keys_loaded': len(IMAGE_MAP)})

@app.route('/')
def home():
    return jsonify({
        "message": "Open Dots API is running",
        "endpoints": ["/key", "/keys", "/health"]
    })

if __name__ == '__main__':
    print("Server running → http://localhost:5050")
    app.run(port=5050, debug=False)
