pragma solidity 0.4.19;

import "./SafeMath.sol";
import "./DrawRandomNumber.sol";
import "./Ownable.sol";


// @dev Raffle smart contract - contains all business logic
contract Raffle is Ownable {
    using SafeMath for uint256;

    uint256 public openTime;
    uint256 public closeTime;
    uint256 public ticketPrice;
    uint256 public goal;
    address public escrowWallet;

    address[] public ticketHolders;
    bool public isFinalized;
    address public raffleWinner;
    bytes32 public oraclizeQueryId;

    DrawRandomNumber public drawRandomNumber;

    function Raffle
        (
            uint256 _openTime,
            uint256 _closeTime,
            uint256 _ticketPrice,
            uint256 _goal,
            address _escrowWallet,
            address _drawRandomNumber
        )
        public
    {
        require(
            _openTime != 0 &&
            _closeTime != 0 &&
            _closeTime > _openTime &&
            _ticketPrice != 0 &&
            _goal != 0 &&
            _escrowWallet != address(0) &&
            _drawRandomNumber != address(0)
        );

        openTime = _openTime;
        closeTime = _closeTime;
        ticketPrice = _ticketPrice;
        goal = _goal;
        escrowWallet = _escrowWallet;

        drawRandomNumber = DrawRandomNumber(_drawRandomNumber);
    }

    modifier withinRafflePeriod() {
        require(now <= closeTime && now >= openTime);
        _;
    }

    function purchaseTickets(uint256 numberOfTickets)
        public
        withinRafflePeriod
        payable
    {
        require(msg.value == numberOfTickets.mul(ticketPrice));
        require(!isFinalized && msg.value > 0);

        for (uint256 i; i < numberOfTickets; i++) {
            ticketHolders.push(msg.sender);
        }

        //forward funds to escrow
        escrowWallet.transfer(msg.value);

        if (weiRaised() >= goal) {
          finalize();
        }
    }

    function weiRaised() public view returns(uint256) {
        return ticketHolders.length.mul(ticketPrice);
    }

    function requestRandomNumberByTime() public onlyOwner {
        require(!isFinalized && now > closeTime);

        if (ticketsSold() > 0) {
            requestRandomNumber();
        }
    }

    function requestRandomNumberByGoalReached() public onlyOwner {
        require(!isFinalized && weiRaised() >= goal);

        if (ticketsSold() > 0) {
            requestRandomNumber();
        }
    }

    function ticketsSold() public view returns(uint256) {
        return ticketHolders.length;
    }

    function allTicketHolders() public view returns(address[]) {
        return ticketHolders;
    }

    function findWinnerAndFinalize() public onlyOwner {
        uint256 randomNumber = drawRandomNumber.randomNumbers(oraclizeQueryId);
        require(!isFinalized && randomNumber != 0);

        // random number returns between 1 and ticketsSold but the array is from 0 to ticketsSold - 1
        raffleWinner = ticketHolders[randomNumber - 1];
        isFinalized = true;
    }

    function requestRandomNumber() internal {
        oraclizeQueryId = drawRandomNumber.generateRandomNum(ticketsSold());
    }

}
