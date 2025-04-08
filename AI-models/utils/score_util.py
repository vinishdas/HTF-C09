
from collections import defaultdict

def calculate_top_teams(ranked, df, project_data, top_n=3):
    team_scores_raw = defaultdict(list)

    for emp in ranked:
        team_scores_raw[emp[2]].append(emp)

    team_scores_composite = {}

    for team, members in team_scores_raw.items():
        total_score = sum(emp[3] for emp in members)

        # Collect all unique skills from team members
        team_skills = set()
        for emp in members:
            emp_row = df[df['Employee_ID'] == emp[0]]
            if not emp_row.empty:
                skills = emp_row.iloc[0]['Skills'].split(',')
                team_skills.update([s.strip().lower() for s in skills])

        required_skills = set(s.lower() for s in project_data['Skills_Required'])
        covered_skills = team_skills & required_skills
        skill_coverage_ratio = len(covered_skills) / len(required_skills)
        composite_score = skill_coverage_ratio * total_score

        team_scores_composite[team] = {
            "composite_score": composite_score,
            "covered_skills": sorted(covered_skills),
            "coverage_str": f"{len(covered_skills)}/{len(required_skills)}"
        }

    # Sort teams by composite score
    sorted_teams = sorted(team_scores_composite.items(), key=lambda x: x[1]['composite_score'], reverse=True)


    # ✨ Print in your style
    print("\n🏆 Top Teams based on Composite Score (Coverage × Member Score):\n")
    for team, info in sorted_teams[:top_n]:
        print(f"🏆 Team {team} → Composite Score: {info['composite_score']:.4f} | Coverage: {info['coverage_str']} | 🔧 Covered Skills: {info['covered_skills']}")

    return sorted_teams
