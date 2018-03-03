pragma solidity 0.4.19;

import "./SafeMath.sol";
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

    function Raffle
        (
            uint256 _openTime,
            uint256 _closeTime,
            uint256 _ticketPrice,
            uint256 _goal,
            address _escrowWallet
        )
        public
    {
        require(
            _openTime != 0 &&
            _closeTime != 0 &&
            _closeTime > _openTime &&
            _ticketPrice != 0 &&
            _goal != 0 &&
            _escrowWallet != address(0)
        );

        openTime = _openTime;
        closeTime = _closeTime;
        ticketPrice = _ticketPrice;
        goal = _goal;
        escrowWallet = _escrowWallet;
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
    }

    function weiRaised() public view returns(uint256) {
        return ticketHolders.length.mul(ticketPrice);
    }

    function finalizeRaffleByTime() public {
        require(!isFinalized && now > closeTime);

        if (ticketsSold() > 0) {
            uint256 winningNumber = drawRandomNumber();
            raffleWinner = ticketHolders[winningNumber];
        }

        isFinalized = true;
    }

    function finalizeRaffleByGoalReached() public onlyOwner {
        require(!isFinalized && weiRaised() >= goal);

        if (ticketsSold() > 0) {
            uint256 winningNumber = drawRandomNumber();
            raffleWinner = ticketHolders[winningNumber];
        }

        isFinalized = true;
    }

    function ticketsSold() public view returns(uint256) {
        return ticketHolders.length;
    }

    function allTicketHolders() public view returns(address[]) {
        return ticketHolders;
    }

    function drawRandomNumber() internal pure returns(uint256) {
        // we don't know yet
        return 2;
    }

}
