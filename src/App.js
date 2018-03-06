import React, { Component } from 'react';
//import RaffleContract from '../build/contracts/Raffle.json';
import getWeb3 from './utils/getWeb3';
import GallerySlider from './GallerySlider.js';

import etherImg from './ether.jpg';
import scanImg from './etherscan.jpg';
import winnerImg from './winner.jpg';
import doneImg from './ic_done_black_24px.svg';
import loadImg from './ic_loop_black_24px.svg';

import './css/oswald.css';
import './css/open-sans.css';
import './css/pure-min.css';
import './App.css';

const contractAddress = '0x9694a1a5132397Df30EC95502D6fcc3d00Ab3F2E';

const localizeTicket = ticketNumber =>
    `${ticketNumber} ${ticketNumber === 1 ? 'ticket' : 'tickets'}`;

const RaffleContract = [
    {
        constant: true,
        inputs: [],
        name: 'ticketPrice',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'goal',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'raffleWinner',
        outputs: [{ name: '', type: 'address' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'closeTime',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'isFinalized',
        outputs: [{ name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'escrowWallet',
        outputs: [{ name: '', type: 'address' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [{ name: '', type: 'uint256' }],
        name: 'ticketHolders',
        outputs: [{ name: '', type: 'address' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'openTime',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'drawRandomNumber',
        outputs: [{ name: '', type: 'address' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            { name: '_openTime', type: 'uint256' },
            { name: '_closeTime', type: 'uint256' },
            { name: '_ticketPrice', type: 'uint256' },
            { name: '_goal', type: 'uint256' },
            { name: '_escrowWallet', type: 'address' },
            { name: '_drawRandomNumber', type: 'address' }
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'constructor'
    },
    {
        constant: false,
        inputs: [{ name: 'numberOfTickets', type: 'uint256' }],
        name: 'purchaseTickets',
        outputs: [],
        payable: true,
        stateMutability: 'payable',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'weiRaised',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'ticketsSold',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'allTicketHolders',
        outputs: [{ name: '', type: 'address[]' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: false,
        inputs: [{ name: 'randomNumber', type: 'uint256' }],
        name: 'setWinnerAndFinalize',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        constant: false,
        inputs: [],
        name: 'requestRandomNumber',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
    }
];

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            numberOfTickets: 1,
            numberOfTicketsBought: 0,
            numberOfTicketsProcessedSuccessfully: 0,
            ticketNumberTotal: 1000000,
            ticketNumberBoughtTotal: 560230,
            error: '',
            finalized: false,
            loading: false
        };
    }

    componentDidMount() {
        // Get network provider and web3 instance.
        // See utils/getWeb3 for more info.
        this.getContractState();
    }

    componentDidUpdate() {
        // console.log('updating?')
        if (
            this.state.numberOfTicketsBought >
            this.state.numberOfTicketsProcessedSuccessfully
        ) {
            // console.log('updating...')
            this.getContractState();
        }
    }

    getContractState() {
        if (this.state.loading === 'update') {
            // console.log('already updating')
            return;
        }
        // console.log('update started')
        this.setState({ loading: 'update' });
        getWeb3
            .then(results => {
                // Instantiate contract once web3 provided.
                const web3 = results.web3;
                // const contract = require('truffle-contract');
                // const raffle = contract(RaffleContract);
                const RaffleABI = web3.eth.contract(RaffleContract);
                const raffleInstance = RaffleABI.at(contractAddress);
                web3.version.getNetwork((error, result) => {
                    if (error || Number(result) !== 4) {
                        console.log(result);
                        this.setState({
                            error: 'web3'
                        });
                    }
                });
                // raffle.setProvider(web3.currentProvider);

                // Get accounts.
                web3.eth.getAccounts((error, accounts) => {
                    Promise.all([
                        new Promise((resolve, reject) =>
                            raffleInstance.goal(
                                (error, data) =>
                                    error ? reject(error) : resolve(data)
                            )
                        ),
                        new Promise((resolve, reject) =>
                            raffleInstance.allTicketHolders(
                                (error, data) =>
                                    error ? reject(error) : resolve(data)
                            )
                        ),
                        new Promise((resolve, reject) =>
                            raffleInstance.weiRaised(
                                (error, data) =>
                                    error ? reject(error) : resolve(data)
                            )
                        ),
                        new Promise((resolve, reject) =>
                            raffleInstance.ticketsSold(
                                (error, data) =>
                                    error ? reject(error) : resolve(data)
                            )
                        ),
                        new Promise((resolve, reject) =>
                            raffleInstance.isFinalized(
                                (error, data) =>
                                    error ? reject(error) : resolve(data)
                            )
                        ),
                        new Promise((resolve, reject) =>
                            raffleInstance.raffleWinner(
                                (error, data) =>
                                    error ? reject(error) : resolve(data)
                            )
                        )
                    ]).then(result => {
                        console.log('get data...');
                        // Update state with the result.
                        this.setState(
                            {
                                numberOfTicketsProcessedSuccessfully: (
                                    result[1] || []
                                ).filter(_ => _ === accounts[0]).length,
                                ticketNumberBoughtTotal: result[3]
                                    ? web3.fromWei(
                                          result[3].toNumber(),
                                          'ether'
                                      )
                                    : 0,
                                goal: result[0]
                                    ? web3.fromWei(
                                          result[0].toNumber(),
                                          'ether'
                                      )
                                    : 0,
                                raised: result[2]
                                    ? web3.fromWei(
                                          result[2].toNumber(),
                                          'ether'
                                      )
                                    : 0,
                                finalized: result[4] || false,
                                success: result[5]
                                    ? result[5] === accounts[0]
                                    : null,
                                loading: false
                            },
                            () => {
                                this.setState(
                                    {
                                        numberOfTicketsBought: Math.max(
                                            this.state.numberOfTicketsBought,
                                            this.state
                                                .numberOfTicketsProcessedSuccessfully
                                        )
                                    },
                                    () => {
                                        if (
                                            this.state.numberOfTicketsBought >
                                            this.state
                                                .numberOfTicketsProcessedSuccessfully
                                        ) {
                                            this.getContractState();
                                        }
                                    }
                                );
                            }
                        );
                    });
                });
            })
            .catch(() => {
                this.setState({ error: 'web3', loading: false });
            });
    }

    order() {
        this.setState({ loading: true, error: null });
        getWeb3
            .then(results => {
                const web3 = results.web3;

                try {
                    const RaffleABI = web3.eth.contract(RaffleContract);
                    const raffle = RaffleABI.at(contractAddress);

                    // const contract = require('truffle-contract');
                    // const raffle = contract(RaffleContract);
                    // raffle.setProvider(web3.currentProvider);

                    web3.eth.getAccounts((error, accounts) => {
                        if (error) {
                            this.setState({ error: 'web3', loading: false });
                        }

                        new Promise((resolve, reject) =>
                            raffle.ticketPrice((error, price) => {
                                if (error) {
                                    reject(error);
                                }
                                const {
                                    numberOfTickets,
                                    numberOfTicketsBought
                                } = this.state;

                                resolve(
                                    new Promise((resolve, reject) =>
                                        raffle.purchaseTickets(
                                            numberOfTickets,
                                            {
                                                value: numberOfTickets * price,
                                                from: accounts[0]
                                            },
                                            error => {
                                                if (error) {
                                                    reject(error);
                                                }
                                                this.setState({
                                                    loading: false,
                                                    numberOfTicketsBought:
                                                        numberOfTicketsBought +
                                                        numberOfTickets,
                                                    error: null
                                                });
                                                console.log(
                                                    numberOfTicketsBought,
                                                    numberOfTickets
                                                );
                                                resolve();
                                            }
                                        )
                                    ).catch(() => {
                                        this.setState({
                                            error: 'order',
                                            loading: false
                                        });
                                    })
                                );
                            })
                        ).catch(() => {
                            this.setState({
                                error: 'web3',
                                loading: false
                            });
                        });
                    });
                } catch (e) {
                    this.setState({ error: 'web3', loading: false });
                }
            })
            .catch(() => {
                this.setState({
                    error: 'web3',
                    loading: false
                });
            });
    }

    render() {
        return (
            <div className="home">
                <div className="text-center" style={{ marginBottom: 45 }}>
                    <h2>DappRaffle</h2>
                    <h7>Powered by Ethereum</h7>
                </div>
                <div style={{ marginBottom: 25 }}>
                    <GallerySlider />
                </div>
                {this.state.error === 'web3' ? (
                    <div style={{ color: 'red' }}>
                        <h4>
                            Oops, you have not installed MetaMask and/or you are
                            not connected to the Ethereum Rinkeby test network
                        </h4>
                        <p>
                            You’ll need a safe place to store your rinkeby test
                            ether so as to interac with this application. The
                            perfect place is in a secure wallet like MetaMask.
                            This will also act as your login (no extra password
                            needed). You need to use a browser such as Chrome.
                            Please go to {''}
                            <a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?utm_source=chrome-ntp-icon">
                                https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?utm_source=chrome-ntp-icon
                            </a>{' '}
                            to install MetaMask
                        </p>
                    </div>
                ) : null}
                <div style={{ marginTop: 50, marginBottom: 50 }}>
                    <h4>The Sanctum Villas, Chiang Mai, Thailand</h4>
                    <p>
                        A Sanctum villa offers the ideal blend of comfort,
                        practicality, and safety in one stunning package;
                        whether you’re searching for an intimate retreat or an
                        astute investment opportunity.
                    </p>
                </div>
                <div
                    style={{
                        height: '2rem',
                        width: '100%',
                        backgroundColor: 'grey'
                    }}
                >
                    <div
                        style={{
                            height: '100%',
                            width: !this.state.finalized
                                ? `${Math.round(
                                      this.state.raised / this.state.goal * 100
                                  )}%`
                                : '100%',
                            backgroundColor: 'green'
                        }}
                    />
                </div>
                <div className="grid-x">
                    <div className="cell small-6">
                        <p className="text-left h4">
                            Raised: {this.state.raised} ETH /{' '}
                            {Math.round(
                                this.state.raised / this.state.goal * 100
                            )}{' '}
                            %
                        </p>
                    </div>
                    <div className="cell small-6">
                        <p className="text-right h4">
                            Goal: {this.state.goal} ETH
                        </p>
                    </div>
                </div>
                {this.state.finalized ? (
                    <div className="grid-x">
                        <div className="cell">
                            <p>
                                {this.state.success
                                    ? 'You won'
                                    : 'Sorry, try again next time.'}
                            </p>
                        </div>
                    </div>
                ) : null}
                <div className="grid-x">
                    {this.state.error === 'order' ? null : (
                        <div className="cell small-3 medium-1">
                            <button
                                className="button large expanded alert mb0"
                                disabled={this.state.numberOfTickets < 2}
                                onClick={() =>
                                    this.setState({
                                        numberOfTickets:
                                            this.state.numberOfTickets - 1
                                    })
                                }
                            >
                                -
                            </button>
                        </div>
                    )}
                    {this.state.error === 'order' ? null : (
                        <div className="cell small-6 medium-2">
                            <input
                                type="number"
                                id="right-label"
                                value={this.state.numberOfTickets}
                                className="fh text-center"
                                onChange={e =>
                                    this.setState({
                                        numberOfTickets: Number(e.target.value)
                                    })
                                }
                            />
                        </div>
                    )}
                    {this.state.error === 'order' ? null : (
                        <div className="cell small-3 medium-1">
                            <button
                                className="button large expanded edit mb0"
                                onClick={() =>
                                    this.setState({
                                        numberOfTickets:
                                            this.state.numberOfTickets + 1
                                    })
                                }
                            >
                                +
                            </button>
                        </div>
                    )}
                    {this.state.error === 'order' ? (
                        <div className="cell small-12 medium-4">
                            Order aborted. Try again.
                        </div>
                    ) : null}
                    <div className="cell small-12 medium-8">
                        <button
                            className="button large expanded warning mb0"
                            onClick={() => this.order()}
                            disabled={this.state.finalized}
                        >
                            Buy {localizeTicket(this.state.numberOfTickets)}
                        </button>
                    </div>
                </div>
                {this.state.numberOfTicketsBought ? (
                    <div className="grid-x">
                        <hr className="cell" />
                        <div className="cell">
                            <p className="text-center h4">
                                You have bought{' '}
                                {localizeTicket(
                                    this.state.numberOfTicketsBought
                                )}.
                            </p>
                        </div>
                        {this.state.numberOfTicketsBought -
                        this.state
                            .numberOfTicketsProcessedSuccessfully ? null : (
                            <div className="cell">
                                <img
                                    role="presentation"
                                    src={doneImg}
                                    style={{ width: '40px' }}
                                    className="float-center"
                                />
                            </div>
                        )}
                        <div className="cell">
                            <p className="text-center h4">
                                {localizeTicket(
                                    this.state
                                        .numberOfTicketsProcessedSuccessfully
                                )}{' '}
                                have been successfully submitted.
                            </p>
                        </div>
                        {this.state.loading ? (
                            <div className="cell">
                                <img
                                    role="presentation"
                                    src={loadImg}
                                    style={{ width: '40px' }}
                                    className="float-center"
                                />
                            </div>
                        ) : null}
                        {this.state.numberOfTicketsBought -
                        this.state.numberOfTicketsProcessedSuccessfully ? (
                            <div className="cell">
                                <p className="text-center h4">
                                    {localizeTicket(
                                        this.state.numberOfTicketsBought -
                                            this.state
                                                .numberOfTicketsProcessedSuccessfully
                                    )}{' '}
                                    processing...
                                </p>
                            </div>
                        ) : null}
                        <hr className="cell" />
                    </div>
                ) : null}
                <div
                    className="grid-x align-spaced"
                    style={{ marginTop: 45, marginBottom: 45 }}
                >
                    <div className="cell">
                        <p className="text-center h4">How it works:</p>
                    </div>
                    <div className="cell small-4">
                        <img
                            role="presentation"
                            src={etherImg}
                            style={{ width: '40px' }}
                            className="float-center"
                        />
                    </div>
                    <div className="cell small-4">
                        <img
                            role="presentation"
                            src={scanImg}
                            style={{ width: '40px' }}
                            className="float-center"
                        />
                    </div>
                    <div className="cell small-4">
                        <img
                            role="presentation"
                            src={winnerImg}
                            style={{ width: '40px' }}
                            className="float-center"
                        />
                    </div>
                    <div className="cell small-4">
                        <p className="text-center h4">
                            Send ETH to #DappRaffle
                        </p>
                    </div>
                    <div className="cell small-4">
                        <p className="text-center h4">
                            <a
                                href={`https://rinkeby.etherscan.io/address/${contractAddress}`}
                            >
                                Check etherscan.io
                            </a>
                        </p>
                    </div>
                    <div className="cell small-4">
                        <p className="text-center h4">Winner gets the villa</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
