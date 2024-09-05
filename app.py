import os
import validators as vd

from cs50 import SQL
from flask import Flask, flash, redirect, render_template, url_for, request, session, jsonify
from flask_session import Session
from dotenv import load_dotenv

# Configure app
app = Flask(__name__)

# Custom Filter for Numeric Values
app.jinja_env.filters["php"] = vd.formatToPHP

# Load secret key from .env and configure secret key to use Sessions
load_dotenv()
app.secret_key = os.getenv('SECRET_KEY')

# Configure session to use filesystem (instead of signed cookies) - we will be possibly handling massive amounts of data
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Configure CS50 library to use database
db = SQL(os.getenv('DB_URL'))

entryCategory = {
    'buttonID': [1, 2, 3],
    'type': ['Savings', 'Spendings','Allowance']
}
QUERY_DELIMITER = ', '
# Adapted from CS50x Finance: https://cs50.harvard.edu/x/2024/psets/9/finance
# Ensure that the data is always updated when the app is running
@app.after_request
def after_request(response):
    """ Ensure responses aren't cached """
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


@app.route("/")
@vd.login_required
def dashboard():
    """ Handle user finances and transactions when logged in """
    savings, spendings, allowance = 0.0, 0.0, 0.0

    userFinancesData = getUserFinances()
    if userFinancesData:
        savings = userFinancesData[0]['savings']
        spendings = userFinancesData[0]['spendings']
        allowance = userFinancesData[0]['allowance']

    transactionHistory = db.execute(
        "SELECT * FROM transactions WHERE user_id = ?", 
        (session["user_id"],)
    )
    
    if transactionHistory:
        for transaction in transactionHistory:
            transacTypeNum = transaction['transaction_type']
            transaction['category'] = vd.toCategory(transacTypeNum, entryCategory)
    return render_template("index.html", userSavings=savings, userSpendings=spendings, userAllowance=allowance, userTransactions=transactionHistory)


@app.route("/profile")
@vd.login_required
def profile():
    """ Load information for profile page """
    counts = db.execute(
        "SELECT COUNT(*) FROM goal_counts WHERE user_id = ?",
        (session['user_id'],)
    )
    user = getLoginInfo(session['user_id'], True)
    goalData = getUserGoals()
    if goalData: 
        for goal in goalData: 
            goal['progress'] = vd.getPercent(goal['curr_dep'], goal['total_amt'])
    return render_template("profile.html", userName=user[0]['username'], goalCounts=counts[0]['COUNT(*)'], goals=goalData)


@app.route("/submit", methods=['POST'])
@vd.login_required
def getFormInput():
    """ Process dashboard form submission/s """
    request_userEntry = request.get_json()
    rq_datetime = vd.getCurrTime()
    rq_btnId = int(request_userEntry['btn_id'])
    rq_amount = float(request_userEntry['amt'])
    # Queries to update [Finances] table
    if rq_btnId == 1:
        updateSavings(rq_amount)
    if rq_btnId == 2:
        updateSpendings(rq_amount)
    if rq_btnId == 3:
        updateAllowance(rq_amount)
    # Query to log transactions into [Transactions] table
    db.execute(
        "INSERT INTO transactions(user_id, transaction_type, transaction_date, amt) VALUES(?, ?, ?, ?)", 
        session['user_id'], rq_btnId, rq_datetime, rq_amount
    )
    # Queries to retrieve updated entries to [Transactions] and [Finances] table
    latest_transaction = getLatestEntry()
    updated_finances = getUserFinances()
    # Merge data into a single JSON-like format and send to JS
    merged_data = vd.mergeEntries(latest_transaction, updated_finances)
    return jsonify(merged_data), 200


