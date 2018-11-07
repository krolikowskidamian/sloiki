import React, {Component} from 'react'
import { currencyList, currencyConverter } from '../Helper'
import GlobalDeposit from './GlobalDespoit'
import JarContainer from './JarContainer'
import JarGlobalHistory from './JarGlobalHistory'


class SloikApp extends Component {
    constructor(props) {
      super(props);
      this.state = {
        jars: [{
          currentAmount: 0,
          history: [],
          currency: currencyList[0]
        }],
        globalHistory: [],
        selectedCurrency: currencyList[0].symbol
      }
    }
    depositCoins(amount, index) {
      const currentState = this.state;
      const currencyName = this.state.jars[index].currency.name;
      if (isNaN(parseFloat(amount))) {
        return false;
      }
      currentState.jars[index].currentAmount = parseFloat(currentState.jars[index].currentAmount, 10) + parseFloat(amount, 10);
      currentState.globalHistory = [...this.state.globalHistory, { method: 'Deposit', jarId: index, amount: amount, timestamp: new Date() }]
      this.setState(currentState);
      this.addJarHistory({ timestamp: new Date(), modifier: amount, currency: currencyName, currentState: currentState.jars[index].currentAmount, method: "Deposit", jarId: index }, index)
      return { timestamp: new Date(), modifier: amount, currentState: currentState.jars[index].currentAmount, method: "Deposit", jarId: index }
    }
    withdrawCoins(amount, index) {
      const currentState = this.state;
  
      const currencyName = this.state.jars[index].currency.name;
      if (isNaN(parseFloat(amount))) {
        return false;
      }
      if (parseFloat(currentState.jars[index].currentAmount, 10) < parseFloat(amount, 10)) {
        currentState.jars[index].currentAmount = 0;
        amount = parseFloat(currentState.jars[index].currentAmount, 10);
      } else {
        currentState.jars[index].currentAmount = parseFloat(currentState.jars[index].currentAmount, 10) - parseFloat(amount, 10);
      }
      currentState.globalHistory = [...this.state.globalHistory, { method: 'Withdraw', jarId: index, amount: amount, timestamp: new Date() }]
      this.setState(currentState);
      this.addJarHistory({ timestamp: new Date(), modifier: amount, currency: currencyName, currentState: currentState.jars[index].currentAmount, method: "Withdraw", jarId: index }, index)
  
      return { timestamp: new Date(), modifier: amount, currentState: currentState.jars[index].currentAmount, method: "Withdraw", jarId: index }
    }
    moveCoins(amount, from, into, fromCurrencyObj) {
      if (from === into) {
        alert('Please select different Jar.');
        return false;
      }
      if (!into) {
        alert('Cannot move coins, there is no more Jars.')
        return false;
      }
  
      const intoJarCurrency = this.state.jars[into].currency;
      const currentState = this.state;
      if (isNaN(parseFloat(amount))) {
        return false;
      }
  
  
      if (parseFloat(currentState.jars[from].currentAmount, 10) < parseFloat(amount, 10)) {
        currentState.jars[from].currentAmount = 0;
        amount = parseFloat(currentState.jars[from].currentAmount, 10)
      } else {
        currentState.jars[from].currentAmount = parseFloat(currentState.jars[from].currentAmount, 10) - parseFloat(amount, 10);
      }
      if (amount === 0) {
        alert('No coins to move.');
        return false;
      }
      let convertedAmount = currencyConverter(amount, fromCurrencyObj.symbol, intoJarCurrency.symbol)
      currentState.jars[into].currentAmount = currentState.jars[into].currentAmount + parseFloat(convertedAmount, 10);
      currentState.globalHistory = [...this.state.globalHistory, { method: 'Move', jarId: from, moveToJar: into, amount: amount, currency: intoJarCurrency.name }];
      this.setState(currentState);
      this.addJarHistory({ timestamp: new Date(), modifier: amount, currentState: currentState.jars[from].currentAmount, method: "Move out", currency: fromCurrencyObj.name, jarId: from }, from)
      this.addJarHistory({ timestamp: new Date(), modifier: convertedAmount, currentState: currentState.jars[into].currentAmount, currency: intoJarCurrency.name, method: "Move in", jarId: into }, into)
  
      return { timestamp: new Date(), modifier: amount, currentState: currentState.jars[from].currentAmount, method: "Move out", currency: fromCurrencyObj.name, jarId: from }
  
    }
    addJar() {
      const selectedCurrency = this.state.selectedCurrency;
      const currentJars = this.state.jars.concat({ currentAmount: 0, history: [], currency: currencyList.find((item) => item.symbol === selectedCurrency) });
      const globalHistory = [...this.state.globalHistory, { method: 'New Jar', jarId: currentJars.length - 1, timestamp: new Date() }]
      this.setState({ jars: currentJars, globalHistory })
    }
    removeJar() {
      let currentJars = this.state.jars.slice(0, -1);
      const globalHistory = [...this.state.globalHistory, { method: 'Remove Jar', jarId: currentJars.length + 1, timestamp: new Date() }]
  
      this.setState({ jars: currentJars, globalHistory });
    }
    addJarHistory(historyRecord, jarId) {
      const state = this.state;
      state.jars[jarId].history = [...this.state.jars[jarId].history, historyRecord];
      this.setState(state)
    }
    render() {
      return (
        <div>
          <h2>Control panel</h2>
          <hr />
          <label>Add/Remove JAR: </label>
          <button onClick={this.addJar.bind(this)}>+</button>
          <button onClick={this.removeJar.bind(this)}>-</button>
          <select onChange={(e) => { this.setState({ selectedCurrency: e.target.value }) }} value={this.state.selectedCurrency}>
            {currencyList.map((element) => <option key={element.symbol} value={element.symbol}>{element.name}</option>)}
          </select>
          <hr />
          <h3>Global deposit panel</h3>
          <GlobalDeposit jarList={this.state.jars} fnHandlers={{ depositCoinsHandler: this.depositCoins.bind(this) }} />
          <hr />
          <h3>List of Jar's</h3>
  
          {this.state.jars.map((e, index) =>
            <div key={index}>
              <JarContainer fnHandlers={{ depositCoinsHandler: this.depositCoins.bind(this), withdrawCoinsHandler: this.withdrawCoins.bind(this), moveCoinsHandler: this.moveCoins.bind(this) }} element={{ e, index, jars: this.state.jars }} />
            </div>)}
  
          <hr />
          <h3>Global History</h3>
          <JarGlobalHistory globalHistory={this.state.globalHistory} />
        </div>
      )
    }
  }

  export default SloikApp;