# core/models.py
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, Group, Permission # Import Group and Permission explicitly
from django.conf import settings # Import settings to reference AUTH_USER_MODEL
from django.utils import timezone

# --- Custom User Manager ---
# This manager handles creating users and superusers for your CustomUser model.
class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)

# --- Custom User Model ---
# This is your new user model that uses email as the primary login field.
class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    # Username is optional for registration, but present for Djoser's default serializer.
    username = models.CharField(max_length=150, unique=True, blank=True, null=True)
    first_name = models.CharField(max_length=30, blank=True) # <-- CORRECTED: used max_length
    last_name = models.CharField(max_length=150, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)

    objects = CustomUserManager() # Assign the custom manager

    USERNAME_FIELD = 'email' # Define 'email' as the field used for logging in
    REQUIRED_FIELDS = ['username'] # Djoser's default serializer expects username and password during creation

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return self.email

    # Methods required for Django admin and other integrations
    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".strip()

    def get_short_name(self):
        return self.first_name

    # --- FIXED: Related_name arguments to prevent clashes with auth.User ---
    # These explicit definitions are needed because PermissionsMixin provides 'groups'
    # and 'user_permissions', and when AUTH_USER_MODEL is set, Django still performs
    # checks against the default 'auth.User' model's reverse relations.
    groups = models.ManyToManyField(
        Group, # Use the imported Group model
        verbose_name=('groups'),
        blank=True,
        help_text=(
            'The groups this user belongs to. A user will get all permissions '
            'granted to each of their groups.'
        ),
        related_name="custom_user_groups", # <--- UNIQUE RELATED_NAME
        related_query_name="custom_user",
    )
    user_permissions = models.ManyToManyField(
        Permission, # Use the imported Permission model
        verbose_name=('user permissions'),
        blank=True,
        help_text=('Specific permissions for this user.'),
        related_name="custom_user_permissions", # <--- UNIQUE RELATED_NAME
        related_query_name="custom_user_permission",
    )
    # --- END RELATED_NAME FIX ---


# --- UPDATED EXISTING MODELS ---
# These models now correctly reference the custom user model using settings.AUTH_USER_MODEL

class Resume(models.Model):
    # Foreign key to the CustomUser model
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    file = models.FileField(upload_to='resumes/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    parsed_text = models.TextField(blank=True)

    def __str__(self):
        return f"Resume ({self.id})"
    
class Job(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    skills_required = models.TextField(blank=True)
    # Foreign key to the CustomUser model
    posted_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_online = models.BooleanField(default=False) # <-- FIXED: Added () and default

    def __str__(self):
        return self.title


class JobApplication(models.Model):
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE)
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    matched_score = models.FloatField(default=0.0)
    missing_keywords = models.TextField(blank=True)

    def __str__(self):
        return f"Application: Resume {self.resume.id} for Job {self.job.title}"