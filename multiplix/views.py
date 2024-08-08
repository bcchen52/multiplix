import json
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt 

from .models import User, Profile, Test, Leaderboard

# Create your views here.

# Create Leaderboards
def create_leaderboards():
    if not Leaderboard.objects.filter(name="Top QPM").exists:
        top_qpm = Leaderboard(name="Top QPM")
        top_qpm.save()
    if not Leaderboard.objects.filter(name="Top QPM 30 Seconds").exists:
        top_qpm = Leaderboard(name="Top QPM 30 Seconds")
        top_qpm.save()
    if not Leaderboard.objects.filter(name="Top QPM 60 Seconds").exists:
        top_qpm = Leaderboard(name="Top QPM 60 Seconds")
        top_qpm.save()
    if not Leaderboard.objects.filter(name="Top QPM 120").exists:
        top_qpm = Leaderboard(name="Top QPM 120 Seconds")
        top_qpm.save() 
    if not Leaderboard.objects.filter(name="Top QPM 180").exists:
        top_qpm = Leaderboard(name="Top QPM 180 Seconds")
        top_qpm.save() 

create_leaderboards()

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
            print("pass dont match")
            return render(request, "multiplix/login.html", {
                "register_message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            print("user_taken")
            return render(request, "multiplix/login.html", {
                "register_message": "Username already taken."
            })
        login(request, user)
        profile = Profile(user=user)
        profile.save()
        return HttpResponseRedirect(reverse("index"))

def profile(request, username):
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return HttpResponseRedirect(reverse("index"))

    try: 
        profile = Profile.objects.get(user=user)
    except Profile.DoesNotExist:
        return HttpResponseRedirect(reverse("index"))

    return render(request, "multiplix/profile.html", {
        "best_overall": profile.best_overall, 
        "best_30": profile.best_30, 
        "best_60": profile.best_60, 
        "best_120": profile.best_120, 
        "best_180": profile.best_180, 
    })

def info(request):
    return render(request, "multiplix/info.html", {
    })

def leaderboard(request):
    #pagination
    return render(request, "multiplix/leaderboard.html", {
    })

@csrf_exempt 
def test(request, id):
    #finish test
    if request.method == 'PUT':
        test = Test.objects.get(id=id)
        data = json.loads(request.body)
        profile = Profile.objects.get(user=test.user)

        #check profile
        if data["qpm"] > profile.best_overall:
            profile.best_overall = data["qpm"]
        if data["time"] == 30:
            if data["qpm"] > profile.best_30:
                profile.best_30 = data["qpm"]
        if data["time"] == 60:
            if data["qpm"] > profile.best_60:
                profile.best_60 = data["qpm"]
        if data["time"] == 120:
            if data["qpm"] > profile.best_120:
                profile.best_120 = data["qpm"]
        if data["time"] == 180:
            if data["qpm"] > profile.best_180:
                profile.best_180 = data["qpm"]
        
        profile.save()


        #put all values 
        #save test
        #if it is user's personal best or leaderboard, don't kill it
        # else kill it 
        #clear all empty tests
        #
        return JsonResponse({
            "message": "Post updated!"
        }, status=200)

@csrf_exempt 
def create_test(request):
    Test.objects.filter(user=None).delete()
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
            "logged_in": request.user.is_authenticated,
        }, status=400)


def update_leaderboards(test):
    #first, check if the leaderboards are less than 50
        #get leaderboard
    #else, check if test qpm is greater than the lowest value
    #if so, loop through
    #find a way to loop thru all leaderboards
        #get a field called time, let overall be 0
    pass