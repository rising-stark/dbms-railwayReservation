from main import *

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
        for i in range(n):
            fname[i] = req["fname"]
            lname[i] = req["lname"]
            age[i] = req["age"]
            gender[i] = req["gender"]
        
        if(seat_type == 'S'):
            s_detail = db.execute("select sl_seats,sl_coaches from trains where trainno = (:trainno) and doj = (:doj)",{"trainno":trainno,"doj":doj}).fetchall()
            if(n > s_detail[0][0]):
                return "0"
            tot_seats = s_detail[0][1]*sl_seats
            acq_seats = tot_seats - s_detail[0][0]
            sl_berths = ["LB","LB","UB","UB","SL","SU"]
            m = len(sl_berths)
            seats = []
            coaches = []
            berths = []
            pids = []
            c_num = acq_seats/sl_seats + 1
            s_num = acq_seats%sl_seats + 1
            for _ in range(n):
                seats.append(s_num)
                coaches.append("S"+str(c_num))
                berths.append(sl_berths[(s_num-1)%m])
                s_num += 1
                if(s_num > sl_seats):
                    s_num = 1
                    c_num += 1
            for i in range(n):
                db.execute("INSERT INTO passenger(pid,fname,lname,age,gender,seatno,bookedby,coach,berth,pnr) VALUES (:pid,:fname,:lname,:age,:gender,:seatno,:bookedby,:coach,:berth,:pnr)",
                {"pid":pids[i],"fname":fname[i],"lname":lname[i],"age":age[i],"gender":gender[i],"seatno":seats[i],"bookedby":uname,"coach":coaches[i],"berth":berths[i],"pnr":pnr})
                db.commit()
            return "1"
        else:
            s_detail = db.execute("select ac_seats,ac_coaches from trains where trainno = (:trainno) and doj = (:doj)",{"trainno":trainno,"doj":doj}).fetchall()
            if(n > s_detail[0][0]):
                return "0"
            tot_seats = s_detail[0][1]*ac_seats
            acq_seats = tot_seats - s_detail[0][0]
            ac_berths = ["LB","MB","UB","LB","MB","UB","SL","SU"]
            m = len(ac_berths)
            seats = []
            coaches = []
            berths = []
            pids = []
            c_num = acq_seats/ac_seats + 1
            s_num = acq_seats%ac_seats + 1
            for _ in range(n):
                seats.append(s_num)
                coaches.append("S"+str(c_num))
                berths.append(ac_berths[(s_num-1)%m])
                s_num += 1
                if(s_num > ac_seats):
                    s_num = 1
                    c_num += 1
            for i in range(n):
                db.execute("INSERT INTO passenger(pid,fname,lname,age,gender,seatno,bookedby,coach,berth,pnr) VALUES (:pid,:fname,:lname,:age,:gender,:seatno,:bookedby,:coach,:berth,:pnr)",
                {"pid":pids[i],"fname":fname[i],"lname":lname[i],"age":age[i],"gender":gender[i],"seatno":seats[i],"bookedby":uname,"coach":coaches[i],"berth":berths[i],"pnr":pnr})
                db.commit()
                return "1"
    return "NULL"
        
        


