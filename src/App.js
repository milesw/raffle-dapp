import React, { Component } from 'react';
import SimpleStorageContract from '../build/contracts/SimpleStorage.json';
import getWeb3 from './utils/getWeb3';

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
            storageValue: 0,
            web3: null,
            numberOfTickets: 1,
            numberOfTicketsBought: 20,
            numberOfTicketsProcessedSuccessfully: 4,
            ticketNumberTotal: 1000000,
            ticketNumberBoughtTotal: 560230,
        };
    }

    componentWillMount() {
        // Get network provider and web3 instance.
        // See utils/getWeb3 for more info.

        getWeb3
            .then(results => {
                this.setState({
                    web3: results.web3
                });

                // Instantiate contract once web3 provided.
                this.instantiateContract();
            })
            .catch(() => {
                console.log('Error finding web3.');
            });
    }

    instantiateContract() {
        /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

        const contract = require('truffle-contract');
        const simpleStorage = contract(SimpleStorageContract);
        simpleStorage.setProvider(this.state.web3.currentProvider);

        // Declaring this for later so we can chain functions on SimpleStorage.
        var simpleStorageInstance;

        // Get accounts.
        // this.state.web3.eth.getAccounts((error, accounts) => {
        //     simpleStorage
        //         .deployed()
        //         .then(instance => {
        //             simpleStorageInstance = instance;

        //             // Stores a given value, 5 by default.
        //             return simpleStorageInstance.set(7, { from: accounts[0] });
        //         })
        //         .then(result => {
        //             // Get the value from the contract to prove it worked.
        //             return simpleStorageInstance.get.call(accounts[0]);
        //         })
        //         .then(result => {
        //             // Update state with the result.
        //             return this.setState({ storageValue: result.c[0] });
        //         });
        // });
    }

    render() {
        return (
            <div className="">
                <div className="text-center">
                    <h2>#DappRaffle</h2>
                    <h3>Join Raffle powered by Ethereum </h3>
                </div>
                <div>
                    <img src='http://via.placeholder.com/1000x600' alt='' />
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
                        <button className="button large expanded warning mb0">Buy {localizeTicket(this.state.numberOfTickets)}</button>
                    </div>
                </div>
                <div className="grid-x">
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
                </div>
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
