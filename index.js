new Vue({
  el: '#app',
  data: {
    colors: [
      { color: 'clubs' },
      { color: 'diamonds' },
      { color: 'spades' },
      { color: 'hearts' }
    ],
    values: [
      { valueName: 'two', value: 2 },
      { valueName: 'three', value: 3 },
      { valueName: 'four', value: 4 },
      { valueName: 'five', value: 5 },
      { valueName: 'six', value: 6 },
      { valueName: 'seven', value: 7 },
      { valueName: 'eight', value: 8 },
      { valueName: 'nine', value: 9 },
      { valueName: 'ten', value: 10 },
      { valueName: 'jack', value: 10 },
      { valueName: 'queen', value: 10 },
      { valueName: 'king', value: 10 },
      { valueName: 'ace', value: 11 }
    ],
    message: 'Press start to play',
    handOfPlayer: [],
    handOfDealer: [],
    totalValuePlayer: 0,
    totalValueDealer: 0,
    turnOfPlayer: true,
    canStartGame: true,
    canCallCard: false,
    canHoldCard: false,
  },
  methods: {
    // Init the game:
    // 1) Give two random cards to the player and the dealer.
    // 2) Make sure
    startGame: function () {
      this.resetGame();
      this.clearHands();
      this.canStartGame = false;

      // // Give random cards to the player.
      this.giveXCardsTo(this.turnOfPlayer, 2);
      this.turnOfPlayer = false;

      // // Give random cards to the dealer.
      this.giveXCardsTo(this.turnOfPlayer, 2);
      this.turnOfPlayer = true;

      this.canCallCard = true;
      this.canHoldCard = true;
      this.turnOf("Player");
    },

    // Returns one random card.
    getRandomCard: function () {
      // Set the values
      var valueIndex = Math.floor(Math.random() * this.values.length);
      var value = this.values[valueIndex].value;
      var valueName = this.values[valueIndex].valueName;

      // Set the color
      var colorIndex = Math.floor(Math.random() * this.colors.length);
      var color = this.colors[colorIndex].color;

      var i;
      if(this.turnOfPlayer) {
        i = this.handOfPlayer.length;
        this.totalValuePlayer += value;
      } else {
        i = this.handOfDealer.length;
        this.totalValueDealer += value;
      }

      return {
          id: i,
          value: value,
          imgSrc: valueName + '_of_' + color + '.png'
        };
    },

    // Calls one card for the active player.
    callCard: function () {
      if(this.turnOfPlayer) {
        this.giveXCardsTo(this.turnOfPlayer, 1)
        if(this.totalValuePlayer > 21) {
          this.won("Dealer");
        }
      } else {
        this.giveXCardsTo(this.turnOfPlayer, 1)
        if(this.totalValueDealer > 21) {
          this.won("Player");
        }
      }
    },

    // Ends the turn of the player and init the start of the dealer.
    holdCards: function () {
      // Dealer starts to play.
      this.canCallCard = false;
      this.canHoldCard = false;
      this.turnOfPlayer = false;
      this.turnOf("Dealer");
      this.dealerPlays();
    },

    giveXCardsTo: function (turnOfPlayer, numberOfCards) {
      for (var i = 0; i < numberOfCards; i++) {
        if(turnOfPlayer) {
          this.handOfPlayer.push(this.getRandomCard());
        } else {
          this.handOfDealer.push(this.getRandomCard());
        }
      }
    },

    // Logic on the dealer.
    dealerPlays: function () {
      // Dealer must draw to 16
      if(this.totalValueDealer <= 16) {
        this.giveXCardsTo(this.turnOfPlayer, 1);
        this.dealerPlays();

        // Dealer must stand on 17
      } else if (this.totalValueDealer >= 17) {
        this.checkWhoWon();
      }
    },

    checkWhoWon: function () {
      // Check who won
      // Dealer won only if:
      // 1) The score is the same OR 2) The dealer has a higher score then the player OR 3) Both (player and dealer) have BlackJack
      if((this.totalValuePlayer === this.totalValueDealer)
      || ((this.totalValueDealer > this.totalValuePlayer) && (this.totalValueDealer < 22))
      || ((this.totalValueDealer === 21) && (this.totalValuePlayer === 21 ))) {
        this.won("Dealer");
      } else {
        this.won("Player");
      }
    },

    // Player won.
    won: function (name) {
      this.message = name + " won, press start to play again.";

      // Could be called after interaction.
      this.finishGame();
    },

    // Finish the game of the player, does not reset values.
    finishGame: function () {
      this.resetButtons();
      this.turnOfPlayer = false;
    },

    // Resets the values of the player and dealer so the player can start again.
    resetGame: function () {
      this.totalValuePlayer = 0;
      this.totalValueDealer = 0;
      this.clearHands();
      this.resetButtons();
      this.turnOfPlayer = true;
    },

    resetButtons: function () {
      this.canStartGame = true;
      this.canCallCard = false;
      this.canHoldCard = false;
    },

    clearHands: function () {
      this.handOfPlayer = [];
      this.handOfDealer = [];
    },

    turnOf: function (whosTurn) {
      this.message = "Turn of " + whosTurn.toLowerCase();
    },

    // Adds default cards to the players and dealers hand for show.
    initGame: function () {
      this.handOfPlayer.push (
        { imgSrc: 'default_card.png'},
        { imgSrc: 'default_card.png'}
      );

      this.handOfDealer.push (
        { imgSrc: 'default_card.png'},
        { imgSrc: 'default_card.png'}
      );
    }
  },

  // Init the game before the HTML is rendered.
  beforeMount() {
    this.initGame()
  },

  // Filter and changes text for nicer headings.
  filters: {
    capitalize: function (value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    },
  }
})
