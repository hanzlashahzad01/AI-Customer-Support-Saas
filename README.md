# Perfect Pick AI - Customer Support SaaS

## Overview
A MERN Stack AI Customer Support & Ticketing Platform.

## Features implemented
- 🔐 **Authentication**: JWT, Role-based (Admin, User), Login/Register UI.
- 🎨 **Premium UI**: Tailwind CSS, Glassmorphism, Responsive Dashboard.
- 🤖 **AI Chatbot**: Configurable Bot (Name, Tone), AI Stub Integration.
- 💬 **Live Chat**: Socket.io real-time messaging, Chat Widget.
- 📊 **Dashboard**: Statistics, Charts (Recharts).

## Requirements
- Node.js
- MongoDB (running locally or URI in .env)

## Setup & Run

### 1. Server (Backend)
```bash
cd server
npm install
npm run dev
```
Server runs on http://localhost:5000

### 2. Client (Frontend)
```bash
cd client
npm install
npm run dev
```
Client runs on http://localhost:5173

## ScreenShots

## Get Started

<img width="1919" height="1032" alt="1" src="https://github.com/user-attachments/assets/859b6170-f04c-4348-9780-9ec9dd5a99f9" />

## Register Page

<img width="1919" height="1032" alt="register" src="https://github.com/user-attachments/assets/a53606bd-de0a-4bea-85de-3806658217c4" />


## Sign-in-Page

<img width="1919" height="1030" alt="sign in" src="https://github.com/user-attachments/assets/6ffa5e28-7c28-4a57-a952-a2b08e7b8d4d" />

## Analytics Page

<img width="1919" height="1029" alt="Analytics" src="https://github.com/user-attachments/assets/cf0e478b-e157-48a2-884b-c8c9962225ef" />


## Support Center

<img width="1919" height="1029" alt="Support Center" src="https://github.com/user-attachments/assets/b82a5cdd-7812-4b2d-9099-52124e44e3f1" />

## New Ticket

<img width="1919" height="1033" alt="New Ticket" src="https://github.com/user-attachments/assets/a51fafac-6422-43dc-8b91-0edb8a4034bf" />

## Delete Ticket

<img width="1919" height="1032" alt="Delete ticket" src="https://github.com/user-attachments/assets/46077acd-92ed-43b6-bdee-77e3ce226eb1" />

## Response Ticket

<img width="1919" height="1033" alt="t1" src="https://github.com/user-attachments/assets/6f7bd6a0-8c12-4d92-ad46-b920008eaf78" />

## Live Sessions

<img width="1918" height="1031" alt="Live Sessions" src="https://github.com/user-attachments/assets/1e28c154-6940-470c-96a7-683013ed0fd2" />


## Support Bot

<img width="1919" height="1031" alt="Support Bot" src="https://github.com/user-attachments/assets/05443360-33b9-4ace-8956-ea418815bab4" />


## AI Brain 

<img width="1919" height="1031" alt="AI Brain" src="https://github.com/user-attachments/assets/d4bb4e3f-f987-4ddf-a744-7a052f55bd01" />

## Add FAQS

<img width="1919" height="1033" alt="FAQS" src="https://github.com/user-attachments/assets/408ebd56-6fd6-45c9-af95-47a167a6d8ee" />

## Team Members

<img width="1919" height="1030" alt="Team Members" src="https://github.com/user-attachments/assets/864cbd25-271e-433f-9d0f-fd85bba81d64" />

## Add New Member

<img width="1919" height="1033" alt="Add New Member" src="https://github.com/user-attachments/assets/b19acca6-620e-46de-a28c-7a4672e6064f" />

## Notifications

<img width="1919" height="1031" alt="Notifications" src="https://github.com/user-attachments/assets/4b6d6e88-5daa-4463-9205-3d47fc804747" />

## Audits Logs

<img width="1919" height="1031" alt="Audit Logs" src="https://github.com/user-attachments/assets/92a583fd-b23a-4794-92c2-28131c03d6a3" />

## Management Page

<img width="1918" height="1029" alt="Management" src="https://github.com/user-attachments/assets/774fde8f-44eb-40be-84a2-a5a6b04c8c99" />

## Integration 

<img width="1919" height="1032" alt="integration" src="https://github.com/user-attachments/assets/2eba42d4-36db-4d2e-b73b-fcc6d5c76913" />

## Dark Modd On

<img width="1919" height="1029" alt="Dark mood on" src="https://github.com/user-attachments/assets/ea712a57-d209-4f0c-86df-53aba9030f4f" />


## Environment Variables
Check `server/.env` to configure MongoDB URI and OpenAI API Key.

## Usage
1. Register a new account (creates a Company Admin).
2. Go to Dashboard -> Bot Builder to configure your bot.
3. Access the Chat Widget at `/widget/YOUR_COMPANY_ID`.

   
Intelligent-Resume-Screener
Repository navigation
Code
Issues
Pull requests
This is my intelligent-resume-screener website

 0 stars
 0 forks
 0 watching
 1 Branch
 0 Tags
 Activity
