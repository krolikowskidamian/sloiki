import React, {Component} from 'react'
import {currencyList } from '../Helper'
import JarHistory from './JarHistory'

class JarContainer extends Component {
    constructor(props) {
      super(props);
      const jarObj = props.element.jars[props.element.index];
      this.state = {
        selectedInputCurrency: jarObj.currency.symbol,
        jarObj: jarObj,
        amount: '',
        amountToMove: '',
        history: [],
        historySort: { field: 'timestamp', sort: 'DESC' },
        selectedJarIdId: props.element.index
      };
  
    }
  
    changeSorting(fieldName, sortWay) {
      this.setState({ historySort: { field: fieldName, sort: sortWay } });
    }
    render() {
      return (
        <div>
          <p>Current Amount: <b>{this.props.element.e.currentAmount.toFixed(2)}</b> | Id of Jar: {this.props.element.index} | Currency: {this.state.jarObj.currency.name} </p>
  
          <div> <select onChange={(e) => { this.setState({ selectedInputCurrency: e.target.value }) }} value={this.state.selectedInputCurrency}>
            {currencyList.map((element) => <option key={element.symbol} value={element.symbol}>{element.symbol}</option>)}
          </select>
            <input type="number" onChange={(a) => { this.setState({ amount: a.target.value }) }} value={this.state.amount} />
            <button onClick={() => { if (this.state.selectedInputCurrency !== this.state.jarObj.currency.symbol) { alert(`Cannot operate in different currency than: ${this.state.jarObj.currency.name}`); return false; } (this.props.fnHandlers.depositCoinsHandler(this.state.amount, this.props.element.index)); this.setState({ amount: '' }) }} >Deposit</button>
            <button onClick={() => { if (this.state.selectedInputCurrency !== this.state.jarObj.currency.symbol) { alert(`Cannot operate in different currency than: ${this.state.jarObj.currency.name}`); return false; } (this.props.fnHandlers.withdrawCoinsHandler(this.state.amount, this.props.element.index)); this.setState({ amount: '' }) }} >Withdraw</button>
          </div>
          <hr />
          <div>
            <span>
              {this.state.jarObj.currency.name}
            </span>
            <input type="number" onChange={(a) => { this.setState({ amountToMove: a.target.value }) }} value={this.state.amountToMove} />
            <select onChange={(e) => { this.setState({ selectedJarIdId: e.target.value }) }} value={this.state.selectedJarIdId}>
              {this.props.element.jars.map((el, i) => {
                return <option key={i} value={i}>Jar No: {i} (Current state: {el.currentAmount.toFixed(2)})</option>
              })}
            </select>
            <button onClick={() => { if (this.state.selectedInputCurrency !== this.props.element.jars[this.state.selectedJarIdId].currency.symbol) { alert(`Coins will be converted to the origin currency of picked Jar. (Jar's currency: ${this.props.element.jars[this.state.selectedJarIdId].currency.name}) `); } (this.props.fnHandlers.moveCoinsHandler(this.state.amountToMove, this.props.element.index, this.state.selectedJarIdId, this.state.jarObj.currency)); this.setState({ amountToMove: '' }) }} >Move coins</button>
          </div>
          <JarHistory history={this.state.jarObj.history} />
        </div>
  
      )
    }
  }

  export default JarContainer;