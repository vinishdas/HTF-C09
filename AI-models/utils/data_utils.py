import torch
import pandas as pd


def load_skill_index(skills_csv_path):
    df = pd.read_csv(skills_csv_path)
    skill_index = {skill: idx for idx, skill in enumerate(df['Skill'].unique())}
    return skill_index

def encode_project_skills(project_skills, skill_to_index):
    vector = [0] * len(skill_to_index)
    for skill in project_skills:
        skill = skill.strip()
        if skill in skill_to_index:
            vector[skill_to_index[skill]] = 1
    return vector

import torch

def get_project_vector(project_data, skill_to_index):
    # 🔧 This function now takes a dictionary (NOT a file path)
    
    skill_vec = encode_project_skills(project_data['Skills_Required'], skill_to_index)

    # Default meta values if keys are missing
    meta = [
        float(project_data.get('skill_level', 5.0)),
        float(project_data.get('experience_years', 3.0)),
        float(project_data.get('workload_percentage', 50.0)),
        float(project_data.get('stress_level', 2.0))
    ]

    # 🔁 Return combined skill vector + metadata as a tensor
    return torch.tensor(skill_vec + meta, dtype=torch.float)

