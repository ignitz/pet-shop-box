App = {
  web3Provider: null,
  web3: null,
  contracts: {},

  loadPets: function() {
    // Load pets.

    var images = [
      "images/scottish-terrier.jpeg",
      "images/scottish-terrier.jpeg",
      "images/french-bulldog.jpeg",
      "images/boxer.jpeg",
      "images/golden-retriever.jpeg"
    ];
    
    var adoptionInstance;
    App.contracts.Adoption.deployed().then(function(instance) {
      adoptionInstance = instance;
      return adoptionInstance.getPetLength.call();
    }).then(function(result) {
      var petLength = result.c[0];
      var promises = [];
    
      for(i = 0; i < petLength; i++){
        promises.push(adoptionInstance.getPet.call(i))
      }

      Promise.all(promises).then(function(result){
        var petsRow = $('#petsRow');
        var petTemplate = $('#petTemplate');
        petsRow.empty();
      
        for(i = 0; i < petLength; i++){
          petTemplate.find('.panel-title').text(App.web3.toAscii(result[i][0]));
          petTemplate.find('img').attr('src', images[Math.floor(Math.random() * images.length)]);
          petTemplate.find('.btn-adopt').attr('data-id', i);
          result[i][1] != '0x0000000000000000000000000000000000000000' ?
            petTemplate.find('.btn-adopt').text('Adopted').attr('disabled', true) :
            petTemplate.find('.btn-adopt').text('Adopt').attr('disabled', false);

          petsRow.append(petTemplate.html());
        }
      });

    }).catch(function(err) {
      console.log(err.message);
    });
  },

  initWeb3: function() {

    // Is there an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fall back to Ganache
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    App.web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {

    $.getJSON('Adoption.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var AdoptionArtifact = data;
      App.contracts.Adoption = TruffleContract(AdoptionArtifact);

      // Set the provider for our contract
      App.contracts.Adoption.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the adopted pets
      return App.loadPets();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.adopt);
    $(document).on('click', '.btn-addPet', App.addPet);
    $(document).on('click', '.btn-getPetLength', App.addPet);
  },

  getPetLength: function() {

    App.contracts.Adoption.deployed().then(function(instance) {
      adoptionInstance = instance;
      return adoptionInstance.getPetLength.call();
    }).then(function(result) {
      return result.c[0];
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  addPet: function() {

    var petName = $('#petName').val();

    var adoptionInstance;

    App.web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Adoption.deployed().then(function(instance) {
        adoptionInstance = instance;

        return adoptionInstance.addPet(petName, {from: account});
      }).then(function(result) {
        return App.loadPets();
      }).catch(function(err) {
        console.log(err.message);
      });
    });

  },

  adopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    App.web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Adoption.deployed().then(function(instance) {
        adoptionInstance = instance;

        return adoptionInstance.adopt(petId, {from: account});
      }).then(function(result) {
        return App.loadPets();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }

};

$(function() {
  $(window).load(function() {
    App.initWeb3();
  });
});
