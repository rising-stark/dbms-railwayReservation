from flask import Flask, render_template, url_for, request, redirect, flash, jsonify
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker

app = Flask(__name__)

engine = create_engine("postgresql://postgres:1234@localhost:5432/railway")
db = scoped_session(sessionmaker(bind=engine))

app.secret_key = 'aaed92bfdd1f28a5671fedf04cd61079'

app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"

@app.route("/")
def addbook():
	return render_template("booking_agent_register.html")

@app.route("/register", methods=["GET","POST"])
def register():
	if request.method == "POST":

		req = request.json
		print(req)
		uname = req["uname"]
		password = req["password"]
		fname = req["fname"]
		lname = req["lname"]
		email = req["email"]
		phone = req["phone"]
		address = req["address"]
		gender = req["gender"]
		creditcard = req["credit"]
		dob = req["dob"]

		resultproxy = db.execute("SELECT * FROM booking_agent WHERE uname = (:uname) or email=(:email) or phone=(:phone) or creditcard=(:creditcard)",{"uname": uname,"email": email,"phone": phone, "creditcard": creditcard})

		d, a = {}, []
		for rowproxy in resultproxy:
			for column, value in rowproxy.items():
				d = {**d, **{column: value}}
			a.append(d)

		if len(str(d))!=2:
			return "0"
		else:
			db.execute("INSERT INTO booking_agent (uname, password,fname,lname,email,phone,address,gender,creditcard,dob) VALUES (:uname, :password,:fname,:lname,:email,:phone,:address,:gender,:creditcard,:dob)",
			{"uname": uname, "password": password, "fname":fname,"lname":lname, "email":email,"phone":phone,"address":address, "gender":gender, "creditcard":creditcard, "dob":dob})
			db.commit()
			return "1"

	return "NULL"

# @app.route("/login", methods=['GET', 'POST'])
# def login():
#     uname=request.form.get("uname")
#     password=request.form.get("password")

#     resultproxy = db.execute("SELECT * FROM Admin WHERE uname = (:uname)",{"uname": uname})

#     d, a = {}, []
#     for rowproxy in resultproxy:
#         for column, value in rowproxy.items():
#             d = {**d, **{column: value}}
#         a.append(d)

#     if len(str(d))!=2:
#         return redirect(url_for('login'))
#     else:
#         resultproxy1 = db.execute("SELECT * FROM booking_agent WHERE uname = (:uname)",{"uname": uname})

#         x, y = {}, []
#         for rowproxy in resultproxy1:
#         for column, value in rowproxy.items():
#             x = {**x, **{column: value}}
#         y.append(y)

#         if len(str(x))!=2:
#             return redirect(url_for('login'))

#         else:
#             return "Username doen't exist"
		
#     return render_template("admin_login.html", form=login_form)

if __name__=='__main__':
	app.run(debug=True)