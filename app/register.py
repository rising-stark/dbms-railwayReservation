from main import *
import numpy as np

@app.route("/register", methods=["POST"])
def register():
	if request.method == "POST":

		req = request.json
		uname = req["uname"]
		password = req["password"]
		fname = req["fname"]
		lname = req["lname"]
		email = req["email"]
		phone = req["phone"]
		address = req["address"]
		gender = req["gender"]
		creditcard = req["creditcard"]
		dob = req["dob"]

		fetch = db.execute("SELECT * FROM booking_agent WHERE uname = (:uname) or email=(:email) or phone=(:phone) or creditcard=(:creditcard)",{"uname": uname,"email": email,"phone": phone, "creditcard": creditcard}).fetchall()
		ct = 0
		for _ in fetch:
			ct = 1
			break
		if (ct > 0) :
			return "0"
		else:
			db.execute("INSERT INTO booking_agent (uname, password,fname,lname,email,phone,address,gender,creditcard,dob) VALUES (:uname, :password,:fname,:lname,:email,:phone,:address,:gender,:creditcard,:dob)",
			{"uname": uname, "password": password, "fname":fname,"lname":lname, "email":email,"phone":phone,"address":address, "gender":gender, "creditcard":creditcard, "dob":dob})
			db.commit()
			return "1"
	return "NULL"