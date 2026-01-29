import os
import pickle
import torch
from sentence_transformers import SentenceTransformer
from sentence_transformers.util import cos_sim


class GradingModel:
    def __init__(self, base_dir):
        print("Loading SBERT model...")
        self.model = SentenceTransformer("all-MiniLM-L6-v2")

        print("Loading key map...")
        with open(os.path.join(base_dir, "Models", "question_key_mapping.pkl"), "rb") as f:
            self.key_map = pickle.load(f)  # qid -> correct answer

        print("Loading embedding map...")
        with open(os.path.join(base_dir, "Models", "question_embedding_mapping.pkl"), "rb") as f:
            self.embed_map = pickle.load(f)  # qid -> embedding

        print("Loading question text map...")
        with open(os.path.join(base_dir, "Models", "question_text_mapping.pkl"), "rb") as f:
            self.question_text_map = pickle.load(f)  # qid -> question text (lowercase)

        print("Grading Model Loaded Successfully!")

    def find_question_id(self, question_text):
        """
        Exact match lookup (case-insensitive, stripped)
        """
        q = question_text.strip().lower()

        for qid, stored_q in self.question_text_map.items():
            if q == stored_q:
                return qid

        return None

    def grade_by_question_text(self, question_text, student_answer, preprocess_fn):
        # ---- Step 1: Find question_id from question text ----
        qid = self.find_question_id(question_text)

        if qid is None:
            return {
                "question": question_text,
                "cleaned_answer": "",
                "marks": 0,
                "similarity_score": 0.0,
                "correct_key_answer": "QUESTION NOT FOUND"
            }

        # ---- Step 2: Preprocess student answer ----
        cleaned = preprocess_fn(student_answer)

        # ---- Step 3: Encode student answer ----
        student_emb = self.model.encode(cleaned, convert_to_tensor=True)

        # ---- Step 4: Load correct embedding ----
        key_emb_numpy = self.embed_map[qid]
        key_emb = torch.tensor(key_emb_numpy)

        # ---- Step 5: Cosine similarity ----
        score = float(cos_sim(student_emb, key_emb))

        # ---- Step 6: Marking scheme ----
        if score >= 0.80:
            marks = 10
        elif score >= 0.65:
            marks = 8
        elif score >= 0.50:
            marks = 6
        else:
            marks = 3

        return {
            "question": question_text,
            "cleaned_answer": cleaned,
            "marks": marks,
            "similarity_score": score,
            "correct_key_answer": self.key_map[qid]
        }
