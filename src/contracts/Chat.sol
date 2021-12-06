// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Chat {
    uint256 public messagesCount = 0;
    uint256 public usersCount = 0;

    struct User {
        string name;
    }

    struct Message {
        uint256 id;
        address sender;
        string content;
        uint256 date; // in Unix timestammp
    }

    mapping(address => User) public users;
    mapping(uint256 => address) public addresses;
    mapping(uint256 => Message) public messages;
    mapping(address => bool) public userStatus;

    function userExists(address pubkey) private view returns (bool) {
        return bytes(users[pubkey].name).length > 0;
    }

    function createUser(string memory _name) public {
        require(!userExists(msg.sender), 'User already exists!');
        usersCount++;
        addresses[usersCount] = msg.sender;
        users[msg.sender] = User(_name);
    }

    function createMessage(string memory _content, uint256 _date) public {
        require(userExists(msg.sender), "Message sender doesn't exist!");
        messagesCount++;
        messages[messagesCount] = Message(
            messagesCount,
            msg.sender,
            _content,
            _date
        );
    }
}
