pragma solidity ^0.4.17;

import "./Ownable.sol";

contract Adoption is Ownable {
    
    Pet[] pets;

    address owner;

    enum Status {
        AVAILABLE,
        PENDING_ADOPTION,
        ADOPTED
    }

    struct Pet {
        bytes name;
        Status status;
        uint256 donation;
        address adopter;
    }

    modifier validPet(uint petId){
        require(petId >= 0 && petId < pets.length);
        _;
    }

    modifier hasStatus(Pet pet, Status status){
        assert(pet.status == status);
        _;
    }

    // add a pet
    function addPet(bytes name) 
        onlyOwner
        public
        returns(uint)
    {
        Pet memory newPet = Pet(name, Status.AVAILABLE, uint256(0), address(0));
        pets.push(newPet);
        return pets.length - 1;
    }

    // Adopt a pet
    function adopt(uint petId) payable
        validPet(petId) 
        hasStatus(pets[petId], Status.AVAILABLE)
        public 
        returns (uint)
    {
        Pet storage pet = pets[petId];
        pet.adopter = msg.sender;
        pet.donation = msg.value;
        pet.status = Status.PENDING_ADOPTION;
        pets[petId] = pet;
        return petId;
    }

    // accept a peding adoption
    function acceptAdoption(uint petId) 
        onlyOwner
        validPet(petId)
        hasStatus(pets[petId], Status.PENDING_ADOPTION)
        public
        returns (uint)
    {
        Pet storage pet = pets[petId];
        if (pet.donation > 0) {
            owner.transfer(pet.donation);
        }
        pet.status = Status.ADOPTED;
        pets[petId] = pet;
        return petId;
    }

    // refuse a peding adoption
    function refuseAdoption(uint petId) 
        onlyOwner
        validPet(petId)
        hasStatus(pets[petId], Status.PENDING_ADOPTION)
        public
        returns (uint)
    {
        Pet storage pet = pets[petId];
        if (pet.donation > 0) {
            pet.adopter.transfer(pet.donation);
            pet.donation = uint256(0);
        }
        pet.adopter = address(0);
        pet.status = Status.AVAILABLE;
        pets[petId] = pet;
        return petId;
    }

    // Retrieve a pet
    function getPet(uint petId) 
        validPet(petId)
        public 
        view 
        returns(bytes, Status, uint256, address)
    {
        return (pets[petId].name, pets[petId].status, pets[petId].donation, pets[petId].adopter);
    }

    // Retrieving number of pets
    function getPetLength() public view returns (uint) {
        return pets.length;
    }

}
