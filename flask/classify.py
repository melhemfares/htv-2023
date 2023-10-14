from lyricsgenius import Genius
import cohere
from cohere.classify import Example
from collections import defaultdict
from flask import jsonify
from dotenv import load_dotenv
import os

load_dotenv()

genius_access_token = os.getenv('GENIUS_TOKEN')
key = os.getenv('COHERE_KEY')

co = cohere.Client(key)
genius = Genius(genius_access_token)
    
def classify_one(title, author):
    song = genius.search_song(title, author)

    lyrics = song.lyrics.split('\n')
    inputs = []

    for ly in lyrics:
        if ly != '':
            inputs.append(ly)
            
    examples = []

    # with open('songs.json', 'r') as file:
    #     songs = json.load(file)

    songs = {
        "Happy": [
            "Don't stop believin', hold on to that feeling.",
            "I'm walking on sunshine, whoa-oh." ,
            "Everything is awesome, everything is cool when you're part of a team.",
            "Happy days are here again, the skies above are clear again.",
            "Put on a happy face." ,
            "You are the sunshine of my life.",
            "I've got sunshine on a cloudy day.",
            "I'm in a good mood, I wanna let it shine." ,
            "Good vibrations, excitations, our imaginations.",
            "I'm a little bit closer to feeling fine." ,
            "Celebrate good times, come on!",
            "Sweet Caroline, ba ba ba." ,
            "I'm a Believer, I couldn't leave her if I tried.",
            "We go together like rama lama lama ka dinga da dinga dong.",
            "Three little birds, sat on my window.",
            "Can't stop the feeling!",
            "Top of the world, looking down on creation.",
            "I feel good." ,
            "Don't worry, be happy.",
            "I want to hold your hand." ,
            "You make my dreams come true." ,
            "I've just seen a face I can't forget.",
            "Dancing in the moonlight, everybody's feeling warm and bright.",
            "I'm on top of the world, hey!",
            "Walking on sunshine, whoa!" ,
            "Happy, happy, joy, joy." ,
            "Here comes the sun, doo-doo-doo-doo." ,
            "I feel the earth move under my feet.",
            "Joy to the world, all the boys and girls now.",
            "Shiny happy people holding hands.",
            "I'm yours, and you are mine." ,
            "Singing in the rain, I'm singing in the rain." ,
            "It's a beautiful day, don't let it get away.",
            "Good day sunshine, good day sunshine." ,
            "Smile, though your heart is aching." ,
            "Joyful, joyful, we adore Thee.",
            "Put a little love in your heart.",
            "Ooh, I love the night life, I got to boogie on the disco 'round.",
            "Walking on a dream.",
            "You are the best thing that's ever been mine." 
            ],
            
        "Sad": [
            "Yesterday, all my troubles seemed so far away.",
            "Hello, darkness, my old friend, I've come to talk with you again.",
            "I will always love you.",
            "Hallelujah, you say I'm not the one, but can't you see what you've done to me.",
            "Tears in heaven, you know I'll be free.",
            "All by myself, don't wanna be all by myself anymore.",
            "How do I live without you? I want to know.",
            "Without you, I'm nothing at all.",
            "When you're gone, the pieces of my heart are missing you.",
            "I'm so tired of being here, suppressed by all my childish fears.",
            "All out of love, I'm so lost without you.",
            "Un-break my heart, say you'll love me again.",
            "I'm sorry for the times that I made you scream.",
            "When you're lost and alone and you can't get back again.",
            "I'm sorry, it's all that you can say.",
            "It's a heartache, nothing but a heartache.",
            "I'm a loser, I'm a loser, and I'm not what I appear to be.",
            "I'm so lonesome I could cry.",
            "When you're gone, how can I even try to go on?",
            "Nothing compares, nothing compares to you.",
            "Sometimes it feels like somebody's watching me.",
            "I'm blue, da ba dee da ba daa.",
            "Mama, just killed a man.",
            "Yesterday, love was such an easy game to play.",
            "He stopped loving her today.",
            "I'm so sorry, please forgive me.",
            "I go out walking after midnight, out in the moonlight.",
            "In the end, it doesn't even matter.",
            "Boulevard of broken dreams.",
            "How could this happen to me?",
            "If I could turn back time.",
            "I'm not a girl, not yet a woman.",
            "When a man loves a woman.",
            "Hello, is it me you're looking for?",
            "Every breath you take, and every move you make, I'll be watching you.",
            "I'm sorry, it's too late.",
            "The sound of silence.",
            "I will always want you.",
            "I just want to feel this moment.",
            "The living's easy, the fish are jumping."
            ],
            
            "Excited": [
                "I wanna dance with somebody, I wanna feel the heat with somebody.",
                "Turn down for what!",
                "I wanna rock and roll all night and party every day.",
                "Start me up, I'll never stop.",
                "Shake it off, shake it off.",
                "Can't stop the feeling!",
                "Jump, jump, jump, everybody jump.",
                "Pump up the jam, pump it up while your feet are stompin'.",
                "Wake me up before you go-go, don't leave me hangin' on like a yo-yo.",
                "We will, we will rock you!",
                "Dance the night away.",
                "Shout, shout, let it all out.",
                "I just want to dance the night away.",
                "Dancing in the moonlight, everybody's feeling warm and bright.",
                "Get up, stand up, stand up for your rights.",
                "Wanna dance the night away.",
                "Dance, dance, we're falling apart to half time.",
                "Dancing in the street.",
                "I want to dance, and love, and dance again.",
                "Let's groove tonight.",
                "Get down on it.",
                "Get the party started.",
                "You can dance, you can jive, having the time of your life.",
                "Dance to the music.",
                "Don't know why, there's no sun up in the sky.",
                "Don't dream it's over.",
                "What's going on?",
                "Imagine there's no heaven.",
                "A change is gonna come.",
                "Fire and rain.",
                "Turn your lights down low.",
                "Fields of gold.",
                "No woman, no cry.",
                "More than words.",
                "A horse with no name.",
                "Elderly woman behind the counter in a small town.",
                "Ain't no mountain high enough.",
                "Is this love that I'm feeling?",
                "Fields of Athenry.",
                "All of me loves all of you.",
                "Fields of Athenry.",
                "What's going on?",
                "I can't help falling in love with you.",
                "No rain."
            ],
            "Calm": [
                "Imagine all the people, living life in peace.",
                "Lean on me, when you're not strong, and I'll be your friend.",
                "Starry, starry night, paint your palette blue and gray.",
                "I'm on fire.",
                "Oh, the weather outside is frightful, but the fire is so delightful.",
                "Hallelujah.",
                "You've got a friend.",
                "If I ain't got you, baby.",
                "Bridge over troubled water.",
                "What a wonderful world.",
                "Just the two of us, we can make it if we try.",
                "I'll stand by you.",
                "Time after time.",
                "In the arms of the angel.",
                "The rose.",
                "Ain't no sunshine when she's gone.",
                "And when the night is cloudy, there is still a light that shines on me.",
                "I can see clearly now, the rain is gone.",
                "Just like a star across my sky.",
                "Don't know why, there's no sun up in the sky.",
                "Don't dream it's over.",
                "What's going on?",
                "Imagine there's no heaven.",
                "A change is gonna come.",
                "Fire and rain.",
                "Turn your lights down low.",
                "Fields of gold.",
                "No woman, no cry.",
                "More than words.",
                "A horse with no name.",
                "Elderly woman behind the counter in a small town.",
                "Ain't no mountain high enough.",
                "I will always love you.",
                "Is this love that I'm feeling?",
                "Fields of Athenry.",
                "All of me loves all of you.",
                "Fields of Athenry.",
                "What's going on?",
                "I can't help falling in love with you.",
                "No rain."
            ]
        }

    for mood, lyrics in songs.items():
        for lyric in lyrics:
            examples.append(Example(lyric, mood))

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
    
    for song in songs['songs'].values():
        title, author = song

        res.append(classify_one(title, author))

    new = []

    for song in res:
        if song['mood'][0] == mood:
            new.append((song['title'], song['author'], song['mood'][1]))

    new.sort(key=lambda x: x[2], reverse=True)

    return jsonify(new)


