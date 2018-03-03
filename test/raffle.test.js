const Raffle = artifacts.require('./Raffle.sol');
const { should, ensuresException } = require('./helpers/utils');
const expect = require('chai').expect;
const { latestTime, duration, increaseTimeTo } = require('./helpers/timer');

const BigNumber = web3.BigNumber;

contract('Raffle', function([owner, buyer1, buyer2, escrowWallet]) {
    const ticketPrice = new BigNumber(100);
    const goal = new BigNumber(100e18);

    let raffle;
    let openTime, closeTime;

    const newRaffle = ticketPrice => {
        openTime = latestTime() + duration.seconds(20); // crowdsale starts in 20 seconds
        closeTime = openTime + duration.days(60);

        return Raffle.new(openTime, closeTime, ticketPrice, goal, escrowWallet);
    };

    beforeEach('setup contract', async () => {
        raffle = await newRaffle(ticketPrice);
    });

    describe('initial values', () => {
        it('has an openTime', async () => {
            const raffleOpenTime = await raffle.openTime();
            raffleOpenTime.should.be.bignumber.equal(openTime);
        });

        it('has a closeTime', async () => {
            const raffleCloseTime = await raffle.closeTime();
            raffleCloseTime.should.be.bignumber.equal(closeTime);
        });

        it('has a ticketPrice', async () => {
            const raffleTicketPrice = await raffle.ticketPrice();
            raffleTicketPrice.should.be.bignumber.equal(ticketPrice);
        });

        it('has a goal', async () => {
            const raffleGoal = await raffle.goal();
            raffleGoal.should.be.bignumber.equal(goal);
        });

        it('has a escrowWallet', async () => {
            const raffleEscrowWallet = await raffle.escrowWallet();
            raffleEscrowWallet.should.be.bignumber.equal(escrowWallet);
        });
    });

    describe('ticket purchases', () => {
        it('must not allow ticket purchases before and after the raffle timeframe', async () => {
            try {
                await raffle.purchaseTickets(1, { value: ticketPrice });
                assert.fail();
            } catch (error) {
                ensuresException(error);
            }

            let weiRaised = await raffle.weiRaised();
            weiRaised.should.be.bignumber.equal(0);

            await increaseTimeTo(latestTime() + duration.days(65));

            try {
                await raffle.purchaseTickets(1, { value: ticketPrice });
                assert.fail();
            } catch (error) {
                ensuresException(error);
            }

            weiRaised = await raffle.weiRaised();
            weiRaised.should.be.bignumber.equal(0);
        });

        it('does NOT allow buyers to send an inccorect amount for the purchase', async () => {
            try {
                await raffle.purchaseTickets(1, { value: ticketPrice + 1 });
                assert.fail();
            } catch (error) {
                ensuresException(error);
            }

            const tickets = await raffle.ticketsSold();
            tickets.should.be.bignumber.equal(0);
        });

        it('must NOT allow to purchase tickets after the raffle finalization');
        it('must NOT allow to purchase tickets with zero value');

        it('allows user to buy one ticket');
        it('allows user to buy multiple ticket');
        it(
            'transfer funds to escrowWallet - no funds should be in the raffle contract'
        );
    });
});
