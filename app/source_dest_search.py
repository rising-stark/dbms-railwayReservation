from main import *


@app.route("/source_dest_search", methods=["POST"])
def source_dest_search():
	if request.method == "POST":

		req = request.json
		source = req["source"]
		dest= req["dest"]

		attr = ["trainno","source","start_time","dest","end_time","ac_coaches","sl_coaches","ac_fare","sl_fare","doj"]
		trains = db.execute("SELECT trainno,source,dest FROM trains WHERE source = (:source) and dest = (:dest)",{"source": source, "dest": dest})

		d, a = {}, ["1"]
		for trainno in trains:
			for column, value in trainno.items():
				d = {**d, **{column: value}}
			a.append(d)
		
		ct = 0
		for _ in trains:
			ct += 1
			break
		if ct==1:
			return jsonify(a)
		else:
			trains = db.execute("SELECT * FROM trains as T1 Inner Join trains as T2 on T1.dest = T2.source WHERE T1.source = (:source) and T2.dest=(:dest) and T1.end_time <= T2.start_time",{"source": source, "dest": dest})
			
			
			a = []
			for i in trains:
				d = {}
				for j in range(len(attr)):
					d[attr[j]] = i[j]
				a.append(d)
				d = {}
				for j in range(len(attr),2*len(attr)):
					d[attr[j%len(attr)]] = i[j]
				a.append(d)
			
			
			ct = 0
			for _ in trains:
				ct += 1
				break
			if ct==1:
				return jsonify(a)
			else:
				return "0"
	return "NULL"
