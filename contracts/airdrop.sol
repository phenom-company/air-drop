// Developed by Phenom.Team <info@phenom.team>
pragma solidity ^0.4.24;


/**
 * @title SafeMath
 * @dev Math operations with safety checks that revert on error
 */
library SafeMath {

  /**
  * @dev Multiplies two numbers, reverts on overflow.
  */
  function mul(uint256 _a, uint256 _b) internal pure returns (uint256) {
    // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
    // benefit is lost if 'b' is also tested.
    // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522
    if (_a == 0) {
      return 0;
    }

    uint256 c = _a * _b;
    require(c / _a == _b);

    return c;
  }

  /**
  * @dev Integer division of two numbers truncating the quotient, reverts on division by zero.
  */
  function div(uint256 _a, uint256 _b) internal pure returns (uint256) {
    require(_b > 0); // Solidity only automatically asserts when dividing by 0
    uint256 c = _a / _b;
    // assert(_a == _b * c + _a % _b); // There is no case in which this doesn't hold

    return c;
  }

  /**
  * @dev Subtracts two numbers, reverts on overflow (i.e. if subtrahend is greater than minuend).
  */
  function sub(uint256 _a, uint256 _b) internal pure returns (uint256) {
    require(_b <= _a);
    uint256 c = _a - _b;

    return c;
  }

  /**
  * @dev Adds two numbers, reverts on overflow.
  */
  function add(uint256 _a, uint256 _b) internal pure returns (uint256) {
    uint256 c = _a + _b;
    require(c >= _a);

    return c;
  }

  /**
  * @dev Divides two numbers and returns the remainder (unsigned integer modulo),
  * reverts when dividing by zero.
  */
  function mod(uint256 a, uint256 b) internal pure returns (uint256) {
    require(b != 0);
    
    return a % b;
  }
}


/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {
  address public owner;

  /**
   * @dev The Ownable constructor sets the original `owner` of the contract to the sender
   * account.
   */
  constructor() public {
    owner = msg.sender;
  }

  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }
}

/**
 * @title ERC20
 * @dev Standard of ERC20.
 */
contract ERC20 {
  using SafeMath for uint256;

	uint public totalSupply;
  string public nameOfToken;
  string public symbolOfToken;
  uint public decimals = 18;

	mapping(address => uint) balances;
	mapping(address => mapping (address => uint)) allowed;

	/**
  *   @dev Get balance of tokens holder
  *   @param _holder        holder's address
  *   @return               balance of investor
  */
  function balanceOf(address _holder) public view returns (uint) {
       return balances[_holder];
  }

 /**
  *   @dev Send coins
  *   throws on any error rather then return a false flag to minimize
  *   user errors
  *   @param _to           target address
  *   @param _amount       transfer amount
  *
  *   @return true if the transfer was successful 
  */
  function transfer(address _to, uint _amount) public returns (bool) {
      require(_to != address(0) && _to != address(this));
      balances[msg.sender] = balances[msg.sender].sub(_amount);     
      balances[_to] = balances[_to].add(_amount);
      emit Transfer(msg.sender, _to, _amount);
      return true;
  }

 /**
  *   @dev An account/contract attempts to get the coins
  *   throws on any error rather then return a false flag to minimize user errors
  *
  *   @param _from         source address
  *   @param _to           target address
  *   @param _amount       transfer amount
  *
  *   @return true if the transfer was successful
  */
  function transferFrom(address _from, address _to, uint _amount) public returns (bool) {
      require(_to != address(0) && _to != address(this));
      balances[_from] = balances[_from].sub(_amount);
      allowed[_from][msg.sender] = allowed[_from][msg.sender].sub(_amount);
      balances[_to] = balances[_to].add(_amount);
      emit Transfer(_from, _to, _amount);
      return true;
   }

 /**
  *   @dev Allows another account/contract to spend some tokens on its behalf
  *   throws on any error rather then return a false flag to minimize user errors
  *
  *   also, to minimize the risk of the approve/transferFrom attack vector
  *   approve has to be called twice in 2 separate transactions - once to
  *   change the allowance to 0 and secondly to change it to the new allowance
  *   value
  *
  *   @param _spender      approved address
  *   @param _amount       allowance amount
  *
  *   @return true if the approval was successful
  */
  function approve(address _spender, uint _amount) public returns (bool) {
      require((_amount == 0) || (allowed[msg.sender][_spender] == 0));
      allowed[msg.sender][_spender] = _amount;
      emit Approval(msg.sender, _spender, _amount);
      return true;
  }

 /**
  *   @dev Function to check the amount of tokens that an owner allowed to a spender.
  *
  *   @param _owner        the address which owns the funds
  *   @param _spender      the address which will spend the funds
  *
  *   @return              the amount of tokens still avaible for the spender
  */
  function allowance(address _owner, address _spender) public view returns (uint) {
      return allowed[_owner][_spender];
  }

	event Transfer(address indexed _from, address indexed _to, uint _value);
	event Approval(address indexed _owner, address indexed _spender, uint _value);
}

