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
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    score = models.IntegerField(null=True)
    adjusted_score = models.DecimalField(decimal_places="2", max_digits="10", null=True)
    default = models.BooleanField(default=True)
    average_time = models.DecimalField(decimal_places="2", max_digits="10", null=True)
    best = models.BooleanField(default=False)
    add = models.BooleanField()
    mult = models.BooleanField()
    add_max_1 = models.IntegerField()
    add_max_2 = models.IntegerField()
    mult_max_1 = models.IntegerField()
    mult_max_2 = models.IntegerField()
    add_min_1 = models.IntegerField()
    add_min_2 = models.IntegerField()
    mult_min_1 = models.IntegerField()
    mult_min_2 = models.IntegerField()

    def __str__(self):
        return f"{self.user} with a score of {self.score}."


class Leaderboard(models.Model):
    pass


