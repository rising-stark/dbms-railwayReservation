from app import app
from flask import render_template,request, url_for, request, redirect, flash, jsonify, session
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
global db, engine
global AC_SEATS,SL_SEATS
AC_SEATS = 18
SL_SEATS = 24

engine = create_engine("postgresql://postgres:1234@localhost:5432/railway")
db = scoped_session(sessionmaker(bind=engine))
app.secret_key = 'aaed92bfdd1f28a5671fedf04cd61079'
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"


if __name__=='__main__':
	app.run(debug=True)