// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Web3DevMarketplace is AccessControl, ERC721, ERC721URIStorage, ERC721Enumerable {

    using Counters for Counters.Counter;
    using SafeMath for uint256;
    Counters.Counter private _tokenIdCounter;

    uint256 private _balance;
    bytes32 public constant LEADER_ROLE = keccak256("LEADER_ROLE");
    bytes32 public constant MEMBER_ROLE = keccak256("MEMBER_ROLE");

    struct Activity {
        uint256 id;
        string title;
        string description;
        uint256 reward;
        address createdBy;
        address assignedTo;
        uint256 requiredApprovals;
        uint256 approvalsReceived;
        Status status;
    }

    enum Status { Created, InProgress, Completed, Approved, Rejected, Deleted }

    mapping(uint256 => Activity) public activities;
    mapping(address => uint256[]) public userActivities;
    mapping(uint256 => address[]) public approvers;
    mapping(uint256 => uint256) private _lockedBalance;

    event ActivityCreated(uint256 indexed activityId);
    event ActivityAssigned(uint256 indexed activityId, address indexed member);
    event ActivityCompleted(uint256 indexed activityId);
    event ActivityApproved(uint256 indexed activityId);
    event ActivityRejected(uint256 indexed activityId);
    event ActivityDeleted(uint256 indexed activityId);

    constructor() ERC721("Web3DevActivity", "WDAC") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(LEADER_ROLE, msg.sender);
    }

    modifier onlyLeader() {
        require(hasRole(LEADER_ROLE, msg.sender), "Caller is not a leader");
        _;
    }

    modifier onlyMember() {
        require(hasRole(MEMBER_ROLE, msg.sender), "Caller is not a member");
        _;
    }

    function getBalance() public view returns (uint256) {
        return _balance;
    }

    function createActivity(string memory title, string memory description, uint256 reward, uint256 requiredApprovals, string memory tokenUri) public payable onlyLeader returns (uint256) {
        require(msg.value > 0, "Deposit amount must be greater than 0");

        _tokenIdCounter.increment();

        uint256 newActivityId = _tokenIdCounter.current();
        _mint(msg.sender, newActivityId);
        _setTokenURI(newActivityId, tokenUri);

        Activity memory newActivity = Activity({
            id: newActivityId,
            title: title,
            description: description,
            reward: reward,
            createdBy: msg.sender,
            assignedTo: address(0),
            requiredApprovals: requiredApprovals,
            approvalsReceived: 0,
            status: Status.Created
        });

        activities[newActivityId] = newActivity;
        userActivities[msg.sender].push(newActivityId);
        _lockedBalance[newActivityId] += msg.value;

        require(msg.value == _lockedBalance[newActivityId], "Locked balance doesn't match activity reward");
        emit ActivityCreated(newActivityId);
        return newActivityId;
    }

    function getTokenCount() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    function assignActivity(uint256 activityId) public onlyMember {
        require(activities[activityId].status == Status.Created, "Activity not available for assignment");
        activities[activityId].assignedTo = msg.sender;
        activities[activityId].status = Status.InProgress;
        userActivities[msg.sender].push(activityId);
        emit ActivityAssigned(activityId, msg.sender);
    }

    function completeActivity(uint256 activityId) public onlyMember {
        require(activities[activityId].status == Status.InProgress, "Activity not in progress");
        require(activities[activityId].assignedTo == msg.sender, "Caller did not claim this activity");
        activities[activityId].status = Status.Completed;
        emit ActivityCompleted(activityId);
    }

    function approveActivity(uint256 activityId) public onlyLeader {
        require(activities[activityId].status == Status.Completed, "Activity not completed");
        require(!isApprover(activityId, msg.sender), "Caller has already approved this activity");

        activities[activityId].approvalsReceived++;

        if (activities[activityId].approvalsReceived >= activities[activityId].requiredApprovals) {
            activities[activityId].status = Status.Approved;
            approvers[activityId].push(msg.sender);
            uint256 reward = _lockedBalance[activityId];
            address payable member = payable(activities[activityId].assignedTo);
            member.transfer(reward);
            _lockedBalance[activityId] = 0;
            _burn(activityId);
        } else {
            approvers[activityId].push(msg.sender);
            emit ActivityApproved(activityId);
        }
    }

    function rejectActivity(uint256 activityId) public onlyLeader {
        require(activities[activityId].status == Status.Completed, "Activity not completed");
        require(!isApprover(activityId, msg.sender), "Caller has already rejected this activity");
        activities[activityId].status = Status.Rejected;
        approvers[activityId].push(msg.sender);
        emit ActivityRejected(activityId);
    }

    function deleteActivity(uint256 activityId) public onlyLeader {
        require(activities[activityId].status != Status.InProgress, "Activity in progress");
        require(activities[activityId].status != Status.Completed, "Activity completed");
        activities[activityId].status = Status.Deleted;
        _burn(activityId);
        emit ActivityDeleted(activityId);
    }

    function isApprover(uint256 activityId, address leader) public view returns (bool) {
        address[] memory activityApprovers = approvers[activityId];
        for (uint256 i = 0; i < activityApprovers.length; i++) {
            if (activityApprovers[i] == leader) {
                return true;
            }
        }
        return false;
    }

    function getUserActivities(address user) public view returns (uint256[] memory) {
        return userActivities[user];
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}