Public repository
hanzlashahzad01/Intelligent-Resume-Screener
Name	
hanzlashahzad01
hanzlashahzad01
3 days ago
data
last week
instance
last week
logs
last week
models
last week
nlp
last week
static
last week
templates
last week
tests
last week
utils
last week
Dockerfile
last week
Repository files navigation
README
Intelligent Resume Screener 🚀
An AI-powered tool to automate candidate shortlisting by matching CVs with Job Descriptions using NLP and Cosine Similarity.

Developed for scholarship portfolios (Stipendium Hungaricum, DAAD) to demonstrate applied AI and software engineering proficiency.

🎯 Goal (Problem)
CV + Job Description se skill‑match score nikaalna aur recruiter ko top candidates shortlist karke dikhana.

🧩 Functional Overview (What it does)
FR-1 Upload CV: Multiple CVs upload (batch mode) as PDF / TXT / DOCX.
FR-2 Job Description Input: Web UI par text box me JD paste.
FR-3 Text Processing:
CV & JD ka text extract (PDF/TXT/DOCX).
Cleaning: lowercase, stopwords removal, tokenization.
Vectorization: TF‑IDF representation.
FR-4 Matching Engine:
Cosine similarity score (0–100%) per CV.
Smart score = 40% Semantic + 30% TF‑IDF + 30% Skill‑Match ratio.
Top‑N / Top‑5 candidates ranking.
FR-5 Skill Extraction:
Predefined skills list (Python, Java, ML, SQL, Git, Docker, etc.).
Fuzzy Matching: Matches variations like "NodeJS" vs "Node.js" for higher accuracy.
CV se skills highlight + count.
FR-6 Results Dashboard:
Table: Name | Match % | Skills Found | Experience | Education.
Per‑candidate radar chart (Semantic / Keyword / Skills / Experience / Education).
Downloadable CSV report.
FR-7 Demo UI:
Flask based web app with modern glassmorphism UI.
Upload page + detailed results dashboard.
🧠 Non-Functional Requirements
⏱️ Performance: Designed to return results in < 2 seconds for ~10 CVs on a normal laptop (MiniLM SBERT model, efficient TF‑IDF pipeline).
🔐 Privacy:
CVs are written to a temp folder only for parsing and are deleted immediately after processing.
No biometric or demographic attributes are stored or logged.
🧪 Reproducibility:
Global seeds are fixed (random.seed(42), numpy.random.seed(42)) in both app.py and evaluate.py.
Matching and evaluation are deterministic given the same inputs and environment.
📦 Local Setup:
Runs locally with:
pip install -r requirements.txt
python app.py
ScreenShots
Register Page
register
Sign-Up-Page
sign up
DashBoard
d d1 h dwww
🏗️ Tech Stack (Exact)
Language: Python 3.10+
Backend: Flask
ML/NLP: scikit-learn (TF‑IDF, CountVectorizer, Cosine Similarity), NLTK (tokenization + stopwords), pdfminer.six (PDF text extraction)
Optional / Bonus: spaCy (NER), Sentence-Transformers SBERT (semantic matching)
Data: CSV + plain text sample CVs and JDs
UI: HTML + CSS (glassmorphism) + Chart.js via CDN
📂 Dataset (Synthetic / Sample Data)
data/sample_cvs/ – Synthetic / anonymised CV text files (software engineer, data scientist, etc.).
data/job_descriptions/ – Example job descriptions (e.g., Python developer).
data/sample_cv_data.csv – Optional structured view of sample CVs for experimentation.
Ye sari files demo aur scholarship portfolio ke liye curated hain (no real personal data).

🧮 Method (TF-IDF + Cosine + Semantic)
Text Extraction
PDF → pdfminer.six
DOCX → python-docx
TXT → direct UTF‑8 read
Preprocessing (nlp/preprocess.py)
Lowercasing, URL & special character removal
Tokenization (NLTK)
English + German stopwords removal → multilingual support
Vectorization (nlp/vectorize.py)
TF‑IDF matrix for [JD] + [CVs...]
Optional CountVectorizer matrix for ablation study
Matching Engine (models/matcher.py)
TF‑IDF cosine similarity between JD and each CV.
Semantic similarity using SBERT (paraphrase-MiniLM-L3-v2) – gracefully falls back to zeros if model is unavailable.
Skill Extraction (utils/skills.py)
Regex-based match against predefined SKILLS_DB.
Used both for JD skills and CV skills.
Smart Ranking (app.py)
Skill gap analysis: matching vs missing skills.
Smart score: 
SmartScore
=
0.4
⋅
Semantic
+
0.3
⋅
TFIDF
+
0.3
⋅
SkillMatchRatio
Scores scaled to 0–100%, sorted descending.
📊 Results (Dashboard + CSV)
Web Dashboard (results.html):
Summary table: Name | Match % | Skills Found | Experience | Education.
Per‑candidate profile: email, experience, AI‑generated summary, skills and missing skills.
Radar chart: Semantic vs Keyword vs Skills vs Experience vs Education.
CSV Export:
/download route returns elite_shortlist.csv with:
rank, name, score, experience, email, summary
🚀 Getting Started
Prerequisites
Python 3.10 or higher.
Installation
Clone the repository:
git clone https://github.com/your-username/resume-screener.git
cd resume-screener
Install dependencies:
pip install -r requirements.txt
Run the application:
python app.py
Open your browser and navigate to http://127.0.0.1:5000.
📊 Evaluation Metrics
Ye project accuracy ko measure karne ke liye niche metrics use karta hai:

