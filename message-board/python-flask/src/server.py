# STL IMPORTS
import logging
from os import environ

# EXT IMPORTS
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import pyodbc
from sqlalchemy.ext.automap import automap_base
from waitress import serve


app = Flask(__name__)
app.logger.setLevel(logging.INFO)
CORS(app, supports_credentials=True) # NO CORS PROBLEM CUZ NO COOKIES?
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['SQLALCHEMY_DATABASE_URI'] = f"mssql+pyodbc://{environ['SQL_SERVER_USERNAME']}:{environ['SQL_SERVER_PASSWORD']}@{environ['SQL_SERVER_HOST']}/{environ['SQL_SERVER_DB']}?driver=ODBC+Driver+17+for+SQL+Server;"
db = SQLAlchemy(app)
db_Base = automap_base()

with app.app_context():
    # Reflect the database schema
    db_Base.prepare(db.engine)

MESSAGE = db_Base.classes.MESSAGE


@app.route('/api/message', methods=['GET'])
def get_messages():
    app.logger.info('Getting messages!')
    return jsonify([{'content': msg.content, 'id': msg.id, 'post_time': msg.post_time} for msg in db.session.query(MESSAGE).all()])


@app.route('/api/message', methods=['POST'])
def create_message():
    app.logger.info('Someing POSTing!')
    try:
        new_message = MESSAGE(content=request.json['content'])
        db.session.add(new_message)
        db.session.commit()
        return jsonify({'id': new_message.id, 'post_time': new_message.post_time}), 201
    except KeyError:
        return jsonify({'error': '\"content\" is missing from POSTed JSON!'}), 400
    except: # TODO: ADD EXCEPTION FOR NO JSON BODY AT ALL? ADD EXCEPTION FOR content TOO LONG? ANY OTHER EXCEPTIONS?
        return jsonify({'error': 'An unknown error occurred!'}), 500


if __name__ == '__main__':
    app.logger.info('Starting server!')
    serve(app, host='0.0.0.0', port=5000)
