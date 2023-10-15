const axios = require('axios');
const router = require('express').Router();

require('dotenv').config({ path: '../.env' });
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

async function getAccessToken() {
    const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
    const response = await axios.post('https://accounts.spotify.com/api/token', 
        'grant_type=client_credentials', 
        {
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
    );
    return response.data.access_token;
}

async function getSongsByGenre(genre) {
    const accessToken = await getAccessToken();
    const response = await axios.get(`https://api.spotify.com/v1/recommendations?seed_genres=${genre}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    return response.data.tracks;
}

async function getPlaylistTracks(playlistId){
    const accessToken = await getAccessToken();
    const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    return response.data;
}

router.get('/genre', async (req, res) => {
    const genre = req.query.genre;
    
    if (!genre) {
        return res.status(400).send({ error: 'Please provide a genre in the query parameters!'})
    }
    try {
        const songs = await getSongsByGenre(genre);
        res.status(200).send({ songs });
    } catch (err) {
        res.status(500).send({ error: err })
    }
});

router.get('/playlist', async (req, res) => {
    const playlistId = req.query.id;

    if (!playlistId){
        return res.status(400).send({error: 'Please provide a playlist Id!'})
    } try {
        const playlistTracks = await getPlaylistTracks(playlistId);
        let songs = []
        for (track in playlistTracks['tracks']['items']){
            let artist = playlistTracks['tracks']['items'][track]['track']['artists'][0]['name']
            let title = playlistTracks['tracks']['items'][track]['track']['name']
            let images = playlistTracks['tracks']['items'][track]['track']['album']['images'][0]['url']
            let preview = playlistTracks['tracks']['items'][track]['track']['preview_url']
            songs.push(
                {
                    'artist': artist, 
                    'title': title, 
                    'images': images, 
                    'preview': preview
                }
            );
        }
        res.status(200).send({ songs })
    } catch (err) {
        res.status(500).send({error: err})
    }
});

module.exports = router;