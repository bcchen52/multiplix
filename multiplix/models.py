from django.contrib.auth.models import AbstractUser
from django.db import models
import datetime

class User(AbstractUser):
    pass    

class Test(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    qpm = models.DecimalField(decimal_places=2, max_digits=10, default=0, blank=True)
    default = models.BooleanField(default=True)
    time=models.IntegerField(default=120)
    add = models.BooleanField(default=False)
    mult = models.BooleanField(default=False)

    def get_user(self):
        if self.user:
            return f"{self.user.username}"
        else:
            return "No user"

    def __str__(self):
        return f"{self.user} and test {self.id} with a score of {self.score} and a qpm of {self.qpm}."
    
class Profile(models.Model):
    created = models.DateField(auto_now_add=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    total_time = models.IntegerField(default=0)
    tests_taken = models.IntegerField(default=0)
    best_overall = models.IntegerField(default=0)
    best_30 = models.IntegerField(default=0)
    best_60 = models.IntegerField(default=0)
    best_120 = models.IntegerField(default=0)
    best_180 = models.IntegerField(default=0)
    level = models.IntegerField(default=0)
    place_overall = models.BooleanField(default=False)
    place_30 = models.BooleanField(default=False)
    place_60 = models.BooleanField(default=False)
    place_120 = models.BooleanField(default=False)
    place_180 = models.BooleanField(default=False)

    def __str__(self):
        return self.user

class Leaderboard(models.Model):
    tests = models.ManyToManyField(Test, related_name="leaderboard")
    name = models.CharField(max_length=16, default="name")
    display_name = models.CharField(max_length=32, default="display_name")
    length = models.IntegerField(default=50)
    min_value = models.DecimalField(decimal_places=2, max_digits=10, default=0)

    def __str__(self):
        return self.name