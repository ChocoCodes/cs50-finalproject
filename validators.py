import os
import hashlib as hash
from flask import redirect, session, render_template
from functools import wraps
from datetime import datetime

"""
#### ACKNOWLEDGEMENT ####
Functions listed below were adapted from CS50x Finance: https://cs50.harvard.edu/x/2024/psets/9/finance/.
login_required(), apology(), formatToPHP() from [usd()].
"""

def login_required(f):
    """ Decorate routes to require login. https://flask.palletsprojects.com/en/latest/patterns/viewdecorators/ """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get("user_id") is None:
            return redirect("/login")
        return f(*args, **kwargs)
    return decorated_function

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

def isInt(input):
    """ Check if an amount or any required numeric data is a valid integer """
    try:
        int(input)
        return True
    except ValueError:
        return False

def toDict(json_data):
    """ Convert request from a list of dictionaries to a single dictionary """
    return {d['btnId']:d['amount'] for d in json_data}

def toCategory(nTransacType, lookupDict):
    """ Convert numeric transaction type to its equivalent transaction category """
    equivCat = dict(zip(lookupDict['buttonID'], lookupDict['type']))
    return equivCat.get(nTransacType)

def getCurrTime():
    """ Get current time """
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")

def validatePasswordStructure(input):
    """ Check if the password follows the requirements """
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

def generatePasswordSalt():
    """ Generate a random salt """
    return os.urandom(16)

def generateHash(password, salt):
    """ Convert password and salt from string to bytes, and generate a hash """
    saltedPass = (salt + password).encode()
    hashedPass = hash.sha256(saltedPass).hexdigest()
    return hashedPass

def validatePassword(inputPass, dbSalt, dbPass):
    """ Check if password input matches the hashed password in the database """
    hashedInputPass = generateHash(inputPass, dbSalt)
    return hashedInputPass == dbPass

def formatToPHP(amount):
    """Format numeric data such as amounts in Philippine Peso [₱] """
    return f"₱{amount:,.2f}"