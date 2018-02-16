Status = {
  INACTIVE: 0,
  AVAILABLE: 1,
  PENDING_ADOPTION: 2,
  ADOPTED: 3  
};

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
      return adoptionInstance.getNumberOfPets.call();
    }).then(function(result) {
      var petLength = result.toNumber();
      var promises = [];
    
      for(i = 0; i < petLength; i++){
        promises.push(adoptionInstance.getPet.call(i))
      }

          
      App.web3.eth.getAccounts(function(error, accounts) {
        adoptionInstance.owner.call().then(function(owner) {          

          Promise.all(promises).then(function(result){
            var petsRow = $('#petsRow');
            var petTemplate = $('#petTemplate');
            petsRow.empty();

            for(i = 0; i < petLength; i++){
              petTemplate.find('.panel-title').text(App.web3.toAscii(result[i][0]));
              petTemplate.find('img').attr('src', images[Math.floor(Math.random() * images.length)]);
              petTemplate.find('.btn-adopt').attr('data-id', i);
              petTemplate.find('.btn-accept').attr('data-id', i);
              petTemplate.find('#adoptionValue').attr('unique-id', i);
              petTemplate.find('#adoptionValue').css('display', 'none');
              
              switch(result[i][1].toNumber()) {
                case Status.INACTIVE:
                  petTemplate.find('.btn-adopt').text('Inactive').attr('disabled', true);
                break;
                case Status.AVAILABLE:
                  petTemplate.find('.btn-adopt').text('Adopt').attr('disabled', false);
                  petTemplate.find('#adoptionValue').css('display', 'inline');
                break;
                case Status.PENDING_ADOPTION:
                  petTemplate.find('.btn-adopt').text('Pending adoption').attr('disabled', true);
                break;
                case Status.ADOPTED:
                  petTemplate.find('.btn-adopt').text('Adopted').attr('disabled', true);
                break;
              };
              
              if(accounts[0] == owner && result[i][1].toNumber() == Status.PENDING_ADOPTION) {
                petTemplate.find('.btn-accept').css('display', 'inline');
                petTemplate.find('.btn-refuse').css('display', 'inline');
                petTemplate.find('.btn-adopt').css('display', 'none');
              } else {
                petTemplate.find('.btn-accept').css('display', 'none');              
                petTemplate.find('.btn-refuse').css('display', 'none');              
                petTemplate.find('.btn-adopt').css('display', 'inline');              
              }

              petsRow.append(petTemplate.html());
            }
          });
        });
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
    $(document).on('click', '.btn-accept', App.acceptAdoption);
    $(document).on('click', '.btn-refuse', App.refuseAdoption);
  },

  acceptAdoption: function(event) {
    event.preventDefault();
    
    var petId = parseInt($(event.target).data('id'));    

    var adoptionInstance;

    App.web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Adoption.deployed().then(function(instance) {
        adoptionInstance = instance;

        return adoptionInstance.acceptAdoption(petId, {from: account});
      }).then(function(result) {
        return App.loadPets();
      }).catch(function(err) {
        console.log(err.message);
      });
    });

  },

  refuseAdoption: function(event) {
    event.preventDefault();
    
    var petId = parseInt($(event.target).data('id'));    

    var adoptionInstance;

    App.web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Adoption.deployed().then(function(instance) {
        adoptionInstance = instance;

        return adoptionInstance.refuseAdoption(petId, {from: account});
      }).then(function(result) {
        return App.loadPets();
      }).catch(function(err) {
        console.log(err.message);
      });
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
    var searchString = '[unique-id=' + petId + ']';
    var adoptionValue = $(searchString).val();


    App.web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Adoption.deployed().then(function(instance) {
        adoptionInstance = instance;

        return adoptionInstance.adopt(petId, {from: account, value: adoptionValue});
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
