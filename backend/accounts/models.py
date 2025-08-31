from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings
from django.utils import timezone
from datetime import timedelta


class CustomUser(AbstractUser):
    phone = models.CharField(max_length=20, unique=True, null=True, blank=True)

    def __str__(self):
        return self.username or self.email or self.phone


class PasswordResetCode(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE
    )
    code = models.CharField(max_length=6)  # six-digit code
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)

    def is_valid(self):
        # код действителен 10 минут
        return (
            not self.is_used
            and (timezone.now() - self.created_at) < timedelta(minutes=10)
        )
