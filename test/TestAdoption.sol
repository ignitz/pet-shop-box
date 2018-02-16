pragma solidity ^0.4.17;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Adoption.sol";

contract TestAdoption {
    Adoption adoption = Adoption(DeployedAddresses.Adoption());
    
    // Testing the addPet() function
    function testUserCanAddPet() public {
        uint returnedId = adoption.addPet("Dog Test");

        uint expected = 0;

        Assert.equal(returnedId, expected, "pet ID 0 should be recorded.");
    }

    // Testing the adopt() function
    function testUserCanAdoptPet() public {
        uint returnedId = adoption.adopt(0);

        uint expected = 0;

        Assert.equal(returnedId, expected, "Adoption of pet ID 0 should be recorded.");
    }

    // Testing retrieval of a pet
    function testGetPetByPetId() public {
        // Expected owner is this contract
        address expected = this;

        var (,adopter) = adoption.getPet(0);

        Assert.equal(adopter, expected, "Owner of pet ID 0 should be recorded.");
    }

    // Testing the getPetLength() function
    function testGetPetLength() public {
        uint expectedPetLength = 1;

        uint petLength = adoption.getPetLength();
        
        Assert.equal(petLength, expectedPetLength, "Number of pets should be 1.");
    }
    
}
