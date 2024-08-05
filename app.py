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
        for t in transactionHistory:
            transacTypeNum = t['transaction_type']
            t['category'] = vd.toCategory(transacTypeNum, entryCategory)
    
    return render_template("index.html", userSavings=savings, userSpendings=spendings, userAllowance=allowance, userTransactions=transactionHistory)

@app.route("/profile")
@vd.login_required
def profile():
    counts = db.execute(
        "SELECT COUNT(*) FROM goal_counts WHERE user_id = ?",
        (session['user_id'],)
    )
    user = getLoginInfo(session['user_id'], True)
    # TODO: Get goal tables
    return render_template("profile.html", userName=user[0]['username'], goalCounts=counts[0]['COUNT(*)'])


@app.route("/submit", methods=['POST'])
@vd.login_required
def getFormInput():
    """ Process dashboard form submission/s """
    request_userEntry = request.get_json()
    rq_converted = vd.toDict(request_userEntry)
    rq_datetime = vd.getCurrTime()
    rq_btnId, rq_amount = 0, 0.0
    for id, amt in rq_converted.items():
        rq_btnId = int(id)
        rq_amount = float(amt)
    print(f"Button ID: {rq_btnId}, Amount: {rq_amount}, Time: {rq_datetime}")
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
    print(f"ID: {latest_transaction[0]['id']}, Date: {latest_transaction[0]['transaction_date']}, Type: {latest_transaction[0]['transaction_type']}, Amount: {latest_transaction[0]['amt']}")
    print(f"Savings: {updated_finances[0]['savings']}, Spendings: {updated_finances[0]['spendings']}, Allowance: {updated_finances[0]['allowance']}")
    # Merge data into a single JSON-like format and send to JS
    merged_data = vd.mergeEntries(latest_transaction, updated_finances)
    print(f"transaction_id: {merged_data['transaction_id']}, amt: {merged_data['amt']}, type: {merged_data['type']}, date: {merged_data['date']}, u_savings: {merged_data['u_savings']}, u_spendings: {merged_data['u_spendings']}, u_allowance: {merged_data['u_allowance']}")
    return jsonify(merged_data), 200


@app.route("/delete", methods=['POST'])
@vd.login_required
def deleteUserData():
    """ Delete all user data from all tables in the DB """
    delete_request = request.get_json()
    print(f"Received: {delete_request}")
    username = delete_request['username']
    print(f"Username: {username}")
    # db.execute(
    #     "DELETE FROM finances WHERE user_id = ?", 
    #     (session['user_id'],)
    # )
    # db.execute(
    #     "DELETE FROM transactions WHERE user_id = ?", 
    #     (session['user_id'],)
    # )
    # db.execute(
    #     "DELETE FROM users WHERE username = ?", 
    #     (username,)
    # )
    return jsonify({'result': 'success'}), 200

@app.route('/change', methods=['POST'])
@vd.login_required
def editUserPassword():
    newPass = request.get_json()['new_password']
    print(f'New: {newPass}')
    newSalt = vd.generatePasswordSalt()
    conv_newSalt = newSalt.hex()
    newHash = vd.generateHash(newPass, conv_newSalt)
    print(f'New Salt: {newSalt}, Converted: {conv_newSalt}, New Hash: {newHash}')
    # TODO: c. Add to db
    #db.execute(
    #    "UPDATE users SET hash = ?, salt = ? WHERE id = ?", newHash, conv_newSalt, session['user_id']
    #)
    return jsonify({'result': 'success'}), 200

@app.route('/create_new', methods=['POST'])
@vd.login_required
def createGoal():
    print('test')
    goalInfo = request.get_json()
    print(f'Goal Info: {goalInfo}')
    return jsonify({'result': 'success'}), 200

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