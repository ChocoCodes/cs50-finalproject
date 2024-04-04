from flask import redirect, session
from functools import wraps


# Adapted from CS50x Finance: https://cs50.harvard.edu/x/2024/psets/9/finance/ 
def login_required(f):
    """
    Decorate routes to require login.

    https://flask.palletsprojects.com/en/latest/patterns/viewdecorators/
    """

    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get("user_id") is None:
            return redirect("/login")
        return f(*args, **kwargs)

    return decorated_function

# Function to check if form data in a valid integer
def isInt(input):
    try:
        int(input)
        return True
    except ValueError:
        return False

# Function to check if the password follows the requirements
def validatePassword(input):
    specialCharacters = ['+', '-', '#', '!', '?', '_', '@', '%', '&', '*']
    symbolCtr = 0
    numCtr = 0
    frozenset(specialCharacters)
    for i in input:
        if i in specialCharacters:
            symbolCtr = symbolCtr + 1
        if i.isdigit():
            numCtr = numCtr + 1
    if symbolCtr == 0 and numCtr == 0 or len(input) < 8:
        return False
    else:
        return True