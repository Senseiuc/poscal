#!/usr/bin/env bash
#a script to set up flask env

project="poscal"
mkdir $project
virtualenv venv
source venv/bin/activate
pip install flask flask-wtf
cd $project
mkdir static templates data
cd ../
export FLASK_APP=application.py
export FLASK_DEBUG=1
export FLASK_ENV=development
export FLASK_TESTING=True
flask run --host=0.0.0.5000
