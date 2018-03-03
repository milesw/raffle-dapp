const Raffle = artifacts.require('./Raffle.sol');

const BigNumber = web3.BigNumber;
const dayInSecs = 86400;

const openTime = web3.eth.getBlock('latest').timestamp + 20; // twenty secs in the future
const closeTime = openTime + dayInSecs * 60; // 60 days
const ticketPrice = new BigNumber(100);
const goal = new BigNumber(100e18);

module.exports = function(deployer, network, [_, escrowWallet]) {
    deployer.deploy(
        Raffle,
        openTime,
        closeTime,
        ticketPrice,
        goal,
        escrowWallet
    );
};
