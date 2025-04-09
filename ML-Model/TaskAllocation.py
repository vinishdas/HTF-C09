from ortools.sat.python import cp_model
from collections import defaultdict

def create_schedule(employees, tasks, constraints, days=5):
    model = cp_model.CpModel()
    solver = cp_model.CpSolver()
    x = {}  # (task_id, emp_id, day): BoolVar
    preference_bonus = defaultdict(int)

    #  For reasons
    task_id_map = {task['id']: i for i, task in enumerate(tasks)}
    emp_id_map = {emp['id']: i for i, emp in enumerate(employees)}

    # Create variables
    for t_idx, task in enumerate(tasks):
        for e_idx, emp in enumerate(employees):
            for d in range(days):
                x[(t_idx, e_idx, d)] = model.NewBoolVar(f"x_{t_idx}_{e_idx}_{d}")

    # Constraint 1: Task assigned exactly once
    for t_idx in range(len(tasks)):
        model.AddExactlyOne(x[(t_idx, e_idx, d)] for e_idx in range(len(employees)) for d in range(days))

    # Skill matching
    for t_idx, task in enumerate(tasks):
        required = set(task['skills'])
        for e_idx, emp in enumerate(employees):
            if not required.issubset(emp['skills']):
                for d in range(days):
                    model.Add(x[(t_idx, e_idx, d)] == 0)

    # Apply constraints based on mapping
    for c in constraints:
        if c["type"] == "min_skill_level":
            for t_idx, task in enumerate(tasks):
                if task["id"] in c["tasks"]:
                    for e_idx, emp in enumerate(employees):
                        if emp["skill_level"] < c["value"]:
                            for d in range(days):
                                model.Add(x[(t_idx, e_idx, d)] == 0)

        elif c["type"] == "max_hours_per_day":
            for e_idx, emp in enumerate(employees):
                for d in range(days):
                    model.Add(
                        sum(x[(t_idx, e_idx, d)] * tasks[t_idx]["duration"]
                            for t_idx, task in enumerate(tasks) if task["id"] in c["tasks"]) <= c["value"]
                    )

        elif c["type"] == "no_duplicate_task_type":
            for e_idx, emp in enumerate(employees):
                for d in range(days):
                    model.Add(
                        sum(x[(t_idx, e_idx, d)] for t_idx, task in enumerate(tasks) if task["id"] in c["tasks"]) <= 1
                    )

        elif c["type"] == "must_be_onsite":
            for t_idx, task in enumerate(tasks):
                if task["id"] in c["tasks"]:
                    for e_idx, emp in enumerate(employees):
                        if not emp.get("is_onsite", False):
                            for d in range(days):
                                model.Add(x[(t_idx, e_idx, d)] == 0)

        elif c["type"] == "must_resolve_within_day":
            for t_idx, task in enumerate(tasks):
                if task["id"] in c["tasks"]:
                    for e_idx, emp in enumerate(employees):
                        for d in range(1, days):
                            model.Add(x[(t_idx, e_idx, d)] == 0)

        elif c["type"] == "only_if_available":
            for t_idx, task in enumerate(tasks):
                if task["id"] in c["tasks"]:
                    for e_idx, emp in enumerate(employees):
                        if not emp.get(c["employee_attr"], False):
                            for d in range(days):
                                model.Add(x[(t_idx, e_idx, d)] == 0)

        elif c['type'] == 'avoid_day_for_employee':
            e_index = next(i for i, e in enumerate(employees) if e['name'] == c['employee'])
            for t_idx in range(len(tasks)):
                for d in c['days']:
                    model.Add(x[(t_idx, e_index, d)] == 0)

    # Soft Constraint: Prefer certain employee-task assignment
    preference_bonus = defaultdict(int)
    for c in constraints:
        if c['type'] == 'prefer_employee_task':
            emp_id = next(i for i, e in enumerate(employees) if e['name'] == c['employee'])
            task_id = next(i for i, t in enumerate(tasks) if t['name'] == c['task'])
            for d in range(days):
                preference_bonus[(task_id, emp_id, d)] += 1

    model.Maximize(sum(
        x[t_id, e_id, d] * preference_bonus[(t_id, e_id, d)]
        for (t_id, e_id, d) in x
    ))

    # Solve
    status = solver.Solve(model)
    if status in [cp_model.FEASIBLE, cp_model.OPTIMAL]:
        schedule = defaultdict(lambda: defaultdict(list))
        for (t_id, e_id, d), var in x.items():
            if solver.Value(var):
                emp_name = employees[e_id]['name']
                schedule[d][emp_name].append(tasks[t_id]['name'])
        return dict(schedule)
    else:
        return "\u274c No solution found. Try adjusting constraints."

