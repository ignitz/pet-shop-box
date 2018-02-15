pragma solidity ^0.4.17;

contract Adoption {
    
    Pet[] pets;

    struct Pet {
        bytes name;
        address adopter;
    }

    function addPet(bytes name) returns(bool) {
        Pet memory newPet = Pet(name, address(0));
        pets.push(newPet);
        return true;
    }

    // Adopting a pet
    function adopt(uint petId) public returns (uint) {
        require(petId >= 0 && petId < pets.length);
        Pet storage pet = pets[petId];
        pet.adopter = msg.sender;
        return petId;
    }

    // Retrieving a pet
    function getPet(uint petId) public view returns(bytes, address) {
        return (pets[petId].name, pets[petId].adopter);
    }

}
