import pandas as pd


class Evaluator:
    def __init__(self, grader, preprocess_fn):
        self.grader = grader
        self.preprocess_fn = preprocess_fn

    def evaluate_file(self, input_csv_path, output_csv_path):
        print("Loading student answers file...")
        df = pd.read_csv(input_csv_path)

        print("Input columns:", df.columns.tolist())

        # ---- Validate Required Columns ----
        if "question" not in df.columns or "student_answer" not in df.columns:
            raise ValueError("Input must contain columns: question, student_answer")

        results = []

        print("Starting grading...")
        for idx, row in df.iterrows():
            try:
                question_text = str(row["question"])
                student_answer = str(row["student_answer"])

                result = self.grader.grade_by_question_text(
                    question_text=question_text,
                    student_answer=student_answer,
                    preprocess_fn=self.preprocess_fn
                )

                results.append({
                    "question": question_text,
                    "student_answer": student_answer,
                    "cleaned_answer": result["cleaned_answer"],
                    "similarity_score": result["similarity_score"],
                    "marks": result["marks"],
                    "correct_key_answer": result["correct_key_answer"]
                })

            except Exception as e:
                print(f"Error grading row {idx}: {e}")
                results.append({
                    "question": row.get("question", "N/A"),
                    "student_answer": row.get("student_answer", "N/A"),
                    "cleaned_answer": "ERROR",
                    "similarity_score": 0.0,
                    "marks": 0,
                    "correct_key_answer": "ERROR"
                })

        results_df = pd.DataFrame(results)

        print("Saving graded output...")
        results_df.to_csv(output_csv_path, index=False)

        print("Grading completed successfully!")
        print(f"Saved results to: {output_csv_path}")

        return output_csv_path
