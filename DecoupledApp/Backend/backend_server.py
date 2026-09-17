"""
A simple backend server using FastAPI to serve API and interact with a SQLite database.
To run this server locally, use the command in terminal: fastapi dev backend_server.py --port 8000
"""

from pathlib import Path
import sqlite3
from typing import List, Dict, Any
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add SQLite path to this script file 
DB_PATH = Path(__file__).resolve().parent / "database.sqlite"

# CORS configuration for simple, no-auth local requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_student_grades(student_id: int) -> list:
    try:
        # Context manager handles connection closing automatically
        with sqlite3.connect(DB_PATH) as conn:
            cursor = conn.cursor()
            cursor.execute(
                "SELECT * FROM Grade WHERE stu_id = ?",
                (student_id,),
            )
            return cursor.fetchall()
    except sqlite3.Error as e:
        print(f"Database error: {e}")
        raise HTTPException(status_code=500, detail="Database query error.")


@app.get("/get_grades", response_model=List[Dict[str, Any]])
def get_grades(student_id: int = Query(..., description="Student ID")):
    rows = get_student_grades(student_id)

    # Return a structured list of dictionaries for API response
    return [
        {
            "Student ID": row[0],
            "Student Name": row[1],
            "Course Name": row[2],
            "Course Grade": row[3],
        }
        for row in rows
    ]