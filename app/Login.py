from flask import Flask, render_template, url_for, request, redirect
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker

app = Flask(__name__)

engine = create_engine("postgresql://postgres:12345@localhost:5432/test1")
db = scoped_session(sessionmaker(bind=engine))


app.secret_key = 'aaed92bfdd1f28a5671fedf04cd61079'

app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"

@app.route("/")
def Home():    
	return render_template("login.html")

@app.route("/login", methods=['GET', 'POST'])
def login():
	uname=request.form.get("uname")
	password=request.form.get("password")

	resultproxy = db.execute("SELECT * FROM Admin WHERE uname = (:uname)&& password=(:password)",{"uname": uname, "password": password})

	d, a = {}, []
	for rowproxy in resultproxy:
		for column, value in rowproxy.items():
			d = {**d, **{column: value}}
		a.append(d)

	if len(str(d))!=2:
		return redirect(url_for('login'))
	else:
		resultproxy1 = db.execute("SELECT * FROM booking_agent WHERE uname = (:uname)&& password=(:password)",{"uname": uname, "password": password})
		x, y = {}, []
		for rowproxy in resultproxy1:
			for column, value in rowproxy.items():
				x = {**x, **{column: value}}
			y.append(x)

		if len(str(x))!=2:
			return redirect(url_for('login'))
		else:
			return "Username doen't exist"
		
	return render_template("admin_login.html", form=login_form)


if __name__=='__main__':
	app.run(debug=True)