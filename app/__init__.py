from flask import Flask

app = Flask(__name__)

from app import admin_home
from app import register
from app import book_ticket
