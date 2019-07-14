var GIPHY_API_URL = 'https://api.giphy.com';
var GIPHY_PUB_KEY = 'gprWj1lx1YUrhoLCaGih5pyTtppmQA0P';

var style = {
  margin: '0 auto',
  textAlign: 'center',
  width: '90%'
};

App = React.createClass({
  getInitialState() {
    return {
      loading: false,
      searchingText: '',
      gif: {}
    };
  },

  handleSearch: function(searchingText) {
    this.setState({
      loading: true
    });
    this.getGif(searchingText, function(gif) {
      this.setState({
        loading: false,
        gif: gif,
        searchingText: searchingText
      });
    }.bind(this));
  },

  getGif: function(searchingText, callback) {
    var url = GIPHY_API_URL + '/v1/gifs/random?api_key=' + GIPHY_PUB_KEY + '&tag=' + searchingText;

    function promisifiedGif(url) {
      return new Promise(function(resolve, reject) {
        var request = new XMLHttpRequest();
        request.onload = function() {
          if (this.status === 200) {
            resolve(this.response);
          } else {
            reject(new Error(this.statusText));
          }
        };
        request.onerror = function() {
          reject(new Error(this.statusText));
        };
        request.open('GET', url);
        request.send();
      });
    }

    promisifiedGif(url)
      .then(function(response) {
        return JSON.parse(response);
      })
      .then(function(response) {
        var gif = {
          url: response.data.fixed_width_downsampled_url,
          sourceUrl: response.data.url
        };
        callback(gif);
      })
      .catch(function(error) {
        console.log(error);
      })
  },

  render: function() {
    return (
      <div style={style}>
        <h1>Gif search!</h1>
        <p>Find GIF on <a href='http://giphy.com'>giphy</a> Press Enter to get further gif's.</p>
        <Search
          onSearch= {this.handleSearch}
        />
        <Gif
          loading=  {this.state.loading}
          url=      {this.state.gif.url}
          sourceUrl={this.state.gif.sourceUrl}
        />
      </div>
    );
  }
});
