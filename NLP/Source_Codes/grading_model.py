import os
import pickle
import torch
from sentence_transformers import SentenceTransformer
from sentence_transformers.util import cos_sim


class GradingModel:
    def __init__(self):
        """
        Initializes the grading model:
        - Loads SBERT
        - Loads stored key answers
        - Loads stored embeddings
        """

        # Absolute path handling (VERY IMPORTANT)
        BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        MODELS_DIR = os.path.join(BASE_DIR, "Models")

        # Load SBERT model
        self.model = SentenceTransformer("all-MiniLM-L6-v2")

        # Load key answers
        with open(os.path.join(MODELS_DIR, "question_key_mapping.pkl"), "rb") as f:
            self.key_map = pickle.load(f)

        # Load embeddings
        with open(os.path.join(MODELS_DIR, "question_embedding_mapping.pkl"), "rb") as f:
            self.embed_map = pickle.load(f)

        print("Grading Model Loaded Successfully!")


    def grade(self, question_id, student_answer, preprocess_fn):
        """
        Grades a student answer using semantic similarity.
        """

        # Step 1: Preprocess
        cleaned = preprocess_fn(student_answer)

        # Step 2: Encode student answer
        student_emb = self.model.encode(cleaned, convert_to_tensor=True)

        # Step 3: Load stored key embedding
        key_emb = torch.tensor(self.embed_map[question_id])

        # Step 4: Similarity
        score = float(cos_sim(student_emb, key_emb))

        # Step 5: Marking logic
        if score >= 0.80:
            marks = 10
        elif score >= 0.65:
            marks = 8
        elif score >= 0.50:
            marks = 6
        else:
            marks = 3

        return {
            "question_id": question_id,
            "cleaned_answer": cleaned,
            "marks": marks,
            "similarity_score": score,
            "correct_key_answer": self.key_map[question_id]
        }
