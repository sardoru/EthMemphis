import React, { Component } from 'react'
import {Router, Route} from 'react-router-dom';
import RegisterMessage from 'components/RegisterMessage'
import Reserve from 'components/Reserve';
// import GetReservations from 'components/GetReservations';
// import GetNextReservation from 'components/GetNextReservation';
// import CheckAvailable from 'components/CheckAvailable';
// import GetRoomInfo from 'components/GetRoomInfo';
import Access from 'components/Access';
import Settle from 'components/Settle';
import Status from 'containers/Status'
import Contact from 'components/Contact'
import About from 'components/About';
import getWeb3 from 'utils/getWeb3';
// import Web3 from 'web3';  // from node module

import 'styles/App.css'

let RRAbi = require('../../ABIs/RoomRentingAbi.js');
// note: should switch between localAddress and rinkeyAddress based on web3 provider
// let RRAddress = require('contractAddress/localAddress.js');
let RRAddress = require('../../contractAddress/rinkebyAddress.js');

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      web3: null,
      RR: null,
      web3error: null,
      networkId: null,
      netIdError: null,
      tokenId : "",
      checkInDate: null,
      checkOutDate: null
    }
    this.returnComponentState=this.returnComponentState.bind(this);
    // this.handleTextChange=this.handleTextChange.bind(this);
  }

  componentWillMount() {
    /** Get network provider and web3 instance.
     See utils/getWeb3 for more info. */
    getWeb3
    .then(results => {
      // console.log('results: ', results);
      this.setState({
        web3: results.web3
      })
    })
    .catch(error => {
      // console.log(error)
      this.setState({
        web3error: error.error
      })
    })
  }

  componentDidUpdate(prevProps, prevState){
    if(prevState.web3!==this.state.web3) {
      this.instantiateContract();
      this.whichNetwork();
    }
    if(prevState.networkId!==this.state.networkId) {
      this.reportNetwork(this.state.networkId);
    }
  }

  instantiateContract = () => {    
    this.setState({
      RR: this.state.web3.eth.contract(RRAbi).at(RRAddress)
    })
    // RoomRenting.deployed().then(function(res){RR = RoomRenting.at(res.address)})
  }

  whichNetwork = () => {
    this.state.web3.version.getNetwork((err, netId) => {
      if(err){console.log('err: ', err)}
      this.setState({networkId: netId});
    })
  }

  reportNetwork = (netId) => {
    if(netId!=="4"){
      this.setState({netIdError: "You must be on the Rinkeby network!"})
    }
    if(netId==="4"){
      this.setState({netIdError: null})
    }
}

  returnComponentState = (componentState) => {
    this.setState({
      tokenId: componentState.tokenId,
      checkInDate: componentState.checkInDate,
      checkOutDate: componentState.checkOutDate
    })
  }

  render() {

    return (
      
        <Router history={this.props.history}>
          <div>
            <Route path="/home" component={RegisterMessage} />
            <Route path="/register" render={(props)=>(<Reserve web3={this.state.web3} RR={this.state.RR} web3error={this.state.web3error} netIdError={this.state.netIdError} />)} />
            <Route path="/checkIn" render={(props)=>(<Access web3={this.state.web3} RR={this.state.RR} tokenId={this.state.tokenId} />)} />
            <Route path="/checkOut" render={(props)=>(<Settle web3={this.state.web3} RR={this.state.RR} tokenId={this.state.tokenId} />)} />
            <Route path="/status" render={(props)=>(<Status web3={this.state.web3} RR={this.state.RR} tokenId={this.state.tokenId} returnComponentState={this.returnComponentState} checkInDate={this.state.checkInDate} checkOutDate={this.state.checkOutDate} />)} />
            <Route path="/about" component={About} />
            <Route path="/contact" component={Contact} />
            <Route exact path="/" component={RegisterMessage} />
          </div>
        </Router>
      
    );
  }
}

export default App
