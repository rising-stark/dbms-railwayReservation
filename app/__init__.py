from flask import Flask


app = Flask(__name__)

from app import register
from app import view
