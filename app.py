import os

from flask import Flask, render_template
from flask_bootstrap import Bootstrap

from flask_sqlalchemy import SQLAlchemy

from covid import Covid

basedir = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = \
    'sqlite:///' + os.path.join(basedir, 'data.sqlite')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
bootstrap = Bootstrap(app)

class Country(db.Model):
    __tablename__ = 'countries'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), unique=True)
    confirmed = db.Column(db.Integer)
    active= db.Column(db.Integer)
    deaths= db.Column(db.Integer)
    recovered = db.Column(db.Integer)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    last_update = db.Column(db.DateTime)

    def __repr__(self):
        return '<Country %r>' % self.name


@app.route('/')
def hello():
    return render_template('index.html')

if __name__ == '__main__':
    app.run()


