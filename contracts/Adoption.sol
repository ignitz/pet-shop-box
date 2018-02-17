pragma solidity ^0.4.17;

contract Adoption {
    
    Pet[] public pets;

    struct Pet {
        bytes name;
        address adopter;
    }

    modifier validPet(uint petId) {
        require(petId >= 0 && petId < pets.length);
        _;
    }

    // adding a pet
    function addPet(bytes name) public returns(uint) {
        Pet memory newPet = Pet(name, address(0));
        pets.push(newPet);
        return pets.length - 1;
    }

    // Retrieving number of pets
    function getNumberOfPets() public view returns (uint) {
        return pets.length;
    }

     // Retrieving a pet
    function getPet(uint petId) 
        validPet(petId)
        public 
        view 
        returns(bytes, address) 
    {
        return (pets[petId].name, pets[petId].adopter);
    }

    // Adopting a pet
    function adopt(uint petId) 
        validPet(petId)
        public 
        returns (uint) 
    {
        Pet storage pet = pets[petId];
        pet.adopter = msg.sender;
        pets[petId] = pet;
        return petId;
    }

}
