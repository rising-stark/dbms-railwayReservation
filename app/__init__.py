from flask import Flask

app = Flask(__name__)

from app import login
from app import admin_home
from app import register
from app import book_ticket
from app import my_bookings
from app import source_dest_search