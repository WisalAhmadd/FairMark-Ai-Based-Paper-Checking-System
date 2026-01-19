# NLP Module – FairMark

This folder contains the NLP grading logic for the AI-based paper checking system.

## Structure

- Datasets/  
  - SciQ raw and processed datasets  
  - Student input answers  

- Models/  
  - Stored embeddings and key mappings  

- Notebooks/  
  - Data cleaning  
  - Model preparation  
  - Grading logic experiments  

- Source_Codes/  
  - preprocessing.py  
  - grading_model.py  
  - evaluation.py  

## Status

Current version supports:
- English short answers
- Semantic similarity grading using SBERT
- SciQ dataset integration

OCR and frontend will be integrated later.
