// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Chat {
    uint256 public messagesCount = 0;

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
    mapping(uint256 => Message) public messages;

    function userExists(address pubkey) private view returns (bool) {
        return bytes(users[pubkey].name).length > 0;
    }

    function createUser(string memory _name) public {
        require(!userExists(msg.sender));
        users[msg.sender] = User(_name);
    }

    // function getUsername(address pubkey) public view returns (string memory) {
    //     require(userExists(msg.sender));
    //     return users[pubkey].name;
    // }

    function createMessage(string memory _content, uint256 _date) public {
        require(userExists(msg.sender));
        messagesCount++;
        messages[messagesCount] = Message(
            messagesCount,
            msg.sender,
            _content,
            _date
        );
    }
}
