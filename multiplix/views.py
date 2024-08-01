from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse

from .models import User

# Create your views here.


def index(request):
    return render(request, "multiplix/index.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "multiplix/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "multiplix/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "multiplix/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "multiplix/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))

def profile(request, user):
    return render(request, "multiplix/profile.html", {
    })

def info(request):
    return render(request, "multiplix/info.html", {
    })

def leaderboard(request):
    return render(request, "multiplix/leaderboard.html", {
    })

def test(request, id):
    #create test
    if request.method == 'POST':
        #create test, return testid
        pass

    #finish test
    if request.method == 'PUT':
        pass



