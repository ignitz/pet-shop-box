var EstadoPet = {
  "NOT_ADOPTED":"NOT_ADOPTED",
  "WAITING_TO_ADOPT":"WAITING_TO_ADOPT",
  "ADOPTED":"ADOPTED"};
Object.freeze(EstadoPet);

App = {
  web3Provider : null,
  web3 : null,
  contracts : {},
  images : [
    "images/scottish-terrier.jpeg", "images/scottish-terrier.jpeg",
    "images/french-bulldog.jpeg", "images/boxer.jpeg",
    "images/golden-retriever.jpeg"
  ],

  initWeb3 : function() {
    // Is there an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fall back to Ganache
      App.web3Provider =
          new Web3.providers.HttpProvider('http://localhost:7545');
    }
    App.web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract : function() {
    $.getJSON('Adoption.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with
      // truffle-contract
      var AdoptionArtifact = data;
      App.contracts.Adoption = TruffleContract(AdoptionArtifact);

      // Set the provider for our contract
      App.contracts.Adoption.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the adopted pets
      return App.loadPets();
    });

    return App.bindEvents();

  },

  bindEvents : function() {
    $(document).on('click', '#donate-pet', App.adopt);
    $(document).on('click', '#add-pet', App.addPet);
  },

  loadPets : function() {
    var adoptionInstance;
    console.log("Your wallet is " + String(App.web3.eth.coinbase));
    App.contracts.Adoption.deployed()
        .then(function(instance) {
          adoptionInstance = instance;
          return adoptionInstance.getNumberOfPets.call();
        })
        .then(function(res) {
          var numberOfPets = res.toNumber(); // number of pets is a BigNumber

          if (numberOfPets > 0) {
            $('#add-one').hide();
            $('.btn-addPet').show();

            var promises = [];

            for (i = 0; i < numberOfPets; i++) {
              promises.push(adoptionInstance.getPet.call(i))
            }

            Promise.all(promises).then(function(result) {
              var petsRow = $('#petsRow');
              var petTemplate = $('#petTemplate');
              petsRow.empty();

              for (i = 0; i < numberOfPets; i++) {
                petTemplate.find('.panel-title')
                    .text(App.web3.toAscii(result[i][0]));
                petTemplate.find('img').attr(
                    'src',
                    App.images[Math.floor(Math.random() * App.images.length)]);
                petTemplate.find('.btn-adopt').attr('data-id', i);
                console.log(result[i]);
                if (String(App.web3.eth.coinbase) == result[i][1]) {
                  petTemplate.find('.btn-adopt')
                        .text('It\'s yours')
                        .attr('disabled', true);
                }
                else {
                  if (result[i][2] == EstadoPet.NOT_ADOPTED) {
                    petTemplate.find('.btn-adopt')
                          .text('Adopt')
                          .attr('disabled', false);
                  }
                  else if (result[i][2] == EstadoPet.WAITING_TO_ADOPT) {
                    petTemplate.find('.btn-adopt')
                          .text('Waiting answer')
                          .attr('disabled', true);
                  }
                  else {
                    petTemplate.find('.btn-adopt')
                          .text('Adopted')
                          .attr('disabled', true);
                  }
                }
                petsRow.append(petTemplate.html());
              }
            });
          } else {
            $('.btn-addPet').hide();
            $('#add-one').show();
          }
        })
        .catch(function(err) { console.log(err.message); });
  },

  addPet : function(event) {
    event.stopPropagation();
    var petName = $('#petName').val();

    var adoptionInstance;
    App.web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Adoption.deployed()
          .then(function(instance) {
            adoptionInstance = instance;

            return adoptionInstance.addPet(petName, {from : account});
          })
          .then(function(result) {
            $('#addPetModal').modal('hide');
            setTimeout(function() { return App.loadPets(); }, 3000);
          })
          .catch(function(err) { console.log(err.message); });
    });
  },

  adopt : function(event) {
    event.preventDefault();
    var donateValue = $('#donate').val();
    $('#donatePetModal').modal('hide');

    var petId = parseInt($(event.target).data('id'));

    App.web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var toSend = '0x193ec362b5040712347c7a44910b6011c95c3b4d';
      console.log(toSend);

      App.contracts.Adoption.deployed()
          .then(function(instance) {
            adoptionInstance = instance;
            // let data = {from: accounts[0], to: toSend, value: web3.toWei(donateValue, "ether")}
            let data = {from: accounts[0]};
            console.log(data);
            return adoptionInstance.adopt(petId, data);
          })
          .then(function(result) {
            console.log(result);
            setTimeout(function() { return App.loadPets(); }, 2000);
          })
          .catch(function(err) { console.log(err.message); });
    });

  }
};

$(function() { $(window).load(function() { App.initWeb3(); }); });
