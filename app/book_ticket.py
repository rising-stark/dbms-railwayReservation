from main import *


@app.route("/train_details",methods=["POST"])
def train_details():
    if request.method == "POST":
        req = request.json
        trainno = req["trainno"]
        seat_type = req["st"]
        doj = req["doj"]
        if(seat_type == 'S'):
            s_detail = db.execute("select sl_seats,sl_coaches from trains where trainno = (:trainno) and doj = (:doj)",{"trainno":trainno,"doj":doj}).fetchall()
            return str(s_detail[0][0])
        else:
            s_detail = db.execute("select ac_seats,ac_coaches from trains where trainno = (:trainno) and doj = (:doj)",{"trainno":trainno,"doj":doj}).fetchall()
            return str(s_detail[0][0])
    return "NULL"

@app.route("/calc_fare",methods=["POST"])
def calc_fare():
	if request.method == "POST":
		req = request.json
		trainno = req["trainno"]
		seat_type = req["st"]
		doj = req["doj"]
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


@app.route("/book_ticket",methods=["POST"])
def book_ticket():
    if request.method == "POST":
        req = request.json
        fname = []
        lname = []
        age = []
        gender = []
        n = int(req["no_of_passengers"])
        trainno = req["trainno"]
        seat_type = req["st"]
        doj = req["doj"]
        uname = req["uname"]
        fare = req["fare"]
        for i in range(n):
            fname[i] = req["fname"]
            lname[i] = req["lname"]
            age[i] = req["age"]
            gender[i] = req["gender"]
        
        if(seat_type == 'S'):
            s_detail = db.execute("select sl_seats,sl_coaches from trains where trainno = (:trainno) and doj = (:doj)",{"trainno":trainno,"doj":doj}).fetchall()
            if(n > s_detail[0][0]):
                return "0"
            tot_seats = s_detail[0][1]*SL_SEATS
            acq_seats = tot_seats - s_detail[0][0]
            sl_berths = ["LB","LB","UB","UB","SL","SU"]
            m = len(sl_berths)
            seats = []
            coaches = []
            berths = []
            pids = []
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
            for i in range(n):
                db.execute("INSERT INTO passenger(pid,fname,lname,age,gender,seatno,coach,berth,pnr) VALUES (:pid,:fname,:lname,:age,:gender,:seatno,:coach,:berth,:pnr)",
                {"pid":pids[i],"fname":fname[i],"lname":lname[i],"age":age[i],"gender":gender[i],"seatno":seats[i],"coach":coaches[i],"berth":berths[i],"pnr":pnr})
                db.commit()
            db.execute("INSERT INTO ticket(pnr,bookedby,no_of_seats,doj,trainno,amount) VALUES (:pnr,:bookedby,:no_of_seats,:doj,:trainno,:amount)",
            {"pnr":pnr,"bookedby":uname,"no_of_seats":n,"doj":doj,"trainno":trainno,"amount":fare})
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
            seats = []
            coaches = []
            berths = []
            pids = []
            c_num = acq_seats/AC_SEATS + 1
            s_num = acq_seats%AC_SEATS + 1
            for _ in range(n):
                seats.append(s_num)
                coaches.append("S"+str(c_num))
                berths.append(ac_berths[(s_num-1)%m])
                s_num += 1
                if(s_num > AC_SEATS):
                    s_num = 1
                    c_num += 1
            for i in range(n):
                db.execute("INSERT INTO passenger(pid,fname,lname,age,gender,seatno,bookedby,coach,berth,pnr) VALUES (:pid,:fname,:lname,:age,:gender,:seatno,:bookedby,:coach,:berth,:pnr)",
                {"pid":pids[i],"fname":fname[i],"lname":lname[i],"age":age[i],"gender":gender[i],"seatno":seats[i],"bookedby":uname,"coach":coaches[i],"berth":berths[i],"pnr":pnr})
                db.commit()
            db.execute("INSERT INTO ticket(pnr,bookedby,no_of_seats,doj,trainno,amount) VALUES (:pnr,:bookedby,:no_of_seats,:doj,:trainno,:amount)",
            {"pnr":pnr,"bookedby":uname,"no_of_seats":n,"doj":doj,"trainno":trainno,"amount":fare})
            db.commit()
            return "1"
    return "NULL"
        
        


