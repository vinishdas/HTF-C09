import pandas as pd
import torch
import networkx as nx
from torch_geometric.utils import from_networkx

def load_skill_index(skill_file):
    """Loads skills.csv and builds a skill:index mapping."""
    skills_df = pd.read_csv(skill_file)
    return {skill.strip(): idx for idx, skill in enumerate(skills_df['Skill'])}

def encode_skills(skill_list, skill_to_index):
    """Encodes employee skills as binary vector."""
    vector = [0] * len(skill_to_index)
    for skill in skill_list:
        skill = skill.strip()
        if skill in skill_to_index:
            vector[skill_to_index[skill]] = 1
    return vector

def build_employee_graph(csv_path, skill_file):
    """Builds a graph with node features based on skill match + attributes."""
    df = pd.read_csv(csv_path, encoding='ISO-8859-1', delimiter=',', on_bad_lines='skip')
    df['Available_From'] = pd.to_datetime(df['Available_From'], format='%d/%m/%Y') # make sure it's datetime

    skill_to_index = load_skill_index(skill_file)
    G = nx.Graph()
    features = []

    for _, row in df.iterrows():
        node_id = row['Employee_ID']
        skills = [s.strip() for s in row['Skills'].split(',')]

        # Encode skills from the skills.csv master list
        skill_vec = encode_skills(skills, skill_to_index)

        # Append meta attributes
        attr_vector = skill_vec + [
            float(row['Skill_Level']),
            float(row['Experience_Years']),
            float(row['Workload_Percentage']),
            float(row['Stress_Level']),
        ]

        # Add node to the graph
        G.add_node(node_id,
                   x=torch.tensor(attr_vector, dtype=torch.float),
                   name=row['Employee_Name'],
                   skills=skills,  # for reference
                   team=row['Team_ID'],
                   availability=row['Availability_Status'])

        features.append(attr_vector)

    # Add edges within same team
    for _, r1 in df.iterrows():
        for _, r2 in df.iterrows():
            if r1['Team_ID'] == r2['Team_ID'] and r1['Employee_ID'] != r2['Employee_ID']:
                G.add_edge(r1['Employee_ID'], r2['Employee_ID'])

    # Convert to PyTorch Geometric format
    pyg_data = from_networkx(G)
    pyg_data.x = torch.tensor(features, dtype=torch.float)

    return pyg_data, df
