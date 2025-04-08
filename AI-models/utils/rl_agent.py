
from datetime import datetime
import pandas as pd
import torch.nn.functional as F

class RuleBasedRLAgent:
    def __init__(self, min_skill_match=1, max_days_until_available=7):
        self.min_skill_match = min_skill_match
        self.max_days_until_available = max_days_until_available

    def score(self, employee_embedding, project_vector, workload_percent, available_from,
              employee_skills, project_skills, employee_name=""):

        # 1. Skill matching
        employee_skills_set = set(map(str.lower, employee_skills))
        project_skills_set = set(map(str.lower, project_skills))
        matched_skills = employee_skills_set.intersection(project_skills_set)
        matched_skill_count = len(matched_skills)

        if matched_skill_count < self.min_skill_match:
            print(f"[SKIP ❌] {employee_name} — Insufficient skill match ({matched_skill_count})")
            return 0

        # 2. Cosine similarity
        skill_score = F.cosine_similarity(employee_embedding.unsqueeze(0), project_vector.unsqueeze(0)).item()

        try:
          available_date = pd.to_datetime(available_from).date() # available_from is already a Timestamp
          today = datetime.today().date()
        except Exception:
           print(f"[ERROR] {employee_name} — Invalid date format for availability: '{available_from}'")
           return 0





        days_until_free = (available_date - today).days
        if days_until_free < 0:
            days_until_free = 0  # Already available

        # 👉 Skip if not available within threshold
        if days_until_free > self.max_days_until_available:
            print(f"[SKIP 🕒] {employee_name} — Not available within {self.max_days_until_available} days (Available in {days_until_free} days)")
            return 0

        availability_score = 1 / (1 + days_until_free)

        # 4. Workload (soft penalty)
        workload_penalty = 0.02 * (min(workload_percent / 100, 1))

        # 5. Skill count ratio
        skill_coverage_ratio = matched_skill_count / len(project_skills)

        # 6. Final score
        final_score = (
            0.60 * skill_score +
            0.25 * skill_coverage_ratio +
            0.13 * availability_score -
            workload_penalty
        )

        print(f"[✅] {employee_name} — Skills: {matched_skills} | Available in {days_until_free} day(s) | Score: {final_score:.4f}")
        return final_score

