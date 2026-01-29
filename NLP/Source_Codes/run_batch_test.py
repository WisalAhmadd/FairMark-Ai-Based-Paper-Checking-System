from grading_model import GradingModel
from preprocessing import preprocess
from evaluation import Evaluator
import os

BASE_DIR = r"D:\Career\FYP\Development"

input_csv = os.path.join(BASE_DIR, "Datasets", "Students_Inputs", "test_set.csv")
output_csv = os.path.join(BASE_DIR, "Datasets", "Students_Inputs", "graded_test_set.csv")

grader = GradingModel(BASE_DIR)
evaluator = Evaluator(grader, preprocess)

evaluator.evaluate_file(input_csv, output_csv)