Cosine Similarity Score:
Main metric for JD–CV matching (TF‑IDF based).
Ablation Study – TF-IDF vs CountVectorizer:
evaluate.py me TF‑IDF vs CountVectorizer similarities compare kiye gaye hain.
Observation: TF‑IDF generic buzzwords ko down‑weight karke ~15% better separation deta hai.
Semantic Ablation – TF-IDF vs SBERT:
Same script me TF‑IDF scores ko Sentence‑BERT semantic scores ke saath compare kiya gaya hai.
Semantic model cases jaise "Neural Networks" ≈ "Deep Learning" ko catch karta hai.
Precision@5 (manual):
Internal labelled test set par Precision@5 ≈ 0.80+ (Top‑5 recommendations mostly JD ke relevant candidates hote hain).
Skill Extraction Accuracy:
70+ industry‑standard technical skills list ke against manual verification.
🚀 How to Run Evaluation & Testing
Console me evaluation / ablation outputs aur visual plots dekhne ke liye:

python evaluate.py
Unit tests run karne ke liye (Engineering Excellence):

pytest tests/
🧪 Test Cases (Verified)
TC-1: JD = "Python ML SQL" → Python / ML / SQL wale CVs consistently top ranks par aate hain.
TC-2: Empty JD input → graceful error notification (flash message) and no processing.
TC-3: Corrupt ya non‑text PDF → text extraction fail hone par user ko error message milta hai ("Could not extract text from the provided files.").
TC-4: Duplicate CV uploads → cleaned text hash ke basis par duplicate CVs detect ho kar skip ho jaate hain (no double counting).
📂 Repo Structure
resume-screener/
│
├─ app.py                 # Flask app & routing
├─ requirements.txt       # Dependencies
├─ README.md              # Documentation
│
├─ data/                  # Sample data storage
├─ nlp/                   # Cleaning & Vectorization logic
├─ models/                # Matching engine
├─ utils/                 # Skills list & Extractor utils
├─ templates/             # HTML views
└─ static/                # CSS & Visual assets
⚖️ Ethics & Privacy (Europe‑Friendly)
No biometric data: Koi images, face data, ya biometric features process nahi hote.
Skills‑based matching:
Matching logic strictly skills, experience text, education par based hai.
Demographic attributes (gender, age, nationality, etc.) ignore kiye jaate hain.
Temporary storage only:
CV files OS ke temp folder me short time ke liye store hote hain.
Parsing ke turant baad files delete ho jaati hain.
Bias & Ethics Engine:
utils/ethics.detect_bias JD/CV ke andar gendered / ageist / exclusionary language detect karta hai (e.g., "rockstar", "ninja", "native speaker", "recent graduate").
Neutral Suggestions: System biased words ke liye professional alternatives suggest karta hai.
Future work (fairness):
Explicit bias‑mitigation metrics (e.g., group fairness scores).
Audit logs for explainability.
🚧 Limitations
Semantic matching quality Sentence‑Transformers model par depend karta hai; offline / low‑resource environments me semantic part zero vector pe fallback ho sakta hai.
Sample dataset limited size ka hai, isliye Precision@5 aur other metrics mainly internal / illustrative hain.
Highly non‑English / domain‑specific CVs (e.g., legal, medical) ke liye skills list aur preprocessing ko extend karna padega.
🎁 Future Work (LLMs, Multilingual, Semantic Search)
LLM‑based ranking:
GPT / similar large language models se richer candidate summaries aur justification.
Multilingual CVs:
Already EN + DE stopwords support, future: more languages + multilingual sentence embeddings.
Advanced Ablation / Research Angle:
TF‑IDF vs dense embeddings vs hybrid models.
Bias mitigation strategies and fairness metrics integration.
🌍 Impact on Europe Scholarship Applications
This project is strategically designed to impress reviewers for scholarships like Stipendium Hungaricum and DAAD:

Applied AI: Demonstrates the ability to transform theoretical NLP (TF-IDF, Cosine Similarity) into a functional tool.
Software Engineering: Showcases clean architecture, modular design, and full-stack integration (Flask + ML).
Ethics Conscious: Addresses privacy and bias, which are critical themes in European tech research and funding.
Problem Solving: Directly addresses a real-world business need (Efficient Recruitment).

## 📬 Connect with Me
I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.

Email: hanzlashahzadhanzlashahzad@gmail.com

LinkedIn: https://www.linkedin.com/in/hanzla-shahzad

GitHub: https://github.com/hanzlashahzad01/hanzlashahzad01


