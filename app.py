import os
import validators as vd

from cs50 import SQL
from flask import Flask, flash, redirect, render_template, request, session
from flask_session import Session
from dotenv import load_dotenv

# Configure app
app = Flask(__name__)

# Custom Filter for Numeric Values
app.jinja_env.filters["php"] = vd.formatToPHP
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
    return render_template("index.html")

@app.route("/register", methods=["GET", "POST"])
def register():
    """ Add more user/s """
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        confirmedPassword = request.form.get("confirm")

        userDB = db.execute("SELECT * FROM users WHERE username = ?", username)
        if len(userDB) != 0:
            return vd.apology("Username already exists.")
        if not username or not password or not confirmedPassword:
            return vd.apology("Input Field/s are empty.")
        if not password == confirmedPassword:
            return vd.apology("Passwords does not match with each other!")
        if not vd.validatePasswordStructure(password):
            return vd.apology("Password should contain at least: 1 symbol, 1 number and length of 8 or more.")
        
        passwordSalt = vd.generatePasswordSalt()
        convertedSalt = passwordSalt.hex() # Convert the salt from a byte object to a string for database storage
        hashedPassword = vd.generateHash(password, convertedSalt)

        db.execute("INSERT INTO users(username, hash, salt) VALUES(?, ?, ?)", username, hashedPassword, convertedSalt)

        id = db.execute("SELECT * FROM users WHERE username = ?", username)
        session["user_id"] = id[0]["id"]
        return redirect("/")
    else:
        return render_template("register.html")

@app.route("/login", methods=["GET", "POST"])
def login():
    """ Log user/s in to the app """
    session.clear()
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")

        if not username or not password:
            return vd.apology("Input field/s are empty.")
        
        rowUserData = db.execute(
            "SELECT * FROM users WHERE username = ?", username
        )
        
        if len(rowUserData) != 1 or not vd.validatePassword(password, rowUserData[0]["salt"], rowUserData[0]["hash"]):
            return vd.apology("Invalid Username/Password!")
        
        session["user_id"] = rowUserData[0]["id"]
        return redirect("/")
    else:
        return render_template("login.html")

@app.route("/logout")
def logout():
    """ Log user/s out from the app """
    # Forget any user_id and redirect to login form
    session.clear()
    return redirect("/")


if __name__ == "__main__":
    app.run()