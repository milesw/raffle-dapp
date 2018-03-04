import React, { Component } from 'react';
import RaffleContract from '../build/contracts/Raffle.json';
import getWeb3 from './utils/getWeb3';
import GallerySlider from './GallerySlider.js';

import etherImg from './ether.jpg'
import scanImg from './etherscan.jpg'
import winnerImg from './winner.jpg'
import doneImg from './ic_done_black_24px.svg'
import loadImg from './ic_loop_black_24px.svg'

import './css/oswald.css';
import './css/open-sans.css';
import './css/pure-min.css';
import './App.css';

const localizeTicket = ticketNumber => `${ticketNumber} ${ticketNumber === 1 ? 'ticket' : 'tickets' }`

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
            loading: false,
        };
    }

    componentDidMount() {
        // Get network provider and web3 instance.
        // See utils/getWeb3 for more info.
        this.getContractState()
    }

    componentDidUpdate () {
        if (
            this.state.numberOfTicketsBought > this.state.numberOfTicketsProcessedSuccessfully 
            && !this.state.loading
        ) {
            console.log('Update', this.state.numberOfTickets, this.state.loading)
            this.getContractState()
        }
    }

    getContractState () {
        if (this.state.loading) {
            return;
        }
        this.setState({ loading: true})
        getWeb3
            .then(results => {
                // Instantiate contract once web3 provided.
                const web3 = results.web3
                const contract = require('truffle-contract');
                const raffle = contract(RaffleContract);
                raffle.setProvider(web3.currentProvider);
        
                // Get accounts.
                web3.eth.getAccounts((error, accounts) => {
                    raffle
                        .deployed()
                        .then(instance => {
                            const raffleInstance = instance;
                            // Stores a given value, 5 by default.
                            return Promise.all([
                                raffleInstance.goal(),
                                raffleInstance.allTicketHolders(),
                                raffleInstance.weiRaised(),
                                raffleInstance.ticketsSold(),
                                raffleInstance.isFinalized(),
                            ])
                        })
                        .then(result => {
                            // Update state with the result.
                            this.setState({
                                numberOfTicketsProcessedSuccessfully: (result[1] || []).filter(_ => _ === accounts[0]).length,
                                ticketNumberBoughtTotal: result[3] ? web3.fromWei(result[3].toNumber(), 'ether'): 0,
                                goal: result[0] ? web3.fromWei(result[0].toNumber(), 'ether'): 0,
                                raised: result[2] ? web3.fromWei(result[2].toNumber(), 'ether'): 0,
                                finalized: result[4] || false,
                                loading: false,
                            });

                            this.setState({
                                numberOfTicketsBought: Math.max(this.state.numberOfTicketsBought, this.state.numberOfTicketsProcessedSuccessfully)
                            })
                        });
                });
            })
            .catch(() => {
                this.setState({ error: 'Error finding web3.', loading: false });
            });
        }

    order () {
        this.setState({ loading: true})
        getWeb3
            .then(results => {
                 const web3 = results.web3

                const contract = require('truffle-contract');
                 const raffle = contract(RaffleContract);
                raffle.setProvider(web3.currentProvider);

                web3.eth.getAccounts((error, accounts) => {
                    raffle
                        .deployed()
                        .then(instance => {
                            instance.ticketPrice()
                            .then(price => {
                                const {
                                    numberOfTickets,
                                    numberOfTicketsBought,
                                } = this.state

                                instance.purchaseTickets(
                                    numberOfTickets,
                                    {
                                        value: numberOfTickets * price,
                                        from: accounts[0],
                                    }
                                )

                                this.setState({
                                    loading: true,
                                    numberOfTicketsBought: numberOfTicketsBought + numberOfTickets,
                                })
                            })
                        })
                })
        }).catch(() => {
            this.setState({
                error: 'Purchase has failed.',
                loading: false,
            });
        });
    } 

    render() {
        return (
            <div className="">
                <div className="text-center">
                    <h2>#DappRaffle</h2>
                    <h3>Join Raffle powered by Ethereum </h3>
                </div>
                <div>
                    <GallerySlider/>
                </div>
                <div>
                    <h4>The Sanctum Villas, Chiang Mai, Thailand</h4>
                    <p>
                        A Sanctum villa offers the ideal blend of comfort, practicality, and safety in one stunning package; whether you’re searching for an intimate retreat or an astute investment opportunity.
                    </p>
                </div>
                <div style={{
                    height: '2rem',
                    width: '100%',
                    backgroundColor: 'grey',
                }}>
                    <div style={{
                        height: '100%',
                        width: '56%',
                        backgroundColor: 'green'
                    }} />
                </div>
                <div className="grid-x">
                    <div className="cell small-6">
                        <p className='text-left h4'>560.012 Tickets</p>
                    </div>
                    <div className="cell small-6">
                        <p className='text-right h4'>1 Mio Tickets</p>
                    </div>
                </div>
                <div className="grid-x">
                    <div className="cell small-3 medium-1">
                        <button
                            className="button large expanded alert mb0" 
                            disabled={this.state.numberOfTickets < 2}
                            onClick={() => this.setState({numberOfTickets: this.state.numberOfTickets-1})}
                        >-</button>
                    </div>
                    <div className="cell small-6 medium-2">
                        <input type="number" id="right-label" value={this.state.numberOfTickets} className='fh text-center' onChange={e => this.setState({ numberOfTickets: e.target.value})} />
                    </div>
                    <div className="cell small-3 medium-1">
                        <button
                            className="button large expanded edit mb0"
                            onClick={() => this.setState({numberOfTickets: this.state.numberOfTickets+1})}
                        >+</button>
                    </div>
                    <div className="cell small-12 medium-8">
                        <button className="button large expanded warning mb0" onClick={() => this.order()}>Buy {localizeTicket(this.state.numberOfTickets)}</button>
                    </div>
                </div>
                {this.state.numberOfTicketsBought ? <div className="grid-x">
                    <hr className="cell" />
                    <div className="cell">
                        <p className='text-center h4'>You have bought {localizeTicket(this.state.numberOfTicketsBought)}</p>
                    </div>
                    <div className="cell" >
                        <img src={doneImg}  style={{width: '40px'}} className="float-center" />
                    </div>
                    <div className="cell">
                        <p className='text-center h4'>{localizeTicket(this.state.numberOfTicketsProcessedSuccessfully)} tickets have been successfully submitted.</p>
                    </div>
                    <div className="cell" >
                        <img src={loadImg}  style={{width: '40px'}} className="float-center" />
                    </div>
                    <div className="cell">
                        <p className='text-center h4'>{localizeTicket(this.state.numberOfTicketsBought - this.state.numberOfTicketsProcessedSuccessfully)} are still processing.</p>
                    </div>
                    <hr className="cell" />
                </div> : null}
                <div className="grid-x align-spaced">
                    <div className="cell">
                        <p className='text-center h4'>How it works?</p>
                    </div>
                    <div className="cell small-4" >
                        <img src={etherImg}  style={{width: '40px'}} className="float-center" />
                    </div>
                    <div className="cell small-4">
                        <img src={scanImg} style={{width: '40px'}} className="float-center" />
                    </div>
                    <div className="cell small-4">
                        <img src={winnerImg} style={{width: '40px'}} className="float-center" />
                    </div>
                    <div className="cell small-4">
                        <p className='text-center h4'><a href=''>Send ETH to #DappRaffle</a></p>
                    </div>
                    <div className="cell small-4">
                        <p className='text-center h4'><a href=''>Check etherscan.io</a></p>
                    </div>
                    <div className="cell small-4">
                        <p className='text-center h4'><a href=''>Winner gets the villa</a></p>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
