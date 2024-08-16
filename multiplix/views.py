import json
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_protect
from django.core.paginator import Paginator

from .models import User, Profile, Test, Leaderboard

# Create your views here.

# Create Leaderboards
def create_leaderboards():
    if not Leaderboard.objects.filter(name="overall").exists():
        print("made overall")
        #change the length back to 100, this is just for testing
        top_qpm = Leaderboard(name="overall", display_name="Top 100 QPM", length=100)
        top_qpm.save()
    if not Leaderboard.objects.filter(name="30").exists():
        top_qpm = Leaderboard(name="30", display_name="Top 50 QPM for 30s")
        top_qpm.save()
    if not Leaderboard.objects.filter(name="60").exists():
        top_qpm = Leaderboard(name="60", display_name="Top 50 QPM for 60s")
        top_qpm.save()
    if not Leaderboard.objects.filter(name="120").exists():
        top_qpm = Leaderboard(name="120", display_name="Top 50 QPM for 120s")
        top_qpm.save() 
    if not Leaderboard.objects.filter(name="180").exists():
        top_qpm = Leaderboard(name="180", display_name="Top 50 QPM for 180s")
        top_qpm.save() 
    #print(Leaderboard.objects.all().count())

def index(request):
    create_leaderboards()
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
            return render(request, "multiplix/login.html", {
                "register_message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
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
    
    is_user = False
    relative_user = f"{user.username} has"

    #print(request.user.is_authenticated)
    if request.user.is_authenticated:
        if request.user == user:
            is_user = True
            relative_user = "You have"

    seconds = profile.total_time
    formatted_time = f"{seconds} seconds"
    if seconds > 60:
        minutes = seconds // 60
        seconds = seconds % 60
        if minutes > 60:
            hours = minutes // 60
            minutes = minutes % 60
            if hours > 24:
                days = hours // 24
                hours = hours % 24
                formatted_time = f"{days} days, {hours} hours, {minutes} minutes and {seconds} seconds"
            else:
                formatted_time = f"{hours} hours, {minutes} minutes and {seconds} seconds"
        else:
            formatted_time = f"{minutes} minutes and {seconds} seconds"

    #achievements = "<span><i class='fa-solid fa-trophy'></i></span>"
    return render(request, "multiplix/profile.html", {
        "username": user.username,
        "relative_user": relative_user,
        "best_overall": profile.best_overall, 
        "best_30": profile.best_30, 
        "best_60": profile.best_60, 
        "best_120": profile.best_120, 
        "best_180": profile.best_180, 
        "total_time": formatted_time, 
        "tests_taken": profile.tests_taken,
        "date_created": profile.created,
        "is_user": is_user,
    })

def profile_info(request, username):
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return JsonResponse({
            "message": f"User does not exist!",
        }, status=200)

    try: 
        profile = Profile.objects.get(user=user)
    except Profile.DoesNotExist:
        return JsonResponse({
            "message": f"Profile does not exist!",
        }, status=200)
    
    return JsonResponse({
            "level": profile.level,
            "place_overall": profile.place_overall,
            "place_30": profile.place_30, 
            "place_60": profile.place_60,
            "place_120": profile.place_120,
            "place_180": profile.place_180,
        }, status=200)

def info(request):
    return render(request, "multiplix/info.html", {
    })

def faq(request):
    return render(request, "multiplix/faq.html")

def leaderboard(request):
    return render(request, "multiplix/leaderboard.html", {
    })

def get_leaderboard(request, name, page):
    #even though we don't use leaderboard, we check if it exists
    try:
        leaderboard = Leaderboard.objects.get(name=name)
    except Leaderboard.DoesNotExist:
        return JsonResponse({
            "message": f"Leaderboard does not exist!",
        }, status=200)
    
    values = order_leaderboard(name, "get")

    p=Paginator(values, 5)
    current_page = p.page(page)

    next = prev = fwd = bwd = False
    if current_page.has_next():
        next = current_page.next_page_number()
        if page < p.num_pages - 1:
            fwd = page+2

    if current_page.has_previous():
        prev = current_page.previous_page_number()
        if page > 2:
            bwd = page-2

    return JsonResponse({
            "leaderboard": current_page.object_list,
            "page_info": {
                'next': next,
                'prev': prev,
                'fwd': fwd,
                'bwd': bwd,
                },
            "display_name": leaderboard.display_name,
        }, status=200)

@csrf_protect
def test(request, id):  
    #finish test
    if request.method == 'PUT':
        test = Test.objects.get(id=id)
        data = json.loads(request.body)
        profile = Profile.objects.get(user=test.user)

        message = []

        #check profile
        if data["qpm"] > profile.best_overall:
            profile.best_overall = data["qpm"]
            message.append("You set a new personal record for <span class='personal-message'>Overall QPM</span>.")
        if test.time == 30:
            if data["qpm"] > profile.best_30:
                profile.best_30 = data["qpm"]
                message.append("You set a new personal record for <span class='personal-message'>QPM on 30s</span>.")
        if test.time == 60:
            if data["qpm"] > profile.best_60:
                profile.best_60 = data["qpm"]
                message.append("You set a new personal record for <span class='personal-message'>QPM on 60s</span>.")
        if test.time == 120:
            if data["qpm"] > profile.best_120:
                profile.best_120 = data["qpm"]
                message.append("You set a new personal record for <span class='personal-message'>QPM on 120s</span>.")
        if test.time == 180:
            if data["qpm"] > profile.best_180:
                profile.best_180 = data["qpm"]
                message.append("You set a new personal record for <span class='personal-message'>QPM on 180s</span>.")
        
        profile.total_time = profile.total_time + int(data["time"])
        profile.tests_taken += 1
        profile.save()

        if profile.total_time > 600 and profile.level != 1:
            profile.level = 1
            profile.save()
        if profile.total_time > 3600 and profile.level != 2:
            profile.level = 2
            profile.save()
        if profile.total_time > 86400 and profile.level != 3:
            profile.level = 3
            profile.save()

        test.qpm = data["qpm"]
        test.save()

        placed = update_leaderboards(id)
        if len(placed) > 0:
            for i in placed:
                message.append(f"You placed on the <span class='leaderboard-message'>{i} leaderboard</span>.")
            
        else: 
            test.delete()
            #if the test isn't in a leaderboard, it doesn't need to exist

        return JsonResponse({
            "message": message
        }, status=200)

@csrf_protect
def create_test(request):
    #deletes all userless tests
    Test.objects.filter(user=None).delete()

    if request.user.is_authenticated:
        #delete all unfinished tests
        user_tests = Test.objects.filter(user=request.user)
        for x in user_tests:
            if x.qpm == 0:
                x.delete()

    if request.method == 'POST':
        #create test, return testid
        data = json.loads(request.body)

        if request.user.is_authenticated:
            current_user = request.user
        else:
            current_user = None
        
        test = Test(user=current_user, time=data["time"], add=data["add"], mult=data["mult"], default=data["is_default"])
        test.save()
        return JsonResponse({
            "test_id": test.id,
            "logged_in": request.user.is_authenticated,
        }, status=200)

def update_leaderboards(test_id):
    try:
        all_leaderboards = Leaderboard.objects.all()
    except Leaderboard.DoesNotExist:
        return JsonResponse({
                "message": "Leaderboards do not exist"
            }, status=200)
    try:
        test = Test.objects.get(id=test_id)
    except Test.DoesNotExist:
        return JsonResponse({
                "message": "Test does not exist"
            }, status=200)
    
    placed = []
    
    for leaderboard in all_leaderboards:
        if test.qpm > 0:
            print(test.qpm)
            #it is important to call "overall" first, as it is either overall or a number, and int() only works on the number strings.
            if leaderboard.name=="overall" or int(leaderboard.name) == test.time:
                if leaderboard.tests.count() < leaderboard.length:
                    leaderboard.tests.add(test)
                    leaderboard.save()
                    placed.append(leaderboard.display_name)
                    update_user_leaderboard_status(test.user.username, leaderboard.name)
                    #print(f"{leaderboard.name} is now at {leaderboard.tests.count()}")
                elif test.qpm > leaderboard.min_value:
                    replace_leaderboard(leaderboard.name, test_id)
                    placed.append(leaderboard.display_name)
                    update_user_leaderboard_status(test.user.username, leaderboard.name)
    return placed

def replace_leaderboard(name, test_id):
    leaderboard = Leaderboard.objects.get(name=name)
    test = Test.objects.get(id=test_id)

    #get minimum test
    #We need to filter because there can be multiple tests with the same qpm. If this function is called there will ALWAYS be at least one test that satisfies the following condition
    minimum_test = leaderboard.tests.filter(qpm=leaderboard.min_value)[0]
    minimum_user = minimum_test.user.username
    leaderboard.tests.remove(minimum_test)
    leaderboard.tests.add(test)
    minimum_test.delete()

    leaderboard.save()
    #print(f"{minimum_test} was removed and replaced with {test}")

    update_user_leaderboard_status(minimum_user, leaderboard.display_name)
    #order_leaderboard with "replace" defines a leaderboard's new minimum
    order_leaderboard(name, "replace")

#take a leaderboard object, and turn it into an array and order it by qpm, descending
def order_leaderboard(name, method):
    test_array = []
    leaderboard = Leaderboard.objects.get(name=name)

    #populate array
    for test in leaderboard.tests.all():
        test_array.append({ "name" : test.user.username, "qpm" : test.qpm, "place": 0, "level" : Profile.objects.get(user = test.user).level,})

    sorted_array = sorted(test_array, key=lambda d: d['qpm'], reverse=True)
    #print(sorted_array[leaderboard.tests.count()-1]["qpm"])

    for x in range(leaderboard.tests.count()):
        sorted_array[x]["place"] = x+1

    if method == "replace":
        #resets minimum value
        leaderboard.min_value = sorted_array[leaderboard.tests.count()-1]["qpm"]
        #print(f"Min is now {leaderboard.min_value}")
        leaderboard.save()
    elif method == "get":
        return(sorted_array)
    
def update_user_leaderboard_status(username, leaderboard_name):
    try:
        user = User.objects.get(username = username)
    except User.DoesNotExist:
        return JsonResponse({
            "message": "User does not exist"
        }, status=200)
    try:
        profile = Profile.objects.get(user = user)
    except Profile.DoesNotExist:
        return JsonResponse({
                "message": "Profile does not exist"
            }, status=200)
    try:
        leaderboard = Leaderboard.objects.get(name=leaderboard_name)
    except Profile.DoesNotExist:
        return JsonResponse({
                "message": "Profile does not exist"
            }, status=200)
    if leaderboard.tests.filter(user=user).count()>0:
        if leaderboard_name == 'overall':
            profile.place_overall = True
        if leaderboard_name == '30':
            profile.place_30 = True
        if leaderboard_name == '60':
            profile.place_60 = True
        if leaderboard_name == '120':
            profile.place_120 = True
        if leaderboard_name == '180':
            profile.place_180 = True
        profile.save()


