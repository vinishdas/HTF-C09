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
    print(status, cp_model.FEASIBLE, cp_model.OPTIMAL)
    if status in [cp_model.FEASIBLE, cp_model.OPTIMAL]:
        schedule = defaultdict(lambda: defaultdict(list))
        for (t_id, e_id, d), var in x.items():
            if solver.Value(var):
                emp_name = employees[e_id]['name']
                schedule[d][emp_name].append(tasks[t_id]['name'])
        return dict(schedule)
    else:
        return "\u274c No solution found. Try adjusting constraints."