@app.route("/delete", methods=['POST'])
@vd.login_required
def deleteUserData():
    """ Delete all user data from all tables in the DB """
    delete_request = request.get_json()
    username = delete_request['username']
    db.execute(
        "DELETE FROM finances WHERE user_id = ?", 
        (session['user_id'],)
    )
    db.execute(
        "DELETE FROM transactions WHERE user_id = ?", 
        (session['user_id'],)
    )
    db.execute(
        "DELETE FROM users WHERE username = ?", 
        (username,)
    )
    db.execute(
        "DELETE FROM goals_info WHERE id IN (SELECT goals_info.id FROM goal_counts JOIN goals_info ON goal_counts.goal_ID = goals_info.id WHERE goal_counts.user_ID = ?)", 
        (session['user_id'],)
    )
    db.execute(
        "DELETE FROM goal_counts WHERE user_ID = ?",
        (session['user_id'],)
    )
    return jsonify({'result': 'success'}), 200


@app.route('/change', methods=['POST'])
@vd.login_required
def editUserPassword():
    """ Change user passwords """
    newPass = request.get_json()['new_password']
    newSalt = vd.generatePasswordSalt()
    conv_newSalt = newSalt.hex()
    newHash = vd.generateHash(newPass, conv_newSalt)
    db.execute(
        "UPDATE users SET hash = ?, salt = ? WHERE id = ?", 
        newHash, conv_newSalt, session['user_id']
    )
    return jsonify({'result': 'success'}), 200


@app.route('/create_new', methods=['POST'])
@vd.login_required
def createGoal():
    """ Add new user goals """
    goalInfo = request.get_json()
    curr_dep = 0.0
    goalName = goalInfo['goal_name']
    goalDesc = goalInfo['goal_desc'] 
    goalTotal = float(goalInfo['goal_amt'])
    db.execute(
        "INSERT INTO goals_info(name, desc, total_amt, curr_dep) VALUES(?, ?, ?, ?)", 
        goalName, goalDesc, goalTotal, curr_dep
    )
    latestGoalID = getGoalID()
    db.execute(
        "INSERT INTO goal_counts(user_ID, goal_ID) VALUES(?, ?)",
        session['user_id'], latestGoalID
    )
    uGoals, latestGoal = getUserGoals(), None
    if uGoals:
        for goal in uGoals:
            if goal['id'] == latestGoalID:
                latestGoal = goal
                break
        latestGoal['progress'] = vd.getPercent(latestGoal['curr_dep'], latestGoal['total_amt'])
    return jsonify(latestGoal), 200


"""
TODO: Debug - ERROR LOG 
File "/home/johnrlnddev/.local/lib/python3.10/site-packages/cs50/sql.py", line 28, in decorator
    return f(*args, **kwargs)
File "/home/johnrlnddev/.local/lib/python3.10/site-packages/cs50/sql.py", line 235, in execute
raise RuntimeError(
RuntimeError: more placeholders (?, ?) than values ('editedGoal1', 3)
"""

@app.route('/edit_goal', methods=['POST'])
def editUserGoal():
    pass

@app.route('/remove', methods=['POST'])
def removeGoal():
    """ Remove user goals from DB. """
    deleteInfo = request.get_json()
    try:
        db.execute(
            "DELETE FROM goal_counts WHERE goal_ID = ? AND user_id = ?", 
            deleteInfo['id'], session['user_id']
        )
        db.execute(
            "DELETE FROM goals_info WHERE name = ? AND id = ?", 
            deleteInfo['name'], deleteInfo['id']
        )
        return jsonify({'result': 'success'}), 200
    except Exception as e:
        return jsonify({'result' : 'error', 'message': str(e)}), 500

@app.route('/goal_data')
def sendGoals():
    """ Send user's goal data as JSON to the client """
    return jsonify(getUserGoals()), 200


def getGoalID():
    goalID = db.execute(
        "SELECT id FROM goals_info ORDER BY ROWID DESC LIMIT 1"
    )
    return goalID[0]['id'] if goalID else None


def getUserGoals():
    """ Extract user goals from the Goals_Info DB """
    goals = db.execute(
        "SELECT goals_info.* FROM goal_counts JOIN goals_info ON goal_counts.goal_ID = goals_info.id WHERE goal_counts.user_ID = ?",
        session["user_id"]
    )
    return goals


