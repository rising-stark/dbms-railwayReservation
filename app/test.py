from flask import Flask, render_template, request, jsonify
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker

engine = create_engine("postgresql://postgres:1234@localhost:5432/railway")
db = scoped_session(sessionmaker(bind=engine))

app = Flask(__name__)

app.secret_key = '12345678' ''' this key is used to communicate with database.'''
#Configure session to use filesystem
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"



@app.route('/')
def home():
	return render_template('admin_home.html')

@app.route("/train_data", methods=["POST"])
def train_data():
	trainno=request.form.get("trainno")
	source=request.form.get("source")
	st_time=request.form.get("st_time")
	dest=request.form.get("dest")
	ac_coaches=request.form.get("ac_coaches")
	sl_coaches=request.form.get("sl_coaches")
	ac_fare=request.form.get("ac_fare")
	doj=request.form.get("doj")
	end_time = request.form.get("end_time")
	sl_fare=request.form.get("sl_fare")
	
	
	db.execute("INSERT INTO trains (trainno,source,start_time,dest,end_time,ac_coaches,sl_coaches,ac_fare,sl_fare,doj) VALUES (:trainno,:source,:st_time,:dest,:end_time,:ac_coaches,:sl_coaches,:ac_fare,:sl_fare,:doj)",
			{"trainno":trainno,"source":source,"st_time":st_time,"dest":dest,"end_time":end_time,"ac_coaches":ac_coaches,"sl_coaches":sl_coaches,"ac_fare":ac_fare,"sl_fare":sl_fare,"doj":doj}) 
	db.commit() 
	return render_template("home.html")


@app.route('/showtrain',methods=["POST"])
def showtrain():
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

if __name__ == '__main__':
	app.run(debug=True)