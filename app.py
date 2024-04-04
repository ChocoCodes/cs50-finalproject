import os
import validators as vd

from cs50 import SQL
from flask import Flask, flash, redirect, render_template, request, session
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash
from dotenv import load_dotenv

# Configure app
app = Flask(__name__)
# Load secret key from .env and configure secret key to use Sessions
load_dotenv()
app.secret_key = os.getenv('SECRET_KEY')
# Configure session to use filesystem (instead of signed cookies) - we will be handling massive amounts of data
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Configure CS50 library to use database
db = SQL("sqlite:///finnaorganize.db")

# Adapted from CS50x Finance: https://cs50.harvard.edu/x/2024/psets/9/finance
# Ensure that the data is always updated when the app is running
@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


@app.route("/")
@vd.login_required
def dashboard():
    """ Handle Dashboard Information """

@app.route("/register")
def register():
    """ Add more user/s """

@app.route("/login", methods=["GET", "POST"])
def login():
    """ Log user/s in to the app """

@app.route("/logout")
def logout():
    """ Log user/s out from the app """
