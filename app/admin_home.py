from main import *

@app.route("/admin_add_train", methods=["POST"])
def admin_add_train():
	if request.method == "POST":
		req = request.json
		trainno = req["trainno"]
		source = req["source"]
		dest = req["dest"]
		st_time = req["st_time"]
		end_time = req["end_time"]
		ac_coaches = req["ac_coaches"]
		sl_coaches = req["sl_coaches"]
		ac_fare = req["ac_fare"]
		sl_fare = req["sl_fare"]
		doj = req["doj"]
		ac_seats = ac_seats*int(ac_coaches)
		sl_seats = sl_seats*int(sl_coaches)
		# add code here to return 1 if successfully entered
		# or return 0 if primary key violates because trains table has primary key (trainno, doj)
		fetch = db.execute("select source from trains where trainno = (:id) and doj = (:date)",{"id":trainno, "date":doj})
		ct = 0
		for _ in fetch:
			ct += 1
			break
		if ct==1:
			return "0"

		db.execute("INSERT INTO trains (trainno,source,start_time,dest,end_time,ac_coaches,sl_coaches,ac_fare,sl_fare,doj,ac_seats,sl_seats) VALUES (:trainno,:source,:st_time,:dest,:end_time,:ac_coaches,:sl_coaches,:ac_fare,:sl_fare,:doj,:ac_seats,:sl_seats)",
				{"trainno":trainno,"source":source,"st_time":st_time,"dest":dest,"end_time":end_time,"ac_coaches":ac_coaches,"sl_coaches":sl_coaches,"ac_fare":ac_fare,"sl_fare":sl_fare,"doj":doj,"ac_seats":ac_seats,"sl_seats":sl_seats})
		db.commit() 
		return "1"
	return "NULL"


@app.route('/admin_show_train',methods=["POST"])
def admin_show_train():
	if request.method == "POST":
		req = request.json
		trainno=req["trainno"]
		doj=req["doj"]
		print(req)

		attr = ["trainno","source","start_time","dest","end_time","ac_coaches","sl_coaches","ac_fare","sl_fare","doj"]
		
		if(doj == ""):
			trains = db.execute("select * from trains where trainno = (:id)", {"id":trainno}).fetchall()
		elif(trainno == ""):
			trains = db.execute("select * from trains where doj = (:doj)", {"doj":doj}).fetchall()
		else:
			trains = db.execute("select * from trains where doj = (:doj) and trainno = (:id)", {"doj":doj,"id":trainno}).fetchall()
		
		a = []
		for i in trains:
			d = {}
			for j in range(len(attr)):
				d[attr[j]] = i[j]
			a.append(d)
		return jsonify(a)
	return "NULL"
