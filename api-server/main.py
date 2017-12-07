#!/usr/bin/env python3
"""
Metawahl API

"""
import os
import sys
import logging

from flask import Flask, jsonify, request, send_file
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from logger import setup_logger
from pprint import pformat

logfile = os.getenv("METAWAHL_API_LOGFILE", "../metawahl-api.log")
logger = setup_logger(logfile=logfile, level=logging.DEBUG)

API_ROOT = "/api/v1"

db = SQLAlchemy()

def log_request_info(name, request):
  logger.info("{} API".format(name))
  logger.info("Data: {}".format(pformat(request.args)))

# Categories
#
# 0:  Arbeit und Beschäftigung
# 1:  Ausländerpolitik, Zuwanderung
# 2:  Außenpolitik und internationale Beziehungen
# 3:  Außenwirtschaft
# 4:  Bildung und Erziehung
# 5:  Bundestag
# 6:  Energie
# 7:  Entwicklungspolitik
# 8:  Europapolitik und Europäische Union
# 9:  Gesellschaftspolitik, soziale Gruppen
# 10: Gesundheit
# 11: Innere Sicherheit
# 12: Kultur
# 13: Landwirtschaft und Ernährung
# 14: Medien, Kommunikation und Informationstechnik
# 15: Neue Bundesländer
# 16: Öffentliche Finanzen, Steuern und Abgaben
# 17: Politisches Leben, Parteien
# 18: Raumordnung, Bau- und Wohnungswesen
# 19: Recht
# 20: Soziale Sicherung
# 21: Sport, Freizeit und Tourismus
# 22: Staat und Verwaltung
# 23: Umwelt
# 24: Verkehr
# 25: Verteidigung
# 26: Wirtschaft
# 27: Wissenschaft, Forschung und Technologie


def create_app(config=None):
    app = Flask(__name__)
    app.config.update(config or {})
    app.config.from_envvar("METAWAHL_CONFIG")

    db.init_app(app)

    CORS(app)

    @app.route(API_ROOT + "/occasions/", methods=["GET"])
    def occasions():
        """Return a list of all occasions."""

        return send_file("./data/occasions.json")

    @app.route(API_ROOT + "/occasions/<int:wom_id>", methods=["GET"])
    def occasion(wom_id: int):
        """Return metadata for an occasion and all theses therein."""
        # from model import Occasion
        rv = {
          "data": {
            "WOM-42-0": {
              "categories": [0, 5],
              "tags": [{
                "id": "Q4032",
                "label": "Zuwanderung",
                "description": "Wenn mehr Leute reinkommen"
              }]
            }
          }
        }

        log_request_info("Occasion", request)

        return jsonify(rv)

    @app.route(API_ROOT + "/categories/", methods=["GET"])
    def categories():
        """Return list of all categories."""

        return send_file("./data/categories.json")

    @app.route(API_ROOT + "/categories/<string:category>", methods=["GET"])
    def category(category: str):
        """Return metadata for all theses in a category."""
        # from model import Category
        rv = {}

        log_request_info("Category", request)

        return jsonify(rv)

    @app.route(API_ROOT + "/thesis/<string:thesis_id>", methods=["GET", "POST"])
    def thesis(thesis_id: str):
        """Return metadata for a specific thesis."""
        # from model import Thesis
        rv = {}

        log_request_info("Thesis", request)

        return jsonify(rv)
    return app


if __name__ == "__main__":
    port = int(os.environ.get("METAWAHL_PORT", 8000))
    app = create_app()
    app.run(host="0.0.0.0", port=port)