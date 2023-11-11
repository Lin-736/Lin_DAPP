// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "./MyERC721.sol";

contract BorrowYourCar is ERC721 {
   
   MyERC721 public myERC721; // 彩票相关的代币合约
   address public manager; // 管理员

   event CarBorrowed(uint256 carTokenId, address borrower, uint256 startTime, uint256 duration);
   struct Car {
        address owner;
        address borrower;
        uint256 borrowUntil;
    }

    modifier onlyManager {
        require(msg.sender == manager);
        nextTokenId=1;
        _;
    }

    mapping(uint256 => Car) public cars;
    uint256 public nextTokenId;

    constructor() ERC721("MyCarToken", "CAR") {
       manager=msg.sender;
    }  

    function mintCarNFT() external onlyManager {
       uint256 tokenId = nextTokenId;
       _safeMint(msg.sender, tokenId); // 创建NFT并将其分配给管理员
       nextTokenId+=1;
    
    // 设置汽车元数据
    cars[tokenId] = Car({
        owner: msg.sender,
        borrower: address(0), // 初始时借用者为空
        borrowUntil: 0 // 初始时借用截止时间为0
    });

    // 可以选择将汽车的详细信息存储在一个合适的地方，这里简单存储在事件中
    emit CarBorrowed(tokenId, msg.sender, 0, 0);
    }
    //----------------------------------------------------------------------------------------------
    function distributeCarNFT(address recipient) external onlyManager {
    require(nextTokenId > 0, "No available car NFT to distribute");

    uint256 tokenId = nextTokenId - 1; // 分发最新的汽车 NFT
    _safeTransfer(msg.sender, recipient, tokenId, "");

    // 更新汽车状态，将分发的汽车 NFT 的 owner 设置为 recipient
    cars[tokenId].owner = recipient;

    // 可以选择在事件中记录分发汽车 NFT 的信息
    emit CarBorrowed(tokenId, recipient, 0, 0);
    }
    
    //------------------------------------------------------------------------------------------------
    function borrowCar(uint256 tokenId, uint256 duration) external {
    // 确保 tokenId 是有效的汽车 NFT
    require(tokenId<nextTokenId, "Invalid car token");

    Car storage car = cars[tokenId];
    require(car.borrower == address(0), "Car is already borrowed");

    // 更新汽车状态
    car.borrower = msg.sender;
    car.borrowUntil = block.timestamp + duration;

    // 发送借车事件
    emit CarBorrowed(tokenId, msg.sender, block.timestamp, duration);
    }
    //--------------------------------------------------------------------------------------------------
    function getUserCars(address user) external view returns (uint256[] memory) {
    uint256 userCarCount = 0;

    // 遍历所有汽车，统计用户拥有的汽车数量
    for (uint256 i = 0; i < nextTokenId; i++) {
        if (ownerOf(i) == user) {
            userCarCount++;
        }
    }

    // 创建包含用户拥有的汽车 tokenId 的数组
    uint256[] memory userCars = new uint256[](userCarCount);
    uint256 index = 0;

    // 遍历所有汽车，将用户拥有的汽车 tokenId 添加到数组中
    for (uint256 i = 0; i < nextTokenId; i++) {
        if (ownerOf(i) == user) {
            userCars[index] = i;
            index++;
        }
    }

    return userCars;
}
    //---------------------------------------------------------------------------------------------------------
    function getAvailableCars() external view returns (uint256[] memory) {
    uint256 availableCarCount = 0;

    // 遍历所有汽车，统计当前没有被借用的汽车数量
    for (uint256 i = 0; i < nextTokenId; i++) {
        if (cars[i].borrower == address(0)) {
            availableCarCount++;
        }
    }

    // 创建包含当前没有被借用的汽车 tokenId 的数组
    uint256[] memory availableCars = new uint256[](availableCarCount);
    uint256 index = 0;

    // 遍历所有汽车，将当前没有被借用的汽车 tokenId 添加到数组中
    for (uint256 i = 0; i < nextTokenId; i++) {
        if (cars[i].borrower == address(0)) {
            availableCars[index] = i;
            index++;
        }
    }

    return availableCars;
    }
    //-----------------------------------------------------------------------------------------------------------------
    function getCarStatus(uint256 tokenId) external view returns (address owner, address borrower, uint256 borrowUntil) {
    require(tokenId < nextTokenId, "Invalid car token");

    Car storage car = cars[tokenId];
    
    owner = ownerOf(tokenId);
    borrower = car.borrower;
    borrowUntil = car.borrowUntil;
    }

}
