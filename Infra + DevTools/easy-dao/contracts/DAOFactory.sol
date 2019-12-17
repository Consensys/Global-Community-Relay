pragma solidity 0.5.0;

import "./EasyDAO.sol";

contract DAOFactory {
    mapping(address => address[]) userDAOs; // user address => dao addresses
    mapping(address => address[]) daoUsers; // dao address => user addresses

    mapping(address => bool) contractExists;

    event DAOGenerated(address indexed creator, address daoContract);

    function createDAO(
        string memory _daoType,
        uint256 _entryFee,
        uint256 _votingPeriod
    ) public payable {
        require(msg.value == _entryFee, "Initiate with correct value");

        EasyDAO newDAO = new EasyDAO(
            _daoType,
            _entryFee,
            _votingPeriod,
            address(this)
        );
        address newDAOAddress = address(newDAO);

        address payable newContractAddress = address(uint160(newDAOAddress));
        newContractAddress.transfer(msg.value);

        userDAOs[msg.sender].push(newDAOAddress);
        daoUsers[newDAOAddress].push(msg.sender);

        contractExists[newDAOAddress] = true;
        emit DAOGenerated(msg.sender, newDAOAddress);
    }

    /* called from an EasyDAO contract */
    function joinDAO() public {
        require(
            contractExists[msg.sender],
            "Caller must be an EasyDAO contract"
        );
        userDAOs[tx.origin].push(msg.sender); // push contract into user bucket
        daoUsers[msg.sender].push(tx.origin); // push user into contract bucket
    }

    function getUserDAOs(address _user)
        public
        view
        returns (address[] memory daos)
    {
        return userDAOs[_user];
    }

    function getDAOUsers(address _dao)
        public
        view
        returns (address[] memory users)
    {
        return daoUsers[_dao];
    }
}
