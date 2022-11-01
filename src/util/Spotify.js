const clientId = '6ce00c35a2c14ef287ddd6950c3a50cb';
const redirectUri = 'http://localhost:3000/';
let accessToken;

const Spotify = {
  
  
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }

    // check for access token match

    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/); // window.location.href points to the url of the page. Ours would be localHost:3000 or something
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);

      //This clears the parameters, allowing us to grab a new access token when it expires.

      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      window.location = accessUrl;
    }
  },

  search(term) {
    const accessToken = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      if (!jsonResponse.tracks) {
        return [];
      }
      return jsonResponse.tracks.items.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri,
        art: track.album.images[2].url
      }));
    });
  },

  savePlaylist(name, trackUris) {
    if (!name || !trackUris.length) {
      return;
    }
    const accessToken = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };
    let userId;

    return fetch('https://api.spotify.com/v1/me', { headers: headers }
    ).then(response => response.json()
    ).then(jsonResponse => {
      userId = jsonResponse.id;
      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, // fetch request sent to this endpoint, with our userId
      {                                                                    // passed an object aswell, with headers set to our headers, the method, and body, set to the name the user has created to their playlist
        headers: headers,
        method: 'POST',
        body: JSON.stringify({ name: name })
      }).then(response => response.json()
      ).then(jsonResponse => {
        const playlistId = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({ uris: trackUris })
        });
      });
    });
  }

}

export default Spotify;