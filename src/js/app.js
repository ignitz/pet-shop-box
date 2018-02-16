App = {
  web3Provider: null,
  web3: null,
  contracts: {},
  images: [
    "images/scottish-terrier.jpeg",
    "images/scottish-terrier.jpeg",
    "images/french-bulldog.jpeg",
    "images/boxer.jpeg",
    "images/golden-retriever.jpeg"
  ],

  initWeb3: function() {
    /* 
     * Substitua esse bloco de comentário
     */

  },

  initContract: function() {
    /* 
     * Substitua esse bloco de comentário
     */

  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.adopt);
    $(document).on('click', '#add-pet', App.addPet);
  },

  loadPets: function() {
    /* 
     * Substitua esse bloco de comentário
     */

  },

  addPet: function(event) {
    /* 
     * Substitua esse bloco de comentário
     */

  },

  adopt: function(event) {
    /* 
     * Substitua esse bloco de comentário
     */

  }
};

$(function() {
  $(window).load(function() {
    App.initWeb3();
  });
});
