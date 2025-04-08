from flask import Flask, request, jsonify
from TaskAllocation import create_schedule

app = Flask(__name__)

@app.route('/generate_schedule', methods=['POST'])
def generate_schedule():
    try:
        data = request.get_json()

        # Extract required fields from request
        project_name = data.get('project')
        employees = data.get('employees')
        tasks = data.get('tasks')
        constraints = data.get('constraints')

        # Validate inputs
        if not project_name or not employees or not tasks or not constraints:
            return jsonify({"error": "Missing required fields: project, employees, tasks, constraints"}), 400

        # Normalize employee data (convert skill list to set)
        for emp in employees:
            emp["skills"] = set(emp.get("skills", []))

        # Generate schedule
        schedule = create_schedule(employees, tasks, constraints)

        return jsonify({"schedule": schedule})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
