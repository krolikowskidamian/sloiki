import React, {Component} from 'react'
import {currencyList, currencyConverter, style} from '../Helper'

class GlobalDeposit extends Component {
    constructor(props) {
      super(props);
      this.state = { amount: 0, ratioList: [100], selectedCurrency: 'pln' };
      this.addCoinsFn = props.fnHandlers.depositCoinsHandler;
    }
  
    validSubmitFn() {
      const ratioSum = this.state.ratioList.reduce((summary, e) => {
        summary = summary + (parseInt(e) || 0);
        return summary;
      }, 0);
      return ratioSum === 100 ? true : false;
    }
    depositToAllJars() {
      this.props.jarList.forEach((e, i) => {
        let ratedAmount = this.state.amount * this.state.ratioList[i] / 100;
        let convertedAmount = currencyConverter(ratedAmount, this.state.selectedCurrency, e.currency.symbol);
        this.addCoinsFn(convertedAmount, i);
      });
  
    }
    render() {
  
      return (
        <div>
          <select onChange={(e) => { this.setState({ selectedCurrency: e.target.value }) }} value={this.state.selectedCurrency}>
            {currencyList.map((element) => <option key={element.symbol} value={element.symbol}>{element.name}</option>)}
          </select>
          <input value={this.state.amount} onChange={(e) => { this.setState({ amount: e.target.value }) }} />
          <button onClick={() => { if (!this.validSubmitFn()) { alert('Total of all ratios must be equal 100%.'); return false; } this.depositToAllJars(); this.setState({ amount: 0 }) }} >Submit</button>
          <table border="1">
            <tbody>
              {this.props.jarList.map((e, i) =>
                <tr key={i}>
                  <td>Jar No: <b>{i}</b></td>
                  <td>Currency: <b>{e.currency.name}</b></td>
                  <td>Current amount: <b>{e.currentAmount.toFixed(2)} {e.currency.symbol}</b> </td>
                  <td><input type='number' onChange={(e) => {
                    let newRatioList = this.state.ratioList;
                    newRatioList[i] = e.target.value;
                    this.setState({ ratioList: newRatioList })
                  }} value={this.state.ratioList[i] || 0} /></td>
                </tr>
              )}
              <tr><td style={style.alignRight} colSpan="4">Total: {this.state.ratioList.reduce((summary, e) => {
                summary = summary + (parseInt(e) || 0);
                return summary;
              }, 0)} %</td></tr>
            </tbody>
          </table>
        </div>)
    }
  
  
  }

  export default GlobalDeposit;