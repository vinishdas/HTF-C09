from flask import Flask, request, jsonify
from flask_cors import CORS
from main import run_main  # 🧠 Import the function from main.py

app = Flask(__name__)
CORS(app)

@app.route('/score', methods=['POST'])
def score_employees():
    try:
        print("💡 Incoming request to /score")

        data = request.get_json()
        print("📦 JSON received:", data)

        # Call your function here (updated to accept data)
        output = run_main(project_data=data)

        return jsonify(output)
    except Exception as e:
        print("❌ Error in /score:", str(e))
        return jsonify({"error": str(e)}), 500
if __name__ == '__main__':
    app.run(debug=True)

