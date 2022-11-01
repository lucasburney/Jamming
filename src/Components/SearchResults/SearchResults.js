import React from 'react';

import './SearchResults.css';

import TrackList from '../TextTrackList/TextTrackList.js';

class SearchResults extends React.Component {

  render() {  
    return (
      <div className="SearchResults">
        <h2>Results</h2>
        <TrackList 
          tracks={this.props.searchResults}
          onAdd={this.props.onAdd}
          isRemoval={false} />
        <button className="Playlist-save">SAVE TO SPOTIFY</button>
      </div>
    )
  }
}

export default SearchResults;