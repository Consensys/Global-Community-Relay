pragma solidity 0.4.24;

import "chainlink/contracts/ChainlinkClient.sol";

interface ForexTradeFactoryContract {
    function registerCounterparty();
}

interface ERC20 {
  function balanceOf(address) returns(uint);
}

// add safemath
contract ForexTrade is ChainlinkClient {
    uint256 private constant ORACLE_PAYMENT = LINK / 10;
    int256 public rate;

    uint256 LEVERAGE = 10;

    address LINK_TOKEN = 0x4a3FBbB385b5eFEB4BC84a25AaADcD644Bd09721;

    /* Core */
    string[2] currencies; // ["USD", "EUR"]
    address[2] counterparties; // ["0xAlice", "0xBob"]
    // Alice is betting on USD gaining value

    bytes32 jobId;
    int256 times = 10000; // multiply oracle result by 10,000: 1.345% = 13450;
    bool ratesInitiated = false;
    int initialRate;

    uint256[2] accountCollateral; // initial values >= notional / LEVERAGE

    uint256 notional; // wei
    uint256 tradePeriodStart; // timestamp
    uint256 tradePeriodEnd; // timestamp

    event TradeInitiated(address indexed initiator);
    event TradeAccepted(address indexed acceptor);
    event TradeRepriced(address indexed sender, int oldRate, int newRate);
    event TradeLiquidated(address indexed liquidated, uint timestamp);

    // ForexTradeFactoryContract factoryContract;
    address factoryAddress;

    constructor(
        address _link,
        address _oracle,
        string _currencyA,
        string _currencyB,
        bytes32 _jobId,
        address _factoryAddress
    ) public {
        setChainlinkToken(_link);
        setChainlinkOracle(_oracle);
        currencies[0] = _currencyA;
        currencies[1] = _currencyB;
        counterparties[0] = tx.origin;
        jobId = _jobId;

        factoryAddress = _factoryAddress;
        // factoryContract = ForexTradeFactoryContract(
        //     _factoryAddress
        // );
    }

    /* Chainlink functions */
    function getChainlinkToken() public view returns (address) {
        return chainlinkTokenAddress();
    }

    function getOracle() public view returns (address) {
        return chainlinkOracleAddress();
    }

    function createRequest() public returns (bytes32) {
        return
            createRequestTo(
                getOracle(),
                jobId,
                currencies[0],
                currencies[1],
                times
            );
    }

    function createRequestTo(
        address _oracle,
        bytes32 _jobId,
        string _baseCurrency, // USD
        string _symbol, // EUR
        int256 _times
    ) public returns (bytes32 requestId) {
        Chainlink.Request memory req = buildChainlinkRequest(
            _jobId,
            this,
            this.fulfill.selector
        );
        req.add("copyPath", getCopyPath());
        req.add("base", _baseCurrency);
        req.add("symbols", _symbol);
        req.addInt("times", _times);
        requestId = sendChainlinkRequestTo(_oracle, req, ORACLE_PAYMENT);
    }

    function getCopyPath() internal view returns (string) {
        return string(abi.encodePacked("rates.", currencies[1]));
    }

    function fulfill(bytes32 _requestId, int256 _rate)
        public
        recordChainlinkFulfillment(_requestId)
    {
        if (!ratesInitiated) {
            initialRate = _rate;
            ratesInitiated = true;
        } else {
            // (oldRate, newRate)
            runRepricing(rate, _rate);
        }
        rate = _rate;
    }

    function runRepricing(int256 oldRate, int256 newRate) private {
        // EXAMPLE:
        // currencies = ["USD", "EUR"]
        // counterparties = ["addr0", "addr1"]
        // notional = 1,000,000
        // accountCollateral pre = [200000, 200000]
        // oldRate: USD/EUR = 0.9000 * 10000 = 9000
        // newRate: USD/EUR = 0.9200 * 10000 = 9200 (USD appreciated in this ex.)

        uint256 changeInRate;
        uint256 changeInValue;

        if (oldRate < newRate) {
            // currencies[0] is the currency that appreciated in this condition
            changeInRate = uint256(newRate) - uint256(oldRate); // 9200 - 9000 = 200
            changeInValue = (notional * changeInRate) / uint256(times); // 1000000 * 200 / 10000 = 20000
            accountCollateral[0] = accountCollateral[0] + changeInValue;
            accountCollateral[1] = accountCollateral[1] - changeInValue;
            /* accountCollateral post TX = [220000, 180000] */

            if(accountCollateral[1] < notional / (LEVERAGE * 2)){ // less than 5%
              liquidate(1);
            }
        } else if (oldRate == newRate) {
            return;
        } else {
            changeInRate = uint256(oldRate) - uint256(newRate);
            changeInValue = (notional * changeInRate) / uint256(times);
            accountCollateral[0] = accountCollateral[0] - changeInValue;
            accountCollateral[1] = accountCollateral[1] + changeInValue;

            if(accountCollateral[0] < notional / (LEVERAGE * 2)){
              liquidate(0);
            }
        }

        emit TradeRepriced(msg.sender, oldRate, newRate);
    }

    function liquidate(uint liquidatedAccount) private {
        uint collateralValue;

        if(liquidatedAccount == 1){
          collateralValue = accountCollateral[1];
          accountCollateral[1] = 0;
          accountCollateral[0] = accountCollateral[0] + collateralValue;
        } else {
          collateralValue = accountCollateral[0];
          accountCollateral[0] = 0;
          accountCollateral[1] = accountCollateral[1] + collateralValue;
        }

        tradePeriodEnd = block.timestamp;
        TradeLiquidated(counterparties[liquidatedAccount], block.timestamp);
    }

    function initiateTrade(uint256 _notional, uint256 _tradePeriodEnd)
        public
        payable
        isNotInitiated
    {
        require(msg.value >= _notional / LEVERAGE, "Insufficient collateral");

        counterparties[0] = msg.sender;
        accountCollateral[0] = msg.value;
        notional = _notional;

        tradePeriodEnd = _tradePeriodEnd;
        emit TradeInitiated(msg.sender);
    }

    modifier isNotInitiated() {
        require(notional == 0, "Swap already initiated");
        _;
    }

    modifier isInitiated() {
        require(notional > 0, "Swap not yet initiated");
        _;
    }

    // Contract must be funded with LINK for this function to run
    function acceptTrade() public payable isInitiated {
        require(msg.value >= notional / LEVERAGE, "Insufficient collateral");

        counterparties[1] = msg.sender;
        accountCollateral[1] = msg.value;

        tradePeriodStart = block.timestamp;
        ForexTradeFactoryContract(factoryAddress).registerCounterparty();

        emit TradeAccepted(msg.sender);
        updateRates();
    }

    // Contract must be funded with LINK for this function to run
    function updateRates() public {
        require(tradePeriodStart > 0, "Trade yet to begin");
        createRequest();
    }

    function getNotional() view returns (uint256 _notional) {
        return notional;
    }

    function getTrade()
        view
        returns (
            uint256 _notional,
            string _currencyA,
            string _currencyB,
            address[2] _counterparties,
            uint256 _tradePeriodEnd,
            uint256 _tradePeriodStart,
            int256 _rate,
            int256 _initialRate,
            uint256[2] _accountCollateral
        )
    {
        return (
            notional,
            currencies[0],
            currencies[1],
            counterparties,
            tradePeriodEnd,
            tradePeriodStart,
            rate,
            initialRate,
            accountCollateral
        );
    }

    function getLinkBalance() view returns (uint _balance){
      return ERC20(LINK_TOKEN).balanceOf(address(this));
    }
}
