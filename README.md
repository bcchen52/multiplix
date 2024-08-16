# MultipliX @ [multiplix.net](https://www.multiplix.net/)
MultipliX is a website that allows users to customize mental math tests and compete with others. This takes inspiration from the website MonkeyType, which allows users to customize their experience and their touch-typing tests Websites that allow you to test mental math ability tend to be simpler and not as advanced as touch-typing sites tend to me.

# Table of contents
## - [Features](#features)
- [Requirements](#requirements)
- [How To Use](#how-to-use)
- [Functionality](#functionality)

# About MultipliX
MultipliX uses Django with a PostgreSQL database on the backend. The frontend uses Bootstrap and vanilla JavaScript for user responsiveness and single-page views. 

MultipliX is hosted on an AWS EC2 instance using Gunicorn and Nginx, following this [tutorial](https://www.digitalocean.com/community/tutorials/how-to-set-up-django-with-postgres-nginx-and-gunicorn-on-ubuntu#django-is-displaying-could-not-connect-to-server-connection-refused). Https functionality is implented with [Certbot](https://certbot.eff.org/). 

# Next updates
- Responsive spacing on leaderboard titles
- Allowing "_" and "-" in username registering

# How to use locally
To create a local version of MultipliX to edit, we need default to revert our Django settings for production.

In `project5/settings.py`

```
DEBUG = True
...

ALLOWED_HOSTS = [..., '127.0.0.1']

SECRET_KEY = #secret key here
...

import os
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}
```

Run 
```
python manage.py makemigrations multiplix

python manage.py migrate 
```

# How to apply changes to production
Ssh into ec2 instance with keypair and cd into `/home/ubuntu/multiplix`

Pull changes from repo
```
$ git pull
```

Start the virtual environment
```
$ source env/bin/activate
```

If necessary, makemigrations and migrate
```
(env)$ ~/multiplix/manage.py makemigrations multiplix
(env)$ ~/multiplix/manage.py migrate
```

Collect static files
```
(env)$ ~/multiplix/manage.py collectstatic
```

Move static files to `/var/www/`

Run 
```
$ sudo systemctl restart gunicorn
```
for changes to the Django application.

Run 
```
$ sudo systemctl restart nginx
```
for changes to static files.

# Distinctiveness and Complexity
## Frontend
There are five HTML templates, index(for test settings, test, and result), leaderboard(to display all leaderboards), login, profile, and info.

All pages have a responsive footer. If the window is large enough, the footer will automatically be placed under the display window, so it will not be visible unless the user scrolls. If the window is too small, then the footer will stay under the content. When the window is expanded, the footer sticks to the bottom and will return back to where it was first loaded in based on the window size. If content is collapsed and the length of the content changes, the footer changes it's set position. 

### `index.html` and `multiplix.js`
The index page uses JavaScript to load the setting, start, and result "pages". 

The settings page is loaded by default with the default options selected, and allows users to toggle which operations they want to use(users can only toggle addition and multiplication, but subtraction and division are included with each, respectively), the correlating range of values they want to use with those operations, and the time of the test. Users are prevented from entering invalid input with JavaScript limiting the length of input on the number fields depending on the operation(max length 4 for addition and 3 for multiplication), and JavaScript prevents both addition and multiplication from being toggled off at the same time. 

When the user presses the "Enter" key or the button on the screen, the test begins, a counter starts, and an input field with autofocus shows up. The counter feature is implemented by adding a count element and a count increment into the state of a function. Using JavaScript, a random equation is generating depending on the settings the user specified. When the correct answer is typed, the question refreshes and the score updates. If a user presses the "Escape" key or the corresponding button, the test will end and the settings page will be displayed again, where they can start another test. 

After the counter runs out and the test is finished, the results page is displayed. The results page displays the user's raw score, QPM based on the time of the test, and information about the user's average time to answer questions of different operations if applicable. If the user's QPM is a personal best, either overall, or for a specific category of test(based on time, 30s, 60s, 120s, 180s), or if the user's score earned them a place on one of the leaderboards(also based on time and overall), a message will be displayed. From the results page, the user can click "Enter" to begin another test with the same settings they just played with.

### `leaderboard.html` and `leaderboard.js`
The leaderboard page displays one of five leaderboards(overall QPM, QPM on 30s, 60s, 120s, 180s). The leaderboard page incorporates Django's pagination feature. By default, the leaderboard page returns page 1 of the overall leaderboard, and users can visit any leaderboard from any page of another leaderboard. 

The leaderboard page also features animation of the page buttons and of leaderboard entries that is responsive. When a page button to the right is clicked, the page buttons update and load in from the right. When a page button to the left is clicked, the buttons load in from the left. Similarly, when clicking on a page to the right, a next page, the leaderboard entries are animated from the right, and when clicking on a page to the left, a previous page, the entries are animated from the left. These animations incorporate promises so that each individual item can be loaded after the previous one, creating a visual cascading effect. When leaderboards are first loaded(from another leaderboard and not from a different page of the same leaderboard), the entries do not load in from either side but load straight down. Thus, when returning to page 1 after browsing a leaderboard, the leaderboard entries will still load from the left. Users can also click on leaderboard entries to be redirected to that user's profile.

### `login.html` and `login.js`
The login page uses Bootstrap validation and Javascript to provide responsive feedback. The login page has both the register and login forms. By default, both buttons are disabled. 

For the login form, once both inputs are not empty, the button will undisable. 

For the register form, the username field has to be non empty, the email field has to include '@', the password must be at least 8 characters, and the confirm password field must must a valid password. All of this must be accomplished, and is indicated by Bootstrap's valid form, before the register button can be clicked. Using JavaScript, an appropriate message will display, and the message is changed whenever a different input is selected and focused. For example, when typing in the username field, the max length is 16, and a message displaying how many characters the user has left is displayed and updated with every key click. 

### `profile.html` and `prof.js`
The profile page will show differently depending on whether it is the user's profile. The profile page displays personal bests, total time played, total tests taken, and the date joined. 

The JavaScript file only works to select the navbar link and set it to active.

### `info.html` and `info.js`
The info page is basic information, JavaScript file serves same purpose as profile's. 

## Backend
`models.py` and `views.py`.

### `Test()`
A Test object is created everytime a user starts a test , including information about the duration of test, the test settings/options, and whether the test has default settings. When this is called, all Test objects without a user associated are deleted. Once a test is finished and the user is logged in, a "PUT" request is made, providing information about a user's QPM, questions per minute, which is how scores are measured. This data is then used to update a user's personal bests and update the leaderboards(if applicable).

### `Leaderboard()`
Five Leaderboard objects are created (overall, 30s, 60s, 120s, 180s) at the beginning of the views.py file if they do not already exist. Leaderboard has a ManyToMany relationship with Test. Whenever a test is finished, if the test falls into the leaderboard category and the leaderboard is not at its maximum length, it will automatically add test. If the leaderboard is full, it will compare it to the minimum value, and if the test's QPM is greater, `replace_leaderboard` is called. This finds the test that the minimum value belonged to, removes that test, deletes the test, and adds the next test. Then, `order_leaderboard(..., "replace")` is called, which turns the QuerySet of Test objects into an array of dictionaries, which is then reverse indexed into descending order based on QPM, and since "replace" was passed as a parameter, the minimum value of the leaderboard will be updated based on this ordering. This is the same method that returns an ordered array to display leaderboards.

### `Profile()`
Profile objects are created whenever a User is created. Profile is updated whenever a user finishes a test.

## How to Run