#calling the model using some hard coded data
employees=[
    {"id": 3, "name": "David", "skills": {"ReactJS", "Debugging", "Node.js", "DB Knowledge"}, "skill_level": 8, "workload":2},
    {"id": 4, "name": "Eve", "skills": {"Jest/Mocha", "PowerPoint", "Business Understanding"}, "skill_level": 6, "workload":3},
    {"id": 5, "name": "Frank", "skills": {"Code Quality", "Communication", "Cybersecurity"}, "skill_level": 9, "workload":1},
    {"id": 6, "name": "Grace", "skills": {"Logical Thinking", "Jest/Mocha"},"skill_level": 7, "workload":2},
    {"id": 7, "name": "Hank","skills": {"ReactJS"},"skill_level": 7, "workload":0},
    {"id": 8,"name": "Ivy","skills": {"Code Quality", "Communication"},"skill_level": 9,"role": "senior","experience": ["code_review"],"workload":2},
    {"id": 9,"name": "Jake","skills": {"Node.js", "DB Knowledge"},"skill_level": 7, "workload":1}
]

tasks=[
    {"id": "IT01", "name": "Frontend Bug Fix", "skills": {"ReactJS", "Debugging"}, "duration": 3, "urgent": True},
    {"id": "IT02", "name": "Backend API Development", "skills": {"Node.js", "DB Knowledge"}, "duration": 6, "urgent": False},
    {"id": "IT03", "name": "Write Unit Tests", "skills": {"Jest/Mocha", "Logical Thinking"}, "duration": 4, "urgent": False},
    {"id": "IT04", "name": "Client Presentation Preparation", "skills": {"PowerPoint", "Business Understanding"}, "duration": 2, "urgent": True},
    {"id": "IT05", "name": "Code Review", "skills": {"Code Quality", "Communication"}, "duration": 1, "urgent": False},
    {"id": "IT06", "name": "Security Audit", "skills": {"Cybersecurity"}, "duration": 5, "urgent": True}
]

constraints = [
    # IT01 - Frontend Bug Fix
    {"type": "min_skill_level", "value": 7, "skills": ["ReactJS"], "tasks": ["IT01"]},
    {"type": "no_duplicate_task_type", "task_prefix": "IT01", "tasks": ["IT01"], "message": "Cannot assign more than 2 bug tasks per day"},  # Assuming task prefix is sufficient

    # IT02 - Backend API Development
    {"type": "max_total_workload_before_task", "value": 6, "tasks": ["IT02"], "message": "Must be assigned only if workload < 6 hrs/day"},

    # IT03 - Write Unit Tests
    {"type": "must_be_scheduled_after", "dependency": "Feature Implementation", "tasks": ["IT03"], "message": "Must be done after feature is built"},
    {"type": "min_skill_level", "value": 6, "tasks": ["IT03"]},

    # IT04 - Client Presentation Preparation
    {"type": "min_skill_level", "value": 5, "tasks": ["IT04"]},
    {"type": "must_finish_before_deadline", "deadline_offset_hours": 24, "tasks": ["IT04"], "message": "Must be completed 24 hrs before meeting"},

    # IT05 - Code Review
    {"type": "role_based_assignment", "role": "senior_dev", "tasks": ["IT05"], "message": "Only senior developers can do code review"},
    {"type": "must_have_previous_experience", "experience": "code_review", "tasks": ["IT05"], "message": "Must have reviewed code before"},

    # IT06 - Security Audit
    {"type": "min_skill_level", "value": 7, "skills": ["Cybersecurity"], "tasks": ["IT06"]},
    {"type": "max_task_frequency", "value": 1, "interval": "week", "tasks": ["IT06"], "message": "Cannot exceed 1 audit per user per week"},
    {"type": "minimize_workload","weight": 1.0 }# You can tune this weight to prioritize workload optimization
]

schedule = create_schedule(employees, tasks, constraints)
from pprint import pprint
pprint(schedule)

# project= "game"
# employees= [
#     {
#       "id": 101,
#       "name": "Alice",
#       "skills": ["game development", "AI", "compiler design"],
#       "skill_level": 4,
#       "workload": 10
#     },
#     {
#       "id": 102,
#       "name": "Bob",
#       "skills": ["art", "design"],
#       "skill_level": 3,
#       "workload": 5
#     }
#   ]
# tasks= [
#     {
#       "id": 1,
#       "name": "Develop Game Engine",
#       "skills": ["game development", "compiler design"],
#       "duration": 40
#     },
#     {
#       "id": 2,
#       "name": "Design Game Graphics",
#       "skills": ["art", "design"],
#       "duration": 30
#     },
#     {
#       "id": 3,
#       "name": "Implement AI",
#       "skills": ["AI", "game development"],
#       "duration": 35
#     }
#   ]
  
# constraints= [
#     {
#       "type": "min_skill_level",
#       "tasks": [1, 3],
#       "value": 3
#     },
#     {
#       "type": "max_hours_per_day",
#       "tasks": [2],
#       "value": 8
#     },
#     {
#       "type": "no_duplicate_task_type",
#       "tasks": [1, 2, 3]
#     }
#   ]

# schedule = create_schedule(employees, tasks, constraints)
# from pprint import pprint
# pprint(schedule)