/**
 * @title StandardToken
 * @dev Token without the ability to release new ones.
 */
contract StandardToken is Ownable, ERC20 {
  using SafeMath for uint256;

  /**
  * @dev The Standard token constructor determines the total supply of tokens.
  */
  constructor(uint _totalSupply, string _nameOfToken, string _symbolOfToken) public {
    totalSupply = _totalSupply; //1000000
    balances[msg.sender] = _totalSupply;
    nameOfToken = _nameOfToken;
    symbolOfToken = _symbolOfToken;
    emit Transfer(address(0), msg.sender, _totalSupply);
  }

  /**
  * @dev Sends the tokens to a list of addresses.
  */
  function airdrop(address[] _adresses, uint256[] _values) public onlyOwner returns (bool) {
        require(_adresses.length == _values.length);
        for (uint256 i = 0; i < _adresses.length; i++) {
            require(transfer(_adresses[i], _values[i]));
        }
        return true;
  }

}

/**
 * @title MintableToken
 * @dev Token with the ability to release new ones.
 */
contract MintableToken is Ownable, ERC20 {
  using SafeMath for uint256;

  bool public mintingFinished = false;

 /**
  * @dev The Standard token constructor determines the total supply of tokens.
  */
  constructor(string _nameOfToken, string _symbolOfToken) public {
    nameOfToken = _nameOfToken;
    symbolOfToken = _symbolOfToken;
  }

  modifier canMint() {
    require(!mintingFinished);
    _;
  }

 /**
  *   @dev Function to mint tokens
  *   @param _holder       beneficiary address the tokens will be issued to
  *   @param _value        number of tokens to issue
  */
  function mintTokens(address _holder, uint _value) internal canMint onlyOwner returns (bool) {
     require(_value > 0);
     require(_holder != address(0));
     balances[_holder] = balances[_holder].add(_value);
     totalSupply = totalSupply.add(_value);
     emit Mint(_holder, _value);
     return true;
  }

  /**
  * @dev Sends the tokens to a list of addresses.
  */
  function mintableAirdrop(address[] _adresses, uint256[] _values) public onlyOwner returns (bool) {
        require(_adresses.length == _values.length);
        for (uint256 i = 0; i < _adresses.length; i++) {
            require(mintTokens(_adresses[i], _values[i]));
        }
        return true;
  }
 
 /**
  *   @dev Function finishes minting tokens.
  *
  *   @return              the status of issue
  */
  function finishMinting() public onlyOwner canMint returns (bool) {
    mintingFinished = true;
    emit MintFinished(now);
    return true;
  }

  event Mint(address indexed _to, uint256 _amount);
  event MintFinished(uint indexed _timestamp);
}

/**
 * @title TokenCreator
 * @dev Create new token ERC20.
 */
contract TokenCreator {
  using SafeMath for uint256;

  mapping(address => address[]) public tokens;
  
  function createStandardToken(uint _totalSupply, string _nameOfToken, string _symbolOfToken) public returns (address) {
    address token = new StandardToken(_totalSupply, _nameOfToken, _symbolOfToken);
    tokens[msg.sender].push(token);
    emit TokenCreated(msg.sender, token);
    return token;
  }

  function createMintableToken(string _nameOfToken, string _symbolOfToken) public returns (address) {
    address token = new MintableToken(_nameOfToken, _symbolOfToken);
    tokens[msg.sender].push(token);
    emit TokenCreated(msg.sender, token);
    return token;
  }

  event TokenCreated(address indexed _creator, address indexed _token);
}