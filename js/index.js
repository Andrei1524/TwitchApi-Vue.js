//
//https://wind-bow.glitch.me/twitch-api/streams/
//Mandrican Andrei aka AndreiKnight
//

new Vue({
  el: '.page',
  data: {
    items: ["andreiknight","creativemonkeyz", "misscoookiez","freecodecamp","comster404","anomalyxd","esl_csgo","sovietwomble","psynaps","mel0h","mihaidevil1"],
    
    channels: [].reverse(),
    search: '',
    allChannels: true,
    liveChannels: false,
    offLineChannels: false,
    usrNotFound: ''
    
  },
  
  computed: {
    showErrors: function() {

        return this.usrNotFound;

    },
    showChannelsFilters: function() {
      if (this.allChannels) {
        return this.channels;
      }
      
      if (this.liveChannels) {
        return this.channels.filter((channel) => {
            return channel.isLive;
        });
      }
      
      if (this.offLineChannels) {
        return this.channels.filter((channel) => {
            return !channel.isLive;
        });
      }
    }
  },

  methods: { 
      all: function() {
            this.liveChannels = false;
            this.offLineChannels = false;
            this.allChannels = true;
      },
      live: function() {
            this.liveChannels = true;
            this.offLineChannels = false;
            this.allChannels = false;
      },
      offline: function() {
            this.liveChannels = false;
            this.offLineChannels = true;
            this.allChannels = false;
      },
      
    addChannel: function() {
    //fetch the sources
    this.items.forEach((channel) => {
        axios.get(`https://wind-bow.glitch.me/twitch-api/channels/${channel}`).then((data) => {
          //create an user model
          //console.log(data);
          let user = {
              id: data.data._id,
              status: data.data.status,
              name: data.data.name,
              streaming: "creative",
              game: data.data.game,
              logo: data.data.logo,
              url: data.data.url,
              livePrev: "",
              isLive: false
          };
          if ( user.status === 404 ) {
             user.status = "This user channel is closed!"
          }
            axios.get(`https://wind-bow.glitch.me/twitch-api/streams/${channel}`).then((data) => {
                  if ( data.data.stream ) {
                      user.isLive = true;
                    user.livePrev = data.data.stream.preview.medium;
                  }
              //console.log(user);
             this.channels.push(user);
        });
          
            //getChannels.push(user);
          
            
        });
    });
    },
    
    addChannels: function() {
      if ( this.search === '' ) {
        this.usrNotFound = "You must type something!";
      } else {
        let channelExists = false;
        this.channels.forEach((channel) => {
            if (channel.name == this.search) {
              return channelExists = true;
            }
        });
        if (channelExists) {
          return this.usrNotFound = `User ${this.search} already is in the list!`;
        } else {
          axios.get(`https://wind-bow.glitch.me/twitch-api/channels/${this.search}`).then((data) => {
           
           
          if (data.data.status !== 404 && data.data.status !== 422  && data.data.status !== 400) {
            let user = {
              id: data.data._id,
              status: data.data.status,
              name: data.data.name,
              streaming: "creative",
              game: data.data.game,
              logo: data.data.logo,
              url: data.data.url,
              livePrev: "",
              isLive: false
          };

             axios.get(`https://wind-bow.glitch.me/twitch-api/streams/${this.search}`).then((data) => {
                  if ( data.data.stream ) {
                      user.isLive = true;
                    user.livePrev = data.data.stream.preview.medium;
                  }
              //console.log(user);
             this.channels.unshift(user);
             this.usrNotFound = '';
        });
           
          } else {
            this.usrNotFound = `User ${this.search} not found!`;
          }
      });
        }
         
      }

    }
    
  },
  created: function() {
    this.addChannel();
    
  }
  

});