from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from rest_framework.generics import ListAPIView
from rest_framework import status
from rest_framework.decorators import api_view
from django.http import JsonResponse
from .models import Resume, Job, JobApplication
from .serializers import ResumeSerializer, JobSerializer, JobApplicationSerializer
from PyPDF2 import PdfReader
import docx2txt
import spacy
import requests

# Load spaCy NLP model
nlp = spacy.load("en_core_web_sm")

# TEXT EXTRACTION  #

def extract_text(file):
    if file.name.endswith(".pdf"):
        reader = PdfReader(file)
        return " ".join([page.extract_text() or '' for page in reader.pages])
    elif file.name.endswith(".docx"):
        return docx2txt.process(file)
    return ""

def extract_keywords(text):
    doc = nlp(text.lower())
    return set(token.lemma_ for token in doc if token.pos_ in ["NOUN", "PROPN", "VERB", "ADJ"] and not token.is_stop and token.is_alpha)

def extract_skills(text):
    doc = nlp(text.lower())
    return [token.lemma_ for token in doc if token.pos_ in ["NOUN", "PROPN", "VERB", "ADJ"] and not token.is_stop and token.is_alpha]

# RESUME UPLOAD  #

class ResumeUploadView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request):
        try:
            file = request.FILES['file']
            text = extract_text(file)
            skills = extract_skills(text)

            resume = Resume.objects.create(file=file, parsed_text=text)
            return Response({"message": "Resume Uploaded", "skills": skills})
        except Exception as e:
            return Response({"error": str(e)}, status=500)

# MATCH RESUME TO ONE JOB  #

class MatchResumeView(APIView):
    def post(self, request):
        resume_id = request.data.get('resume_id')
        job_id = request.data.get('job_id')

        if not resume_id or not job_id:
            return Response({'error': 'Both resume_id and job_id are required.'}, status=400)

        try:
            resume = Resume.objects.get(id=resume_id)
            job = Job.objects.get(id=job_id)
        except Resume.DoesNotExist:
            return Response({'error': 'Resume not found'}, status=404)
        except Job.DoesNotExist:
            return Response({'error': 'Job not found'}, status=404)

        resume_keywords = extract_keywords(resume.parsed_text)
        job_keywords = extract_keywords(job.description)

        matched = resume_keywords.intersection(job_keywords)
        missing = job_keywords - matched

        score = round(len(matched) / len(job_keywords) * 100, 2) if job_keywords else 0.0

        application = JobApplication.objects.create(
            resume=resume,
            job=job,
            matched_score=score,
            missing_keywords=", ".join(missing)
        )

        return Response({
            "score": score,
            "matched_keywords": list(matched),
            "missing_keywords": list(missing),
            "message": "Resume matched successfully"
        })


# MATCH RESUME TO ALL JOBS #

class ResumeJobMatchView(APIView):
    def get(self, request, resume_id):
        try:
            resume = Resume.objects.get(id=resume_id)
            resume_skills = set(extract_skills(resume.parsed_text))  # Extracted from NLP
            
            jobs = Job.objects.all()
            results = []

            for job in jobs:
                job_skill_text = job.skills_required or ""
                job_skills = set(s.strip().lower() for s in job_skill_text.split(",") if s.strip())

                matched = resume_skills.intersection(job_skills)
                missing = job_skills - matched

                score = round(len(matched) / len(job_skills) * 100, 2) if job_skills else 0

                results.append({
                    "job id": job.id,
                    "job_title": job.title,
                    "match_score": score,
                    "matched_skills": list(matched),
                    "missing_skills": list(missing),
                    "skills_required": list(job_skills),
                })

            return Response({"results": results})
        except Resume.DoesNotExist:
            return Response({"error": "Resume not found"}, status=404)
#  GET ALL RESUMES  #

class ResumeListView(ListAPIView):
    queryset = Resume.objects.all()
    serializer_class = ResumeSerializer

def get_resume_by_id(request, pk):
    if request.method == 'GET':
        try:
            resume = Resume.objects.get(pk=pk)
            serializer = ResumeSerializer(resume)
            return JsonResponse(serializer.data, safe=False)
        except Resume.DoesNotExist:
            return JsonResponse({'error': 'Resume not found'}, status=404)

# JOB LIST / CREATE - #

class JobListView(APIView):
    def get(self, request):
        jobs = Job.objects.all().order_by('-created_at')
        serializer = JobSerializer(jobs, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = JobSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def job_list_create(request):
    if request.method == 'GET':
        jobs = Job.objects.all()
        serializer = JobSerializer(jobs, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = JobSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

# ---------------- FETCH ONLINE JOBS (ADZUNA) ---------------- #

class AdzunaJobListView(APIView):
    def get(self, request):
        app_id = "a797b604"  # your App ID
        app_key = "4475ed217acd56a3e557fcf233286270"  # your API key
        country = "in"

        url = f"https://api.adzuna.com/v1/api/jobs/{country}/search/1"
        params = {
            "app_id": app_id,
            "app_key": app_key,
            "results_per_page": 10,
            "content-type": "application/json",
        }

        try:
            res = requests.get(url, params=params)
            data = res.json()

            # Basic transformation
            jobs = []
            for job in data.get("results", []):
                jobs.append({
                    "title": job.get("title"),
                    "description": job.get("description"),
                    "company": job.get("company", {}).get("display_name"),
                    "location": job.get("location", {}).get("display_name"),
                    "redirect_url": job.get("redirect_url"),
                })

            return Response({"results": jobs})
        except Exception as e:
            return Response({"error": str(e)}, status=500)



class MatchResumeWithAdzunaView(APIView):
    def post(self, request):
        resume_id = request.data.get("resume_id")
        query = request.data.get("query", "developer")

        app_id = "865b5609"  # from your image
        app_key = "24f7d0a4f3a0d519eb8e2d63de83d198"  # from your image
        country = "in"

        if not resume_id:
            return Response({"error": "resume_id is required"}, status=400)

        try:
            resume = Resume.objects.get(id=resume_id)
        except Resume.DoesNotExist:
            return Response({"error": "Resume not found"}, status=404)

        resume_keywords = extract_keywords(resume.parsed_text)

        url = f"https://api.adzuna.com/v1/api/jobs/{country}/search/1"
        params = {
            "app_id": app_id,
            "app_key": app_key,
            "results_per_page": 10,
            "what": query
        }

        try:
            res = requests.get(url, params=params)
            data = res.json()
            results = []

            for job in data.get("results", []):
                job_text = job.get("description", "")
                job_keywords = extract_keywords(job_text)
                matched = resume_keywords & job_keywords
                missing = job_keywords - resume_keywords
                score = round(len(matched) / len(job_keywords) * 100, 2) if job_keywords else 0.0

                results.append({
                    "job_title": job.get("title"),
                    "company": job.get("company", {}).get("display_name"),
                    "score": score,
                    "matched_keywords": list(matched),
                    "missing_keywords": list(missing),
                    "apply_link": job.get("redirect_url"),
                })

            return Response({"results": results})
        except Exception as e:
            return Response({"error": str(e)}, status=500)