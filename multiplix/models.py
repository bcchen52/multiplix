from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    pass
# Create your models here.

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.user

class Test(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    score = models.IntegerField(null=True, blank=True)
    qpm = models.DecimalField(decimal_places="2", max_digits="10", null=True, blank=True)
    qpm_add = models.DecimalField(decimal_places="2", max_digits="10", null=True, blank=True)
    qpm_sub = models.DecimalField(decimal_places="2", max_digits="10", null=True, blank=True)
    qpm_mult = models.DecimalField(decimal_places="2", max_digits="10", null=True, blank=True)
    qpm_div = models.DecimalField(decimal_places="2", max_digits="10", null=True, blank=True)
    default = models.BooleanField(default=True)
    time=models.IntegerField(default=120)
    average_time = models.DecimalField(decimal_places="2", max_digits="10", null=True, blank=True)
    best = models.BooleanField(default=False, blank=True)
    add = models.BooleanField()
    mult = models.BooleanField()

    def get_user(self):
        if self.user:
            return f"{self.user.username}"
        else:
            return "No user"

    def __str__(self):
        return f"{self.user} and test {self.id} with a score of {self.score}."


class Leaderboard(models.Model):
    pass


