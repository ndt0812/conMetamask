pragma solidity >=0.4.22  <0.9.0;

contract Faucet {

  uint256 public numOfFunders;
  mapping(uint256 => address) public lutFunders;
  mapping(address => bool) public funders;
  receive() external payable {}

  //addFunders(thêm người đã donate vào )
  function addFunds() external payable {
    address funder = msg.sender;

    if(!funders[funder]) {
      uint256 index = numOfFunders++;
      funders[funder] = true;
      lutFunders[index] = funder;
    }
  }
  //Rút(Withdraw)
  function withdraw(uint256 withdrawAmount) 
    external   
    limitWithdraw(withdrawAmount)
  {
    payable(msg.sender).transfer(withdrawAmount);
  }
  //Hiển thị số người đã donate(addressIndex)
  function getFundersIndex(uint256 index) external view returns (address) {
    return lutFunders[index];
  }
  //Lấy ra số người đã donate(getFunders)
  function getAllFunders() external view returns (address[] memory) {
    address[] memory _funders = new address[](numOfFunders);

    for(uint256 i = 0; i < numOfFunders;i++) {
      _funders[i] = lutFunders[i];
    }
    return _funders;
  }

  //so tien gioi han cho rut
  modifier limitWithdraw(uint256 withdrawAmount) {
    
    require(withdrawAmount <= 1000000000000000000, "Could not withdraw more than 1ETH ");
    _;
  }
}