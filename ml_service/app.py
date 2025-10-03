import cv2
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/analyze", methods=["POST"])
def analyze_image():
    if "file" not in request.files:
        return jsonify({"success": False, "error": "No file uploaded"}), 400

    file = request.files["file"]
    npimg = np.frombuffer(file.read(), np.uint8)
    img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    if img is None:
        return jsonify({"success": False, "error": "Invalid image"}), 400

    # Convert to grayscale + threshold
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (5, 5), 0)
    _, thresh = cv2.threshold(blur, 60, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)

    # Find contours
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    if not contours:
        return jsonify({"success": False, "error": "No object detected"}), 200

    # Largest contour = screw
    cnt = max(contours, key=cv2.contourArea)
    x, y, w, h = cv2.boundingRect(cnt)

    screw_length_px = max(w, h)
    screw_width_px = min(w, h)

    return jsonify({
        "success": True,
        "image_width": img.shape[1],
        "image_height": img.shape[0],
        "screw_length_px": screw_length_px,
        "screw_width_px": screw_width_px
    })

@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "Python service running"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
