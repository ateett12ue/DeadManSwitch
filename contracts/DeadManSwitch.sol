//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

contract DeadManSwitch {
    address payable immutable SECURITY_ADDRESS;
    address immutable OWNERS_ADDRESS;
    
    uint256 public lastBlockNumber;

    event StillAlive();
    event DeadAlready();
    
    constructor(address _securityAddress) {
        SECURITY_ADDRESS = payable(_securityAddress);
        OWNERS_ADDRESS = msg.sender;
        lastBlockNumber = block.number;
    }

    modifier onlyOwner() {
        require(msg.sender == OWNERS_ADDRESS, "Not Owner");
        _;
    }

    modifier deadManSwitch() {
        require(address(this).balance > 0 && block.number - lastBlockNumber > 10);
        _;
    }

    function still_alive() public onlyOwner{
        lastBlockNumber = block.number;
        emit StillAlive();
    }

    function transferFunds() public deadManSwitch{
        uint fundsAmount = address(this).balance;
        (bool success, ) = SECURITY_ADDRESS.call{value: fundsAmount}("");
        require(success, "failed to send funds");
        emit DeadAlready();

    }
}