# MultipliX @ [multiplix.net](https://multiplix.net)
MultipliX is a website that allows users to customize mental math tests and compete with others. This takes inspiration from the website MonkeyType, which allows users to customize their experience and their touch-typing tests Websites that allow you to test mental math ability tend to be simpler and not as advanced as touch-typing sites typically are.

MultipliX uses Django with a PostgreSQL database on the backend. The frontend uses Bootstrap and vanilla JavaScript for user responsiveness and single-page views. 

MultipliX is hosted on an AWS EC2 instance using Gunicorn and Nginx, following this [tutorial](https://www.digitalocean.com/community/tutorials/how-to-set-up-django-with-postgres-nginx-and-gunicorn-on-ubuntu#django-is-displaying-could-not-connect-to-server-connection-refused). Https functionality is implented with [Certbot](https://certbot.eff.org/). 

# Table of contents
- [Features](#features)
- [Next Updates](#next-updates)
- [How To Use](#how-to-use)
- [Functionality](#functionality)

# Features
### Customizable Tests

Users can customize their tests by selecting the duration and selecting addition/subtraction, multiplication/division, or both. Users can also choose the ranges of the numbers used in the questions given to them, with addition/subtraction going up to 9999 and multiplication/division up to 999. 

### User Responsiveness

The leaderboards' page buttons automatically adjust for the page they are on.

Questions, titles, and usernames on profile pages are automatically resized to fit onto the screen. 

The footer will always load outside of the current screen, so it is only visible after scrolling, despite the size of the original screen. 

### Performance Measuring

Response times during a test is measured with Performance API, measuring the time from when a correct answer is detected to after a new question is generated and waiting for two animation-frame ticks with `requestAnimationFrame()` to ensure that the new question is visible. Average time ~10ms, up to 2ms. 

End-to-end latency of a results page is measured also with Performance API, from the time a test ends to after the client receives HTTP response, following the same visibility logic. The time the backend spent is also measured with Python's `time.perf_counter()`. Average end-to-end latency ~70ms, server processing ~50ms.

### User Competition

Tests taken on the default settings from a logged in user are automatically qualified to enter onto the respective leaderboards and will the results will be reflected on that user's profile page for the best scores, if applicable. If a user is currently on a leaderboard, a trophy will show up on their profile page, up to five for the five leaderboards. 

Users are granted status icons for how much time they've spent playing MultipliX, with level 1 at 10 minutes, level 2 at 1 hour, and level 3 at 1 day. 

### Login/Register Validation

To provide a seamless experience when registering, invalid inputs are removed upon entering with JavaScript. Thus, users cannot have any white space in any registration field, any non alphanumeric characters in the username field, and any nonalphanumeric characters except for "@" and "." in the email field.

# Next Updates
- Responsive spacing on leaderboard titles
- Allowing "_" and "-" in username registering

# How To Use
### How to run locally
To create a local version of MultipliX to edit, we need default to revert our Django settings for production.

Clone the repository...
```
$ git clone git@github.com:bcchen52/multiplix.git
```

Create and start a virutal environment in the `multiplix` directory...
```
$ source env/bin/activate
```

Download `pip` and `python` in your virtual environment.

Run...
```
$ pip install -r requirements.txt
```

In `project5/settings.py`

```
DEBUG = True
...

ALLOWED_HOSTS = [..., '127.0.0.1']

SECRET_KEY = #put anything
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

Then, your local repository is ready to run MultipliX with `python manage.py runserver`. 

### How to apply changes to production
Ssh into ec2 instance with keypair and cd into `/home/ubuntu/multiplix`

Pull changes from repo...
```
$ git pull
```

Start the virtual environment...
```
$ source env/bin/activate
```

Set up Postgresql and grant access and change ownership of schema.

If necessary, makemigrations and migrate...
```
(env)$ ~/multiplix/manage.py makemigrations multiplix
(env)$ ~/multiplix/manage.py migrate
```

Collect static files...
```
(env)$ ~/multiplix/manage.py collectstatic
```

Move static files to `/var/www/`.

Run ...
```
$ sudo systemctl restart gunicorn
```
for changes to the Django application.

Run ...
```
$ sudo systemctl restart nginx
```
for changes to static files.