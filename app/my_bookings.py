from main import *

@app.route("/my_booking")
def my_booking():
    if request.method == "POST":
        req = request.json
        uname = req["uname"]
        