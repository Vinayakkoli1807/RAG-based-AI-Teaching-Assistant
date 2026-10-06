from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from urllib.parse import unquote
import os
app = FastAPI(title="RAG AI Teaching Assistant")
VIDEO_FOLDER = r"E:\RAG based AI Teaching Assistant\videos"

app.mount(
    "/videos",
    StaticFiles(directory=VIDEO_FOLDER),
    name="videos"
)
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import joblib
import requests


# --------------------------------------------------
# Create FastAPI application
# --------------------------------------------------

app = FastAPI(title="RAG AI Teaching Assistant")


# --------------------------------------------------
# Allow frontend to communicate with backend
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# Load embeddings
# --------------------------------------------------

df = joblib.load("embeddings.joblib")


# --------------------------------------------------
# Request format
# --------------------------------------------------

class QuestionRequest(BaseModel):
    question: str


# --------------------------------------------------
# Create embedding using Ollama bge-m3
# --------------------------------------------------

def create_embedding(text_list):

    r = requests.post(
        "http://localhost:11434/api/embed",
        json={
            "model": "bge-m3",
            "input": text_list
        }
    )

    if r.status_code != 200:
        return None

    data = r.json()

    if "embeddings" not in data:
        return None

    return data["embeddings"]


# --------------------------------------------------
# Generate answer using Llama
# --------------------------------------------------

def inference(prompt):

    r = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "llama3.2",
            "prompt": prompt,
            "stream": False
        }
    )

    response = r.json()

    return response


# --------------------------------------------------
# RAG Question Answering
# --------------------------------------------------

def ask_rag(incoming_query):

    # Create question embedding
    question_embedding = create_embedding(
        [incoming_query]
    )[0]


    # Calculate similarity
    similarities = cosine_similarity(
        np.vstack(df["embedding"]),
        [question_embedding]
    ).flatten()


    # Get top 5 results
    top_results = 5

    max_indx = similarities.argsort()[::-1][0:top_results]

    new_df = df.loc[max_indx]


    # Create prompt
    prompt = f"""
I am teaching web development in my Sigma web development course.

Here are video subtitle chunks containing:
video title, video number, start time, end time and text.

{new_df[["title", "number", "start", "end", "text"]].to_json(
    orient="records"
)}

---------------------------------

User Question:

"{incoming_query}"

Answer the user's question in a human and helpful way.

If the question is related to the course:
- Explain the concept clearly.
- Mention which video contains the relevant information.
- Mention the timestamp where possible.
- Guide the student to the relevant video.

If the question is unrelated to the course:
tell the user that you can only answer questions related to the course.
"""


    # Generate response
    response = inference(prompt)

    answer = response["response"]


    # Prepare source information
    sources = new_df[
        ["title", "number", "start", "end", "text"]
    ].to_dict(orient="records")


    return {
        "question": incoming_query,
        "answer": answer,
        "sources": sources
    }


# --------------------------------------------------
# Test route
# --------------------------------------------------

@app.get("/")
def home():

    return {
        "message": "RAG AI Teaching Assistant API is running!"
    }


# --------------------------------------------------
# Ask question API
# --------------------------------------------------

@app.post("/ask")
def ask_question(request: QuestionRequest):

    result = ask_rag(request.question)

    return result

@app.get("/video/{filename:path}")
def get_video(filename: str):

    filename = unquote(filename)

    video_path = os.path.join(VIDEO_FOLDER, filename)

    # Security check
    video_path = os.path.abspath(video_path)
    video_folder = os.path.abspath(VIDEO_FOLDER)

    if not video_path.startswith(video_folder):
        return {"error": "Invalid video path"}

    if not os.path.exists(video_path):
        return {"error": "Video not found"}

    return FileResponse(
        video_path,
        media_type="video/mp4"
    )


@app.get("/find-video")
def find_video(title: str):

    if not os.path.exists(VIDEO_FOLDER):
        return {
            "found": False,
            "message": "Video folder not found"
        }

    title_lower = title.lower()

    video_files = [
        file
        for file in os.listdir(VIDEO_FOLDER)
        if file.lower().endswith(
            (".mp4", ".webm", ".mkv", ".avi", ".mov")
        )
    ]

    # Exact/partial title matching
    for file in video_files:

        file_without_extension = os.path.splitext(file)[0]

        if (
            title_lower in file_without_extension.lower()
            or file_without_extension.lower() in title_lower
        ):

            return {
                "found": True,
                "filename": file,
                "url": "/video/" + file
            }

    # Word-based matching
    title_words = [
        word.lower()
        for word in title.split()
        if len(word) > 3
    ]

    best_file = None
    best_score = 0

    for file in video_files:

        file_words = [
            word.lower()
            for word in os.path.splitext(file)[0].split()
            if len(word) > 3
        ]

        score = len(
            set(title_words).intersection(file_words)
        )

        if score > best_score:
            best_score = score
            best_file = file

    if best_file and best_score >= 2:

        return {
            "found": True,
            "filename": best_file,
            "url": "/video/" + best_file
        }

    return {
        "found": False,
        "message": "No matching video found"
    }