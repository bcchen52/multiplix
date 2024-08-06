import json
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt 

from .models import User, Profile, Test

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

@csrf_exempt 
def test(request, id):
    #create test
    #finish test
    if request.method == 'PUT':
        #clear all empty tests
        pass

@csrf_exempt 
def create_test(request):
    Test.objects.filter(user = None).delete()
    #kill tests from people without a user
    tests = Test.objects.all().count()
    print(tests)
    if request.method == 'POST':
        #create test, return testid
        data = json.loads(request.body)
        #print(data)
        if request.user.is_authenticated:
            current_user = request.user
        else:
            current_user = None
        
        test = Test(user=current_user, time=data["time"], add=data["add"], mult=data["mult"], default=data["is_default"])
        test.save()
        return JsonResponse({
            "test_id": test.id,
            "time": test.get_user(),
        }, status=400)


