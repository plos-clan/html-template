#!/usr/bin/env python3
from flask import Flask, send_from_directory
import os

app = Flask(__name__)


@app.route('/')
def index():
  return send_from_directory('.', 'index.html')


@app.route('/<path:filename>')
def serve_file(filename):
  if os.path.isdir(filename):
    return send_from_directory('.', os.path.join(filename, 'index.html'))
  else:
    if not os.path.exists(filename) and os.path.exists(filename + '.html'):
      return send_from_directory('.', filename + '.html')
    else:
      return send_from_directory('.', filename)


app.run(host='127.0.0.1', port=7000)
