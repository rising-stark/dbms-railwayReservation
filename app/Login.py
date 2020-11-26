from main import *

@app.route("/")
@app.route("/home")
def home():
	print(session)
	session.clear()
	return render_template("login.html")

@app.route("/login", methods=['POST'])
def login():
	if request.method == "POST":

		req = request.json
		uname = req["uname"]
		password = req["pass"]

	resultproxy = db.execute("SELECT uname FROM Admin WHERE uname = (:uname) and password=(:password)",{"uname": uname, "password": password})

	d, a = {}, []
	for rowproxy in resultproxy:
		for column, value in rowproxy.items():
			d = {**d, **{column: value}}
		a.append(d)

	ct = 0
	for _ in a:
		ct += 1
		break
	if ct == 1:
		session["uname"] = uname
		return "1"
	else:
		resultproxy1 = db.execute("SELECT uname FROM booking_agent WHERE uname = (:uname) and password=(:password)",{"uname": uname, "password": password})
		x, y = {}, []
		for rowproxy in resultproxy1:
			for column, value in rowproxy.items():
				x = {**x, **{column: value}}
			y.append(x)

		ct = 0
		for _ in y:
			ct += 1
			break
		if ct == 1:
			session["uname"] = uname
			return "2"
		else:
			return "0"
		
	return "NULL"

@app.route("/admin_home", methods=['GET', 'POST'])
def admin_home():
	print(session)
	if session.get('uname') == None:
		return render_template("login.html")
	return render_template("admin_home.html")

@app.route("/booking_agent_home", methods=['GET', 'POST'])
def booking_agent_home():
	print(session)
	if session.get('uname') == None:
		return render_template("login.html")
	return render_template("booking_agent_home.html")

@app.route("/booking_agent_register", methods=['GET', 'POST'])
def booking_agent_register():
	return render_template("booking_agent_register.html")