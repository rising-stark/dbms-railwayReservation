from flask import Flask, render_template, request
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker

engine = create_engine("postgresql://postgres:1234@localhost:5432/temp")
db = scoped_session(sessionmaker(bind=engine))

app = Flask(__name__)

app.secret_key = '12345678' ''' this key is used to communicate with database.'''
#Configure session to use filesystem
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"

@app.route("/")
@app.route("/addbook")
def addbook():
	return render_template("admin_login.html")

@app.route("/AJAXValidation", methods=["GET", "POST"])
def AJAXValidation():
	if request.method == "POST":
		clicked = request.json['a']
		if(clicked == 'emailVerificationInitiated'):
			return "1"
		else:
			return "0"
	return "null"

if __name__ == '__main__':
	app.run(debug=True)