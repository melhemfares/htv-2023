# from lyricsgenius import Genius
# import cohere
# from cohere.classify import Example
# from collections import defaultdict
# import json
from flask import Flask, request, jsonify
from classify import classify_one, classify_many

app = Flask(__name__)

app.app_context().push()

#Sanity check
@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/classify', methods=['POST'])
def test_classify():
    song = request.get_json()

    title, author = song['title'], song['author']

    return classify_one(title, author)

@app.route('/classify/many', methods=['POST'])
def classify_more():
    songs = request.get_json()

    return classify_many(songs)

if __name__ == '__main__':
    # Run the application on http://127.0.0.1:5000/
    app.run(debug=True)
