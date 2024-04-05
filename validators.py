from flask import redirect, session, render_template
from functools import wraps


# Adapted from CS50x Finance: https://cs50.harvard.edu/x/2024/psets/9/finance/ 
def login_required(f):
    """ Decorate routes to require login. https://flask.palletsprojects.com/en/latest/patterns/viewdecorators/ """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get("user_id") is None:
            return redirect("/login")
        return f(*args, **kwargs)
    return decorated_function

# Adapted from CS50x Finance: https://cs50.harvard.edu/x/2024/psets/9/finance/ 
def apology(message, code=400):
    """Render message as an apology to user."""
    def escape(s):
        """ Escape special characters. https://github.com/jacebrowning/memegen#special-characters """
        for old, new in [
            ("-", "--"),
            (" ", "-"),
            ("_", "__"),
            ("?", "~q"),
            ("%", "~p"),
            ("#", "~h"),
            ("/", "~s"),
            ('"', "''"),
        ]:
            s = s.replace(old, new)
        return s
    return render_template("apology.html", top=code, bottom=escape(message)), code

# Function to check if form data is a valid integer
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
    return not ((symbolCtr == 0 and numCtr == 0) or len(input) < 8)