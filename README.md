# MultipliX @ [multiplix.net](https://www.multiplix.net/)
MultipliX is a website that allows users to customize mental math tests and compete with others. This takes inspiration from the website MonkeyType, which allows users to customize their experience and their touch-typing tests Websites that allow you to test mental math ability tend to be simpler and not as advanced as touch-typing sites typically are.

MultipliX uses Django with a PostgreSQL database on the backend. The frontend uses Bootstrap and vanilla JavaScript for user responsiveness and single-page views. 

MultipliX is hosted on an AWS EC2 instance using Gunicorn and Nginx, following this [tutorial](https://www.digitalocean.com/community/tutorials/how-to-set-up-django-with-postgres-nginx-and-gunicorn-on-ubuntu#django-is-displaying-could-not-connect-to-server-connection-refused). Https functionality is implented with [Certbot](https://certbot.eff.org/). 

# Table of contents
- [Features](#features)
- [Next Updates](#next-updates)
- [How To Use](#how-to-use)
- [Functionality](#functionality)

# Features
## Customizable Tests
## User Responsiveness
## User Competition
## Login/Register Validation

# Next Updates
- Responsive spacing on leaderboard titles
- Allowing "_" and "-" in username registering

# How To Use
## How to use locally
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

Then, your local repository is ready to make changes to MultipliX. 

## How to apply changes to production
Ssh into ec2 instance with keypair and cd into `/home/ubuntu/multiplix`

Pull changes from repo...
```
$ git pull
```

Start the virtual environment...
```
$ source env/bin/activate
```

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

# Functionality
