from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponse


urlpatterns = [
    # Admin panel
    path('admin/', admin.site.urls),

    # Core app API routes (jobs, resumes, etc.)
    path('api/', include('core.urls')),

    # Djoser authentication routes
    path('api/auth/', include('djoser.urls')),
    path('api/auth/', include('djoser.urls.jwt')),

    path('', lambda request: HttpResponse("Welcome to JobFinderPro API!"), name='home'),

]

# Media file handling during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
