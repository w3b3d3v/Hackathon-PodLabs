//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import {ECDSA} from  "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract NftERC721 is ERC721, ERC721URIStorage, AccessControl, IERC721Receiver {

    struct Activity {
        uint256 tokenId;
        string status;
        string tokenUri;
        uint256 reward;
    }

    struct ApprovementInfo {
        uint256 tokenId;   
        uint256 amount;
        address to;
    }

    string constant private MSG_PREFIX = "\x19Ethereum Signed Message:\n32";

    uint256 public nonce;
    mapping(address => bool) private _isValidSigner;
    uint private _threshold;

    bool private _lock;
    modifier nonReentrant() {
        require(!_lock);
        _lock = true;
        _;
        _lock = false;
    }
    using SafeMath for uint256;
    using Counters for Counters.Counter;
    Counters.Counter public tokenIdCounter;    

    event NftMinted(bool isMinted);
    event NftTransferred(bool isMinted);

    address public owner;
    
    bytes32 public constant LEADER_ROLE = keccak256("LEADER_ROLE");
    bytes32 public constant MEMBER_ROLE = keccak256("MEMBER_ROLE");

    mapping(uint256 => Activity) private _activities;
    mapping(uint256 => bool) private _availableActivities;
    mapping(uint256 => address) private _activityOwners;



    constructor(string memory _collectionName, string memory _token) ERC721(_collectionName, _token) payable {
        _threshold = 2;
        owner = msg.sender;
        _grantRole(DEFAULT_ADMIN_ROLE, owner);
    }

    receive() external payable {}

    /**
     * encode struct -> encodePacked with nonce -> digest 
     *   -> append ETH signed msg -> digest Out
     */
    function approveActivity(address from, ApprovementInfo calldata _txn, uint256 _nonce, bytes[] calldata _multiSignature) external nonReentrant
    {
        _verifyMultiSignature(_txn, _nonce, _multiSignature);
        transferNFTWithETH(from, _txn.to, _txn.tokenId);
        //_transferETH(_txn);
    }

    function _verifyMultiSignature(ApprovementInfo calldata _txn, uint256 _nonce, bytes[] calldata _multiSignature) private
    {
        require(_nonce > nonce, "nonce already used");
        uint256 count = _multiSignature.length;
        require(count >= _threshold, "not enough signers");
        bytes32 digest = _processApprovementInfo(_txn, _nonce);

        address initSignerAddress; 
        for (uint256 i = 0; i < count; i++)
        {
            bytes memory signature = _multiSignature[i];
            address signerAddress = ECDSA.recover(digest, signature );
            require( signerAddress > initSignerAddress, "possible duplicate" );
            require(_isValidSigner[signerAddress], "not part of consortium");
            initSignerAddress = signerAddress;
        }
        nonce = _nonce;
    }

    function _processApprovementInfo(ApprovementInfo calldata _txn, uint256 _nonce) private pure returns(bytes32 _digest)
    {
        bytes memory encoded = abi.encode( _txn);
        _digest = keccak256(abi.encodePacked(encoded, _nonce));
        _digest = keccak256(abi.encodePacked(MSG_PREFIX, _digest));
    }

    function _transferETH (ApprovementInfo calldata _txn) private
    {
        (bool success, ) = payable(_txn.to).call{value: _txn.amount }("");
        require(success, "Transfer not fulfilled");
    }

    function grantRole(bytes32 role, address account) public virtual override onlyRole(getRoleAdmin(DEFAULT_ADMIN_ROLE)) {
        if (role == LEADER_ROLE)
            _isValidSigner[account] = true;
        _grantRole(role, account);
    }

    /**
     * @dev Member get the rights to work on in the NFT Activity Bounty
     *
     * Requirements:
     *
     * - Should be a Member
     * - Activity Should be avaiable
     *
     * Emits a {nftStatus} event.
     */
    function setActivityOwner(uint256 tokenId, address to) public {
        // Requer que NFT mintado esteja disponível
        require(_availableActivities[tokenId], "Activity not available!");
        // TODO: Requer q a data atual não tenha ultrapassado a data de expiração da atividade
        
        //atualiza status da atividade
        _activities[tokenId].status = "In Progress";

        //remove da lista de disponíveis 
        delete _availableActivities[tokenId]; 

        //atribui o membro como dono da atividade       
        _activityOwners[tokenId] = to;
    }

    /**
     * @dev Returns the activity owner of the `tokenId`. Does NOT revert if token doesn't exist
     */
    function activityOwnerOf(uint256 tokenId) public view virtual returns (address) {    
        address addr = _activityOwners[tokenId];
        return addr;
    }

    /**
     * @dev Return true if the activity is avilable
     */
    function isAvailableActivity(uint256 tokenId) public view virtual returns (bool) {    
        return _availableActivities[tokenId];
    }

    /**
     * @dev Return true if the activity is avilable
     */
    function getActivity(uint256 tokenId) public view virtual returns (Activity memory) {    
        return _activities[tokenId];
    }
    
    
    /**
     * @dev See {ipfsUri}
     * 
     * Requirements:
     *
     * - Should be a `LEADER_ROLE`
     *
     * Emits a {NftMinted} event.
     */
    function safeMint(address to, string memory ipfsUri) public payable virtual onlyRole(LEADER_ROLE) {
        require(msg.value >= 1, "Not enough ETH sent; check price!");
        uint256 tokenId = tokenIdCounter.current();
        tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, ipfsUri);

        //create activity
        Activity memory activity;
        activity.tokenId = tokenId;
        activity.tokenUri = ipfsUri;
        activity.status = "Available";
        activity.reward = msg.value;

        _availableActivities[tokenId] = true;
        _activities[tokenId] = activity;
        
        // EVENT
        emit NftMinted(true);
    }

    function transferNFTWithETH(address from, address _to, uint256 _tokenId) public payable {
        require(ownerOf(_tokenId) == from, "Are you really owner of this NFT?");
        require(msg.value > 0, "ETH amount must be greater than 0");

        transferFrom(msg.sender, _to, _tokenId);
        
        (bool sent, ) = payable(ownerOf(_tokenId)).call{value: msg.value}("");
        require(sent, "Failed to send ETH");
    }

    function transferFrom(address from, address to, uint256 tokenId) public virtual override onlyRole(DEFAULT_ADMIN_ROLE) {
        setApprovalForAll(to, true);
        _transfer(from, to, tokenId);

        // EVENT
        emit NftTransferred(true);
    }
    
    function checkAddressMember(address account) public view returns(bool) {
        return hasRole(MEMBER_ROLE, account);
    }

    function checkAddressLeader(address account) public view returns(bool) {
        return hasRole(LEADER_ROLE, account);
    }

    function BurnNft(uint256 tokenId) public onlyRole(LEADER_ROLE){
        return _burn(tokenId);
    }

    // The following functions is an override required by Solidity.
    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    // The following functions is an override required by Solidity.
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function lastMinted() public view returns (string memory) {
        uint256 tokenId = tokenIdCounter.current();
        if (tokenId == 0)
            return "";
        if (tokenId > 0)
            return tokenURI(tokenId - 1);
        else 
            return tokenURI(tokenId);
    }   

    function idCounter() public view returns (uint256) {
        return tokenIdCounter.current();
    }   

    
    // The following functions is an override required by Solidity.
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function onERC721Received(address, address, uint256, bytes calldata) external pure returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }

    function setApprovalForAll(address operator, bool approved) public virtual override {
        _setApprovalForAll(_msgSender(), operator, approved);
    }

}

