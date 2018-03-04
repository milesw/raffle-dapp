pragma solidity 0.4.19;

import "./SafeMath.sol";

// @dev Raffle smart contract - contains all business logic
contract SharesRaffle {
    using SafeMath for uint256;

    uint256 public openTime;
    uint256 public closeTime;
    uint256 public goal;
    address public escrowWallet;

    struct Entry {
      address buyer;
      uint256 cap;
    }
    Entry[] public entries;
    uint256 public totalWei;
    bool public isFinalized;
    address public raffleWinner;

    function SharesRaffle
        (
            uint256 _openTime,
            uint256 _closeTime,
            uint256 _goal,
            address _escrowWallet
        )
        public
    {
        require(
            _openTime != 0 &&
            _closeTime != 0 &&
            _closeTime > _openTime &&
            _goal != 0 &&
            _escrowWallet != address(0)
        );

        openTime = _openTime;
        closeTime = _closeTime;
        goal = _goal;
        escrowWallet = _escrowWallet;
    }

    modifier withinRafflePeriod() {
        require(now <= closeTime && now >= openTime);
        _;
    }

    function submitEntry()
        public
        withinRafflePeriod
        payable
    {
        require(!isFinalized && msg.value > 0);

        // Forward funds to escrow
        escrowWallet.transfer(msg.value);

        totalWei += msg.value;
        entries.push(Entry({buyer: msg.sender, cap: totalWei - 1}));

        if (totalWei >= goal) {
          finalize();
        }
    }

    function finalize() internal {
        if (totalWei > 0) {
            uint256 winningNumber = drawRandomNumber();
            raffleWinner = findWinner(winningNumber);
        }
        isFinalized = true;
    }

    function findWinner(uint256 winningNumber) internal view returns(address) {
        uint256 range = entries.length / 2;
        uint256 currentIndex = range;
        while (true) {
            if (currentIndex == 0) {
                break;
            } else if (entries[currentIndex].cap < winningNumber) {
                // Jump right
                currentIndex += range / 2;
            } else {
                if (entries[currentIndex - 1].cap < winningNumber) {
                    break;
                } else {
                    // Jump left
                    currentIndex -= range / 2;
                }
            }
            range /= 2;
        }
        return entries[currentIndex].buyer;
    }

    function finalizeByTime() public {
        require(!isFinalized && now > closeTime);
        finalize();
    }

    function finalizeByGoalReached() public {
        require(!isFinalized && totalWei >= goal);
        finalize();
    }

    function drawRandomNumber() internal pure returns(uint256) {
        // draw number from 0 to totalWei - 1
        // we don't know how yet
        return 30;
    }
}
