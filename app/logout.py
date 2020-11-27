from main import *

@app.route("/logout")
def logout():
	session.clear()
	return render_template("welcome.html")