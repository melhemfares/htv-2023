from lyricsgenius import Genius
import cohere
from cohere.responses.classify import Example
from collections import defaultdict
from flask import jsonify
from dotenv import load_dotenv
import requests
import json
import os

load_dotenv()

genius_access_token = os.getenv('GENIUS_TOKEN')
key = os.getenv('COHERE_KEY')

co = cohere.Client(key)
genius = Genius(genius_access_token)

examples = []

with open('C:/Users/ricki/OneDrive/Desktop/htv-2023/flask/songs.json', 'r') as file:
    songs = json.load(file)

for mood, lyrics in songs.items():
    for lyric in lyrics:
        examples.append(Example(lyric, mood))
    
def classify_one(title, author):
    
    while True:
        try:
            song = genius.search_song(title, author)
            break
        except requests.exceptions.Timeout:
            pass
        except:
            return jsonify( {"error": "Something unexpected happened. Try again"} )
        
    lyrics = song.lyrics.split('\n')
    inputs = []

    i = 0

    for ly in lyrics:
        if ly != '' and i < 96:
            inputs.append(ly)
            i += 1

    count = defaultdict(int)

    response = co.classify(
    inputs=inputs,
    examples=examples,
    )

    balancer = len(inputs)

    for res in response.classifications:
        count[res.prediction] += res.confidence / balancer

    prediction = max(count.values())

    for mood, score in count.items():
        if score == prediction:
            return {"mood": (mood, score), "title": title, "author": author }
        
def classify_many(songs):
    res = []

    mood = songs['mood']
    
    for song in songs['songs']:
        title, author = song['title'], song['author']
        print("VALUES", title, author, mood)
        res.append(classify_one(title, author))

    new = []

    for song in res:
        if song['mood'][0] == mood:
            new.append((song['title'], song['author'], song['mood'][1]))

    new.sort(key=lambda x: x[2], reverse=True)
    print("HERE", jsonify(new))
    return jsonify(new)


