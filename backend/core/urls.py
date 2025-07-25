from django.urls import path
from django.http import JsonResponse
from . import views
from .views import(
    ResumeUploadView,
    JobListView,
    ResumeJobMatchView,
    ResumeListView,
    MatchResumeView,
)

urlpatterns = [
    path('', lambda request: JsonResponse({
        "message": "Welcome to JobFinderPro API Root",
        "available_routes": [
            "/api/resumes/upload/",
            "/api/jobs/",
            "/api/resumes/",
            "/api/resume/match/",
            "/api/resume/<id>/",
            "/api/resume/<id>/match_job/",
            "/api/auth/"
        ]
    })),

    path('resumes/upload/', ResumeUploadView.as_view()),
    path('jobs/', JobListView.as_view()),
    path('resumes/', ResumeListView.as_view()),
    path('resume/match/', MatchResumeView.as_view()),
    path('resume/<int:pk>/', views.get_resume_by_id, name='get_resume_by_id'),
    path('resume/<int:resume_id>/match_job/', ResumeJobMatchView.as_view(), name='match-resume-to-all-jobs'),
]
