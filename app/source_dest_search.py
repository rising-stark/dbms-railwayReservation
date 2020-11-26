from main import *

@app.route("/source_dest_open", methods=["GET", "POST"])
def source_dest_open():
	return render_template("source_dest_search.html")

@app.route("/source_dest_search", methods=["POST"])
def source_dest_search():
	if request.method == "POST":

		req = request.json
		source = req["source"]
		dest= req["dest"]

		attr = ["trainno","source","start_time","dest","end_time","ac_coaches","sl_coaches","ac_fare","sl_fare","doj"]
		trains = db.execute("SELECT * FROM trains WHERE source = (:source) and dest = (:dest)",{"source": source, "dest": dest})

		d, a = {}, ["1"]
		for trainno in trains:
			for column, value in trainno.items():
				d = {**d, **{column: value}}
			a.append(d)
		
		ct = 0
		for _ in a:
			ct += 1
		if ct > 1:
			print(a)
			return jsonify(a)
		else:
			trains = db.execute("SELECT * FROM trains as T1 Inner Join trains as T2 on T1.dest = T2.source WHERE T1.source = (:source) and T2.dest=(:dest) and (T1.doj==T2.doj and T1.end_time <= T2.start_time) or (T1.doj <> T2.doj and T2.doj > T1.doj)",{"source": source, "dest": dest}).fetchall()
			
			a[0] = "2"
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
			for _ in a:
				ct += 1
				break
			if ct==1:
				return jsonify(a)
			else:
				return {}
	return "NULL"