def getUserFinances():
    """ Get user's finances from Finance DB """
    financeData = db.execute(
        "SELECT * FROM finances WHERE user_id = ?", 
        (session["user_id"],)
    )
    return financeData


def getLatestEntry():
    """ Get latest transaction log from Transaction DB """
    transactionData = db.execute(
        "SELECT * FROM transactions WHERE user_id = ? ORDER BY ROWID DESC LIMIT 1",
        (session['user_id'],)
    )
    if transactionData:
        nType = transactionData[0]['transaction_type']
        transactionData[0]['transaction_type'] = vd.toCategory(nType, entryCategory)
    return transactionData


def updateSavings(amount):
    """ Update savings from Finance DB """
    db.execute(
        "UPDATE finances SET savings = savings + ? WHERE user_id = ?",
        amount, session['user_id']
    )
    db.execute(
        "UPDATE finances SET allowance = allowance - ? WHERE user_id = ?",
        amount, session['user_id']
    )
    return


def updateSpendings(amount):
    """ Update spendings from Finance DB """
    db.execute(
        "UPDATE finances SET spendings = spendings + ? WHERE user_id = ?",
        amount, session['user_id']
    )
    db.execute(
        "UPDATE finances SET allowance = allowance - ? WHERE user_id = ?",
        amount, session['user_id']
    )
    return


def updateAllowance(amount):
    """ Update allowance from Finance DB """
    db.execute(
        "UPDATE finances SET allowance = allowance + ? WHERE user_id = ?",
        amount, session['user_id']
    )
    return
    

def getLoginInfo(user, isUID):
    if not isUID:
        return db.execute(
            "SELECT * FROM users WHERE username = ?", 
            (user,)
        )
    return db.execute(
        "SELECT * FROM users WHERE id = ?", 
        (user,)    
    )


@app.route("/register", methods=["GET", "POST"])
def register():
    """ Add more user/s """
    fSavings, fSpendings, fAllowance = 0.0, 0.0, 0.0
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        confirmedPassword = request.form.get("confirm")

        userDB = getLoginInfo(username, False)
        
        if len(userDB) != 0:
            return vd.apology("Username already exists.")
        if not username or not password or not confirmedPassword:
            return vd.apology("Input Field/s are empty.")
        if not password == confirmedPassword:
            return vd.apology("Passwords does not match with each other!")
        if not vd.validatePasswordStructure(password):
            return vd.apology("Password should contain at least: 1 symbol, 1 number and length of 8 or more.")
        
        passwordSalt = vd.generatePasswordSalt()
        # Convert the salt from a byte object to a string to store in DB
        convertedSalt = passwordSalt.hex() 
        hashedPassword = vd.generateHash(password, convertedSalt)

        db.execute(
            "INSERT INTO users(username, hash, salt) VALUES(?, ?, ?)", 
            username, hashedPassword, convertedSalt
        )
        db.execute(
            "INSERT INTO finances(user_id, savings, spendings, allowance) VALUES(?, ?, ?, ?)", 
            session['user_id'], fSavings, fSpendings, fAllowance
        )

        id = getLoginInfo(username, False)

        session["user_id"] = id[0]["id"]
        return redirect("/")
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
        
        rowUserData = getLoginInfo(username, False)
        
        if len(rowUserData) != 1 or not vd.validatePassword(password, rowUserData[0]["salt"], rowUserData[0]["hash"]):
            return vd.apology("Invalid Username/Password!")
        
        session["user_id"] = rowUserData[0]["id"]
        return redirect("/")
    return render_template("login.html")


@app.route("/logout")
def logout():
    """ Log user/s out from the app """
    # Forget any user_id and redirect to login form
    session.clear()
    return redirect("/")


if __name__ == "__main__":
    app.run(debug=True,use_reloader=True)