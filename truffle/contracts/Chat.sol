// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Chat {
    uint256 public messagesCount = 0;
    uint256 public usersCount = 0;

    struct User {
        uint256 id;
        string name;
    }

    struct Message {
        uint256 id;
        string content;
        uint256 date;
    }

    mapping(uint256 => User) public users;
    mapping(uint256 => Message) public messages;

    constructor() {
        createUser("user001");
        createMessage("message001", 0);
    }

    function createUser(string memory _name) public {
        usersCount++;
        users[usersCount] = User(usersCount, _name);
    }

    function createMessage(string memory _content, uint256 _date) public {
        messagesCount++;
        messages[messagesCount] = Message(messagesCount, _content, _date);
    }
}