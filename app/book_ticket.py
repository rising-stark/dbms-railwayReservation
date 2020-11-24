from main import *

@app.route("/book_ticket1",methods=["POST"])
def book_ticket1():
	if request.method == "POST":
		req = request.json
		trainno = req["trainno"]
		seat_type = req["coach"]
		doj = req["start_doj"]
		s_detail = db.execute("select sl_seats, ac_seats from trains where trainno = (:trainno) and doj = (:doj)",{"trainno":trainno,"doj":doj}).fetchall()
		attr = ["sl_seats", "ac_seats"]
		
		a = []
		for i in s_detail:
			d = {}
			for j in range(len(attr)):
				d[attr[j]] = i[j]
			a.append(d)
		return jsonify(a)
	return "NULL"

@app.route("/book_ticket2",methods=["POST"])
def book_ticket2():
	if request.method == "POST":
		req = request.json
		trainno = req["trainno"]
		seat_type = req["coach"]
		doj = req["start_doj"]
		n = int(req["no_of_passengers"])
		if(seat_type == 'S'):
			s_detail = db.execute("select sl_fare from trains where trainno = (:trainno) and doj = (:doj)",{"trainno":trainno,"doj":doj}).fetchall()
			fare = n*s_detail[0][0]
			return str(fare)
		else:
			s_detail = db.execute("select ac_fare from trains where trainno = (:trainno) and doj = (:doj)",{"trainno":trainno,"doj":doj}).fetchall()
			fare = n*s_detail[0][0]
			return str(fare)
	return "NULL"

@app.route("/book_ticket3",methods=["POST"])
def book_ticket3():
	if request.method == "POST":
		req = request.json
		fname = []
		lname = []
		age = []
		gender = []
		n = int(req["no_of_passengers"])
		trainno = req["trainno"]
		seat_type = req["coach"]
		doj = req["start_doj"]
		uname = req["uname"]
		fare = req["fare"]
		dict1 = req["dict1"]
		print(dict1)
		print(type(dict1))
		for i in range(n):
			fname.append(dict1["fname"+str(i)])
			lname.append(dict1["lname"+str(i)])
			age.append(dict1["age"+str(i)])
			gender.append(dict1["gender"+str(i)])
		
		if(seat_type == 'S'):
			s_detail = db.execute("select sl_seats,sl_coaches from trains where trainno = (:trainno) and doj = (:doj)",{"trainno":trainno,"doj":doj}).fetchall()
			if(n > s_detail[0][0]):
				return "0"
			tot_seats = s_detail[0][1]*SL_SEATS
			acq_seats = tot_seats - s_detail[0][0]
			sl_berths = ["LB","LB","UB","UB","SL","SU"]
			m = len(sl_berths)
			pnr = 2
			seats = []
			coaches = []
			berths = []
			c_num = acq_seats/SL_SEATS + 1
			s_num = acq_seats%SL_SEATS + 1
			for _ in range(n):
				seats.append(s_num)
				coaches.append("S"+str(c_num))
				berths.append(sl_berths[(s_num-1)%m])
				s_num += 1
				if(s_num > SL_SEATS):
					s_num = 1
					c_num += 1
			db.execute("INSERT INTO ticket(pnr,bookedby,no_of_seats,doj,trainno,amount) VALUES (:pnr,:bookedby,:no_of_seats,:doj,:trainno,:amount)",
			{"pnr":pnr,"bookedby":uname,"no_of_seats":n,"doj":doj,"trainno":trainno,"amount":fare})
			db.commit()
			for i in range(n):
				db.execute("INSERT INTO passenger(fname,lname,age,gender,seatno,coach,berth,pnr) VALUES (:fname,:lname,:age,:gender,:seatno,:coach,:berth,:pnr)",
				{"fname":fname[i],"lname":lname[i],"age":age[i],"gender":gender[i],"seatno":seats[i],"coach":coaches[i],"berth":berths[i],"pnr":pnr})
				db.commit()
			return "1"
		else:
			s_detail = db.execute("select ac_seats,ac_coaches from trains where trainno = (:trainno) and doj = (:doj)",{"trainno":trainno,"doj":doj}).fetchall()
			if(n > s_detail[0][0]):
				return "0"
			tot_seats = s_detail[0][1]*AC_SEATS
			acq_seats = tot_seats - s_detail[0][0]
			ac_berths = ["LB","MB","UB","LB","MB","UB","SL","SU"]
			m = len(ac_berths)
			pnr = 2
			seats = []
			coaches = []
			berths = []
			c_num = int(acq_seats//AC_SEATS + 1)
			s_num = int(acq_seats%AC_SEATS + 1)
			for _ in range(n):
				seats.append(s_num)
				coaches.append("S"+str(c_num))
				berths.append(ac_berths[(s_num-1)%m])
				s_num += 1
				if(s_num > AC_SEATS):
					s_num = 1
					c_num += 1
			db.execute("INSERT INTO ticket(pnr,bookedby,no_of_seats,doj,trainno,amount) VALUES (:pnr,:bookedby,:no_of_seats,:doj,:trainno,:amount)",
			{"pnr":pnr,"bookedby":uname,"no_of_seats":n,"doj":doj,"trainno":trainno,"amount":fare})
			db.commit()
			for i in range(n):
				db.execute("INSERT INTO passenger(fname,lname,age,gender,seatno,coach,berth,pnr) VALUES (:fname,:lname,:age,:gender,:seatno,:coach,:berth,:pnr)",
				{"fname":fname[i],"lname":lname[i],"age":age[i],"gender":gender[i],"seatno":seats[i],"coach":coaches[i],"berth":berths[i],"pnr":pnr})
				db.commit()
			return "1"
	return "NULL"