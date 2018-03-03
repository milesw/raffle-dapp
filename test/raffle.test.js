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

    const newRaffle = goal => {
        openTime = latestTime() + duration.seconds(20); // crowdsale starts in 20 seconds
        closeTime = openTime + duration.days(60);

        return Raffle.new(openTime, closeTime, ticketPrice, goal, escrowWallet);
    };

    beforeEach('setup contract', async () => {
        raffle = await newRaffle(goal);
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
            await increaseTimeTo(latestTime() + duration.seconds(50));

            try {
                await raffle.purchaseTickets(1, { value: ticketPrice + 1 });
                assert.fail();
            } catch (error) {
                ensuresException(error);
            }

            const tickets = await raffle.ticketsSold();
            tickets.should.be.bignumber.equal(0);
        });

        it("must NOT allow to purchase tickets after the raffle's finalization", async () => {
            await increaseTimeTo(latestTime() + duration.days(65));

            try {
                await raffle.purchaseTickets(1, { value: ticketPrice });
                assert.fail();
            } catch (error) {
                ensuresException(error);
            }

            const tickets = await raffle.ticketsSold();
            tickets.should.be.bignumber.equal(0);
        });

        it('must NOT allow to purchase tickets with zero value', async () => {
            await increaseTimeTo(latestTime() + duration.seconds(50));

            try {
                await raffle.purchaseTickets(0, { value: 0 });
                assert.fail();
            } catch (error) {
                ensuresException(error);
            }

            const tickets = await raffle.ticketsSold();
            tickets.should.be.bignumber.equal(0);
        });

        it('allows user to buy one ticket', async () => {
            await increaseTimeTo(latestTime() + duration.seconds(50));

            await raffle.purchaseTickets(1, {
                value: ticketPrice,
                from: buyer1
            });

            const tickets = await raffle.ticketsSold();
            tickets.should.be.bignumber.equal(1);
        });

        it('allows user to buy multiple ticket', async () => {
            await increaseTimeTo(latestTime() + duration.seconds(50));

            await raffle.purchaseTickets(10, { value: ticketPrice * 10 });

            const tickets = await raffle.ticketsSold();
            tickets.should.be.bignumber.equal(10);
        });

        it('transfer funds to escrowWallet - no funds should be in the raffle contract', async () => {
            await increaseTimeTo(latestTime() + duration.seconds(50));
            const escrowWalletBalanceBefore = await web3.eth.getBalance(
                escrowWallet
            );

            await raffle.purchaseTickets(10, { value: ticketPrice * 10 });

            const weiRaised = await raffle.weiRaised();
            weiRaised.should.be.bignumber.equal(ticketPrice * 10);

            const weiInsideRaffleContract = await web3.eth.getBalance(
                raffle.address
            );

            weiInsideRaffleContract.should.be.bignumber.equal(0);

            const escrowWalletBalanceAfter = await web3.eth.getBalance(
                escrowWallet
            );
            escrowWalletBalanceAfter.should.be.bignumber.equal(
                escrowWalletBalanceBefore.add(weiRaised)
            );
        });
    });

    describe('raffle finalization', () => {
        it('cannot call it when it is already finalized', async () => {
            await increaseTimeTo(latestTime() + duration.days(65));
            await raffle.finalizeRaffleByTime();

            try {
                await raffle.finalizeRaffleByTime();
                assert.fail();
            } catch (e) {
                ensuresException(e);
            }

            try {
                await raffle.finalizeRaffleByGoalReached({ from: owner });
                assert.fail();
            } catch (e) {
                ensuresException(e);
            }
        });

        it('is NOT called before reaching the goal or before the end time', async () => {
            await increaseTimeTo(latestTime() + duration.seconds(50));

            await raffle.purchaseTickets(1, { value: ticketPrice });

            try {
                await raffle.finalizeRaffleByTime();
                assert.fail();
            } catch (e) {
                ensuresException(e);
            }

            try {
                await raffle.finalizeRaffleByGoalReached({ from: owner });
                assert.fail();
            } catch (e) {
                ensuresException(e);
            }
        });

        it('there is no winner when no one has participated in the raffle', async () => {
            await increaseTimeTo(latestTime() + duration.days(65));
            await raffle.finalizeRaffleByTime();

            const winner = await raffle.raffleWinner();
            winner.should.be.equal(
                '0x0000000000000000000000000000000000000000'
            );

            const isFinalized = await raffle.isFinalized();
            isFinalized.should.be.true;
        });

        it('only the owner is able to call finalize by goal', async () => {
            raffle = await newRaffle(new BigNumber(20));

            await increaseTimeTo(latestTime() + duration.seconds(50));
            await raffle.purchaseTickets(3, {
                value: ticketPrice * 3,
                from: buyer2
            });

            try {
                await raffle.finalizeRaffleByGoalReached({ from: buyer1 });
                assert.fail();
            } catch (e) {
                ensuresException(e);
            }

            let isFinalized = await raffle.isFinalized();
            isFinalized.should.be.false;

            await raffle.finalizeRaffleByGoalReached({ from: owner });

            isFinalized = await raffle.isFinalized();
            isFinalized.should.be.true;
        });

        it('finalizes and has a winner', async () => {
            await increaseTimeTo(latestTime() + duration.seconds(50));

            await raffle.purchaseTickets(1, {
                value: ticketPrice,
                from: buyer2
            });
            await raffle.purchaseTickets(1, {
                value: ticketPrice,
                from: buyer2
            });
            await raffle.purchaseTickets(1, {
                value: ticketPrice,
                from: buyer2
            });

            await increaseTimeTo(latestTime() + duration.days(65));

            await raffle.finalizeRaffleByTime();

            const winner = await raffle.raffleWinner();
            winner.should.be.equal(buyer2);

            const isFinalized = await raffle.isFinalized();
            isFinalized.should.be.true;
        });
    });
});
