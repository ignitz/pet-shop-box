pragma solidity ^ 0.4.17;

contract Adoption {
  enum EstadoPet {NOT_ADOPTED, WAITING_TO_ADOPT, ADOPTED}

  struct Pet {
    bytes name;
    address adopter;
    EstadoPet estadoPet;
  }

  Pet[] public pets;

  // adding a pet
  function addPet(bytes name) public returns(uint) {
    Pet memory newPet = Pet(name, msg.sender, EstadoPet.NOT_ADOPTED);
    pets.push(newPet);
    return pets.length - 1;
  }

  // Retrieving number of pets
  function getNumberOfPets() public view returns(uint) { return pets.length; }

  modifier validPet(uint petId) {
    require(petId >= 0 && petId < pets.length);
    _;
  }

  function getPet(uint petId)
      validPet(petId) public view returns(bytes, address, string) {
    string memory estado;
    if (pets[petId].estadoPet == EstadoPet.NOT_ADOPTED) {
      estado = "NOT_ADOPTED";
    }
    else if (pets[petId].estadoPet == EstadoPet.WAITING_TO_ADOPT) {
      estado = "WAITING_TO_ADOPT";
    }
    else {
      estado = "ADOPTED";
    }
    return (pets[petId].name, pets[petId].adopter, estado);
  }

  // Adopting a pet
  function adopt(uint petId) validPet(petId) public payable returns(uint) {
    /* require(pets[petId].estadoPet == EstadoPet.WAITING_TO_ADOPT); */
    Pet storage pet = pets[petId];
    pet.adopter = msg.sender;
    pet.estadoPet = EstadoPet.ADOPTED;
    pets[petId] = pet;
    /* require(pets[petId].estadoPet == EstadoPet.NOT_ADOPTED); */
    /* Pet memory newPet = Pet(pets[petId].name, msg.sender, EstadoPet.ADOPTED);
    delete pets[petId];
    pets[petId] = newPet; */
    return petId;
  }
}
