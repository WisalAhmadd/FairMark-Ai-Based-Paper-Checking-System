import pandas as pd
from pipeline import FYPipeline

class Evaluator:

    def __init__(self, pipeline):
        self.pipeline = pipeline

    def evaluate_file(self, input_csv_path, output_csv_path):
        """
        Reads a CSV file of student answers and grades them automatically.
        Expected CSV columns:
        - question_id
        - student_answer
        """

        df = pd.read_csv(input_csv_path)

        results = []
        for idx, row in df.iterrows():
            qid = int(row["question_id"])
            ans = str(row["student_answer"])

            try:
                res = self.pipeline.grade_student_answer(qid, ans)
                results.append(res)
            except Exception as e:
                results.append({
                    "question_id": qid,
                    "cleaned_answer": "",
                    "marks": 0,
                    "similarity_score": 0,
                    "correct_key_answer": "",
                    "error": str(e)
                })

        # Save result as CSV
        pd.DataFrame(results).to_csv(output_csv_path, index=False)

        return output_csv_path
