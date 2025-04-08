# # main.py

# import torch
# from models.gnn_model import GNNModel
# from utils.graph_utils import build_employee_graph
# from utils.data_utils import load_skill_index, get_project_vector
# from utils.rl_agent import RuleBasedRLAgent
# from utils.score_util import calculate_top_teams

# import pandas as pd
# import json

# # --- Load Data ---
# def run_main():
#  employee_csv = 'data/employees.csv'
#  skills_csv = 'data/skills.csv'
#  project_json = 'data/project.json'
#  project_data = json.load(open(project_json))

# # --- Build Graph ---
#  skill_index = load_skill_index(skills_csv)
#  pyg_data, df = build_employee_graph(employee_csv, skills_csv)

# # --- Load GNN Model ---
#  input_dim = pyg_data.x.shape[1]
#  gnn = GNNModel(input_dim=input_dim, hidden_dim=16, output_dim=12)
#  gnn.load_state_dict(torch.load('models/gnn_model.pth'))
#  gnn.eval()

# # --- Generate Embeddings ---
#  employee_embeddings = gnn(pyg_data).detach()
#  project_vector = get_project_vector(project_json, skill_index)

# # --- Score Employees ---
#  agent = RuleBasedRLAgent()
#  scores = []
#  employee_data_for_allocation = []

#  for i, node_id in enumerate(df['Employee_ID']):
#     emb = employee_embeddings[i]
#     workload = df.loc[i, 'Workload_Percentage']
#     avail_date = df.loc[i, 'Available_From']
#     employee_skills = df.loc[i, 'Skills'].split(',')
#     project_skills = project_data['Skills_Required']
#     employee_name = df.loc[i, 'Employee_Name']

#     score = agent.score(emb, project_vector, workload, avail_date,
#                         employee_skills, project_skills, employee_name=employee_name)

#     scores.append((node_id, employee_name, df.loc[i, 'Team_ID'], score))

#     employee_data_for_allocation.append({
#         "name": employee_name,
#         "team": df.loc[i, 'Team_ID'],
#         "skills": employee_skills,
#         "score": score
#     })

# # --- Rank Employees ---
#  ranked = sorted(scores, key=lambda x: x[3], reverse=True)
#  print("\n🔥 Top matched employees for the project:\n")
#  for r in ranked[:5]:
#     print(f"👤 Employee: {r[1]} | 🧑‍🤝‍🧑 Team: {r[2]} | 🎯 Score: {r[3]:.4f}")

# # --- Allocate Tasks ---
#  sorted_teams = calculate_top_teams(ranked, df, project_data)
#  selected_team = sorted_teams[0][0]
#  task_skills = project_data["Skills_Required"]
#  team_employees = [emp for emp in employee_data_for_allocation if emp["team"] == selected_team]

#  task_allocation = {}
#  for task in task_skills:
#     task_lower = task.strip().lower()
#     candidates = [
#         emp for emp in team_employees
#         if task_lower in [s.strip().lower() for s in emp["skills"]]
#     ]
#     if candidates:
#         best_candidate = sorted(candidates, key=lambda x: x["score"], reverse=True)[0]
#         task_allocation[task] = best_candidate["name"]

#  print(f"\n✅ Task Allocation for Team {selected_team}:\n")
#  for task, emp_name in task_allocation.items():
#     print(f"🔹 Task: {task} ➡ Assigned to: {emp_name}")




# main.py

import torch
from models.gnn_model import GNNModel
from utils.graph_utils import build_employee_graph
from utils.data_utils import load_skill_index, get_project_vector
from utils.rl_agent import RuleBasedRLAgent
from utils.score_util import calculate_top_teams

import pandas as pd

# --- Run Main ---
def run_main(project_data):
    print("📥 Received project data:", project_data)
    employee_csv = 'data/employees.csv'
    skills_csv = 'data/skills.csv'

    # --- Build Graph ---
    skill_index = load_skill_index(skills_csv)
    pyg_data, df = build_employee_graph(employee_csv, skills_csv)

    # --- Load GNN Model ---
    input_dim = pyg_data.x.shape[1]
    gnn = GNNModel(input_dim=input_dim, hidden_dim=16, output_dim=12)
    gnn.load_state_dict(torch.load('models/gnn_model.pth'))
    gnn.eval()

    # --- Generate Embeddings ---
    employee_embeddings = gnn(pyg_data).detach()
    project_vector = get_project_vector(project_data, skill_index)

    # --- Score Employees ---
    agent = RuleBasedRLAgent()
    scores = []
    employee_data_for_allocation = []

    for i, node_id in enumerate(df['Employee_ID']):
        emb = employee_embeddings[i]
        workload = df.loc[i, 'Workload_Percentage']
        avail_date = df.loc[i, 'Available_From']
        employee_skills = df.loc[i, 'Skills'].split(',')
        project_skills = project_data['Skills_Required']
        employee_name = df.loc[i, 'Employee_Name']

        score = agent.score(emb, project_vector, workload, avail_date,
                            employee_skills, project_skills, employee_name=employee_name)

        scores.append((node_id, employee_name, df.loc[i, 'Team_ID'], score))

        employee_data_for_allocation.append({
            "name": employee_name,
            "team": df.loc[i, 'Team_ID'],
            "skills": employee_skills,
            "score": score
        })

    # --- Rank Employees ---
    ranked = sorted(scores, key=lambda x: x[3], reverse=True)

    # --- Allocate Tasks ---
    sorted_teams = calculate_top_teams(ranked, df, project_data)
    selected_team = sorted_teams[0][0]
    task_skills = project_data["Skills_Required"]
    team_employees = [emp for emp in employee_data_for_allocation if emp["team"] == selected_team]

    task_allocation = {}
    for task in task_skills:
        task_lower = task.strip().lower()
        candidates = [
            emp for emp in team_employees
            if task_lower in [s.strip().lower() for s in emp["skills"]]
        ]
        if candidates:
            best_candidate = sorted(candidates, key=lambda x: x["score"], reverse=True)[0]
            task_allocation[task] = best_candidate["name"]

    # --- Final Output ---
    result = {
        "selected_team": selected_team,
        "team_members": sorted([
            {
                "name": emp["name"],
                "skills": emp["skills"],
                "score": round(emp["score"], 4)
            } for emp in team_employees
        ], key=lambda x: x["score"], reverse=True),
        "task_allocation": task_allocation
    }

    return result
