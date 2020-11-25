from main import *

@app.route("/my_bookings")
def my_bookings():
	if request.method == "POST":
		req = request.json
		uname = req["uname"]

		# adding the attributes that I need in AJAX
		attr = ["trainno", "pnr", "source", "doj", "start_time", "dest", "end_time", "amount", "fname", "lname", "age", "gender", "coach", "seatno", "berth"]
		tickets = db.execute("select * from passenger p1 where p1.pnr in (select t.pnr from ticket t where t.bookedby = (:uname))",
		{"uname":uname}).fetchall()

		a = []
		for i in tickets:
			d = {}
			for j in range(len(attr)):
				d[attr[j]] = i[j]
			a.append(d)
		
		list_of_tickets = []
		one_ticket = []
		for i in range(1,len(a)+1):
			one_ticket.append(a[i-1])
			if (i == len(a) or a[i]["pnr"] != a[i-1]["pnr"]):
				list_of_tickets.append(one_ticket)
				one_ticket.clear()
		
		return jsonify(list_of_tickets)
	return "NULL"