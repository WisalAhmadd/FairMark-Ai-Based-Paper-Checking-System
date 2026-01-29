import pandas as pd
import pickle
import os

BASE_DIR = r"D:\Career\FYP\Development"

sciq_path = os.path.join(BASE_DIR, "Datasets", "SciQ", "SciQ_Processed.csv")
out_path = os.path.join(BASE_DIR, "Models", "question_text_mapping.pkl")

df = pd.read_csv(sciq_path)

# We assume row index = question_id
question_text_map = {}

for idx, row in df.iterrows():
    question_text_map[idx] = str(row["question"]).strip().lower()

with open(out_path, "wb") as f:
    pickle.dump(question_text_map, f)

print("Saved question_text_mapping.pkl with", len(question_text_map), "questions")
