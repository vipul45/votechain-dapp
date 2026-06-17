// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title VoteChain
 * @dev Decentralized voting platform with time-bound polls
 */
contract VoteChain is ReentrancyGuard, Ownable {
    struct Poll {
        uint256 id;
        string question;
        string[] options;
        mapping(uint256 => uint256) voteCount;
        uint256 deadline;
        bool active;
        address creator;
        uint256 totalVotes;
    }

    uint256 public pollCount;
    mapping(uint256 => Poll) private polls;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    event PollCreated(
        uint256 indexed pollId,
        string question,
        address indexed creator,
        uint256 deadline
    );

    event VoteCast(
        uint256 indexed pollId,
        address indexed voter,
        uint256 optionIndex,
        uint256 timestamp
    );

    event PollClosed(uint256 indexed pollId);

    constructor() Ownable(msg.sender) {}

    function createPoll(
        string memory _question,
        string[] memory _options,
        uint256 _durationInSeconds
    ) external {
        require(_options.length >= 2 && _options.length <= 10, "Invalid number of options (2-10)");
        require(_durationInSeconds >= 1 hours && _durationInSeconds <= 30 days, "Duration must be between 1 hour and 30 days");

        pollCount++;
        Poll storage newPoll = polls[pollCount];
        
        newPoll.id = pollCount;
        newPoll.question = _question;
        newPoll.options = _options;
        newPoll.deadline = block.timestamp + _durationInSeconds;
        newPoll.active = true;
        newPoll.creator = msg.sender;

        emit PollCreated(pollCount, _question, msg.sender, newPoll.deadline);
    }

    function vote(uint256 _pollId, uint256 _optionIndex) external nonReentrant {
        Poll storage poll = polls[_pollId];
        
        require(poll.active, "Poll does not exist or is closed");
        require(block.timestamp < poll.deadline, "Voting period has ended");
        require(!hasVoted[_pollId][msg.sender], "You have already voted on this poll");
        require(_optionIndex < poll.options.length, "Invalid option index");

        poll.voteCount[_optionIndex]++;
        poll.totalVotes++;
        hasVoted[_pollId][msg.sender] = true;

        emit VoteCast(_pollId, msg.sender, _optionIndex, block.timestamp);
    }

    function closePoll(uint256 _pollId) external {
        Poll storage poll = polls[_pollId];
        require(poll.active, "Poll already closed");
        require(msg.sender == poll.creator || msg.sender == owner(), "Not authorized");

        poll.active = false;
        emit PollClosed(_pollId);
    }

    function getPoll(uint256 _pollId) external view returns (
        uint256 id,
        string memory question,
        string[] memory options,
        uint256 deadline,
        bool active,
        address creator,
        uint256 totalVotes
    ) {
        Poll storage poll = polls[_pollId];
        return (
            poll.id,
            poll.question,
            poll.options,
            poll.deadline,
            poll.active,
            poll.creator,
            poll.totalVotes
        );
    }

    function getPollResults(uint256 _pollId) external view returns (uint256[] memory) {
        Poll storage poll = polls[_pollId];
        uint256[] memory results = new uint256[](poll.options.length);
        
        for (uint256 i = 0; i < poll.options.length; i++) {
            results[i] = poll.voteCount[i];
        }
        return results;
    }

    function getUserVoteStatus(uint256 _pollId, address _user) external view returns (bool) {
        return hasVoted[_pollId][_user];
    }

    function getActivePolls() external view returns (uint256[] memory) {
        uint256[] memory activeIds = new uint256[](pollCount);
        uint256 count = 0;
        
        for (uint256 i = 1; i <= pollCount; i++) {
            if (polls[i].active && block.timestamp < polls[i].deadline) {
                activeIds[count] = i;
                count++;
            }
        }
        
        uint256[] memory result = new uint256[](count);
        for (uint256 j = 0; j < count; j++) {
            result[j] = activeIds[j];
        }
        return result;
    }
}