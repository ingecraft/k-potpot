import os
import json

from flask import Flask, render_template, request, send_from_directory
from flask_bootstrap import Bootstrap
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import IntegrityError
from marshmallow import Schema, fields, ValidationError, pre_load

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
    active = db.Column(db.Integer)
    deaths = db.Column(db.Integer)
    recovered = db.Column(db.Integer)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    last_update = db.Column(db.DateTime)

    def __repr__(self):
        return '<Country %r>' % self.name


class CountrySchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str()
    confirmed = fields.Integer()
    active = fields.Integer()
    deaths = fields.Integer()
    recovered = fields.Integer()
    latitude = fields.Float()
    longitude = fields.Float()
    

country_schema = CountrySchema()
countries_schema = CountrySchema(many=True)


@app.route('/')
def hello():
    return render_template('index.html')


@app.route("/countries")
def get_countries():
    countries =  Country.query.all()
    result = countries_schema.dump(countries)
    return {"countries": result}

@app.route("/countries/<name>")
def get_country(name):
    try:
        country = Country.query.filter_by(name=name).first()
    except IntegrityError:
        return {"message": "Country could not be found."}, 400
    country_result = country_schema.dump(country)
    return {"country": country_result}

@app.route("/covid_data")
def get_covid_data():
    with open('static/countries_polygons.geo.json') as f:
        geo_data = json.load(f)
    
    covid_data = Country.query.all()
    for country in geo_data['features']:
        for covid_country in covid_data:
            if country['properties']['name'] == covid_country.name:
                country['properties']['deaths'] = covid_country.deaths
                country['properties']['active'] = covid_country.active
                country['properties']['confirmed'] = covid_country.confirmed
                country['properties']['recovered'] = covid_country.recovered
    
    return json.dumps(geo_data)


if __name__ == '__main__':
    app.run()


