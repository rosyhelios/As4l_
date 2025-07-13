// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

contract SecureUSDCTransfer {
    IERC20 public usdcToken;
    address public owner;
    mapping(address => uint256) public amountsSent;
    mapping(address => bool) public isWhitelisted;
    address[] public whitelistedAddresses;
    uint256 public totalFeesCollected;

    event Transfer(
        address indexed sender,
        address indexed recipient,
        uint256 amount,
        uint256 fee,
        uint256 timestamp
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    modifier onlyWhitelisted() {
        require(isWhitelisted[msg.sender], "Not whitelisted");
        _;
    }

    constructor(address _usdcTokenAddress) {
        usdcToken = IERC20(_usdcTokenAddress);
        owner = msg.sender;
    }

    function whitelistAddress(address addr) external onlyOwner {
        require(whitelistedAddresses.length < 3, "Whitelist limit reached");
        require(!isWhitelisted[addr], "Address already whitelisted");

        isWhitelisted[addr] = true;
        whitelistedAddresses.push(addr);
    }

    function removeWhitelistedAddress(address addr) external onlyOwner {
        require(isWhitelisted[addr], "Not whitelisted");

        isWhitelisted[addr] = false;

        for (uint256 i = 0; i < whitelistedAddresses.length; i++) {
            if (whitelistedAddresses[i] == addr) {
                whitelistedAddresses[i] = whitelistedAddresses[whitelistedAddresses.length - 1];
                whitelistedAddresses.pop();
                break;
            }
        }
    }

    function transferUSDC(address recipient, uint256 amount) external onlyWhitelisted {
        require(amount > 0, "Amount must be greater than zero");

        uint256 fee = (amount * 5) / 1000;
        uint256 amountAfterFee = amount - fee;

        require(usdcToken.transferFrom(msg.sender, recipient, amountAfterFee), "Transfer failed");
        require(usdcToken.transferFrom(msg.sender, owner, fee), "Fee transfer failed");

        amountsSent[msg.sender] += amountAfterFee;
        totalFeesCollected += fee;

        emit Transfer(msg.sender, recipient, amountAfterFee, fee, block.timestamp);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address");
        owner = newOwner;
    }

    function getWhitelistedAddresses() external view returns (address[] memory) {
        return whitelistedAddresses;
    }

    function getTotalFeesCollected() external view returns (uint256) {
        return totalFeesCollected;
    }
}
