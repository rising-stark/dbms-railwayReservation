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
		
		# add code here to return 1 if successfully entered
		# or return 0 if primary key violates because trains table has primary key (trainno, doj)
		db.execute("INSERT INTO trains (trainno,source,start_time,dest,end_time,ac_coaches,sl_coaches,ac_fare,sl_fare,doj) VALUES (:trainno,:source,:st_time,:dest,:end_time,:ac_coaches,:sl_coaches,:ac_fare,:sl_fare,:doj)",
				{"trainno":trainno,"source":source,"st_time":st_time,"dest":dest,"end_time":end_time,"ac_coaches":ac_coaches,"sl_coaches":sl_coaches,"ac_fare":ac_fare,"sl_fare":sl_fare,"doj":doj}) 
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

		if(doj == ""):
			trains = db.execute("select * from trains where trainno = (:id)", {"id":trainno})
		elif(trainno == ""):
			trains = db.execute("select * from trains where doj = (:doj)", {"doj":doj})
		else:
			trains = db.execute("select * from trains where doj = (:doj) and trainno = (:id)", {"doj":doj,"id":trainno})
		
		d, a = {}, []
		for rowproxy in trains:
			for column, value in rowproxy.items():
				d = {**d, **{column: value}}
			a.append(d)
		return jsonify(a)
	
	return "NULL"

# if __name__ == '__main__':
# 	app.run(debug=True)