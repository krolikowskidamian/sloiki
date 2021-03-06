// Etap 1. Funkcjonalność słoika.
// Do słoika można włożyć środki.
// Ze słoika można wyjąć środki.
// Można przejrzeć historię operacji w słoiku (przynajmniej czas wykonania, tytuł i kwota).
// Historię operacji można sortować (min. czas wykonania, opis lub kwota).
// Etap 2. Funkcjonalność wielu słoików.
// Można utworzyć więcej niż jeden słoik.
// Środki można przenosić między słoikami.
// Można wyświetlić historię wszystkich operacji i filtrować wg. słoików.
// Etap 3. Słoiki walutowe.
// Słoikowi i operacjom można przypisać walutę (jedną z kilku do wyboru).
// Do danego słoika wpłata może wpaść tylko jeśli waluta operacji odpowiada ustawionej dla słoika.
// Etap 4. Rozbijanie wpłat.
// Jeśli operacja nie ma ustawionego docelowego słoika, wpłata może być podzielona na kilka na podstawie ustawionych kryteriów procentowych (np. "słoik 1" dostaje 15%, "słoik 2" - 75%).
// Jeden ze słoików może być ustawiony jako domyślny - przyjmuje wtedy wszystkie wpłaty (lub pozostałości ich podziału), których nie da się dopasować inaczej.
console.log('Application START');
const {
  Component
} = React;
const tdStyle = {
  textAlign: 'center'
};
const thStyle = {
  cursor: 'pointer',
  borderBottom: '1px solid'
};
const alignRight = {
  textAlign: 'right'
};
const currencyList = [{
  symbol: 'pln',
  name: 'Polish Zlotych',
  ratio: 1
}, {
  symbol: '$',
  name: 'US Dollar',
  ratio: 3.5
}, {
  symbol: '€',
  name: 'Euro',
  ratio: 4
}];

const currencyConverter = (amount, from, to) => {
  let convertedValue = 0;
  const currencyFromRatio = currencyList.find(e => e.symbol === from).ratio;
  const currencyToRatio = currencyList.find(e => e.symbol === to).ratio;
  amount = parseFloat(amount);

  if (from === 'pln') {
    convertedValue = amount / currencyToRatio;
  } else {
    const fromPlnValue = amount * currencyFromRatio;
    convertedValue = fromPlnValue / currencyToRatio;
  }

  return convertedValue;
};

class GlobalDeposit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: 0,
      ratioList: [100],
      selectedCurrency: 'pln'
    };
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
    return React.createElement("div", null, React.createElement("select", {
      onChange: e => {
        this.setState({
          selectedCurrency: e.target.value
        });
      },
      value: this.state.selectedCurrency
    }, currencyList.map(element => React.createElement("option", {
      key: element.symbol,
      value: element.symbol
    }, element.name))), React.createElement("input", {
      value: this.state.amount,
      onChange: e => {
        this.setState({
          amount: e.target.value
        });
      }
    }), React.createElement("button", {
      onClick: () => {
        if (!this.validSubmitFn()) {
          alert('Total of all ratios must be equal 100%.');
          return false;
        }

        this.depositToAllJars();
        this.setState({
          amount: 0
        });
      }
    }, "Submit"), React.createElement("table", {
      border: "1"
    }, React.createElement("tbody", null, this.props.jarList.map((e, i) => React.createElement("tr", {
      key: i
    }, React.createElement("td", null, "Jar No: ", React.createElement("b", null, i)), React.createElement("td", null, "Currency: ", React.createElement("b", null, e.currency.name)), React.createElement("td", null, "Current amount: ", React.createElement("b", null, e.currentAmount.toFixed(2), " ", e.currency.symbol), " "), React.createElement("td", null, React.createElement("input", {
      type: "number",
      onChange: e => {
        let newRatioList = this.state.ratioList;
        newRatioList[i] = e.target.value;
        this.setState({
          ratioList: newRatioList
        });
      },
      value: this.state.ratioList[i] || 0
    })))), React.createElement("tr", null, React.createElement("td", {
      style: alignRight,
      colSpan: "4"
    }, "Total: ", this.state.ratioList.reduce((summary, e) => {
      summary = summary + (parseInt(e) || 0);
      return summary;
    }, 0), " %")))));
  }

}

class JarGlobalHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jarsFilter: ''
    };
  }

  render() {
    let prepareData;
    let jarList = this.props.globalHistory.reduce((summary, item) => {
      if (!summary.includes(item.jarId)) {
        summary.push(item.jarId);
      }

      return summary;
    }, []);
    let historyGlobalToShow = this.props.globalHistory.filter(e => {
      let filter = this.state.jarsFilter;

      if (!filter) {
        return true;
      } else {
        return e.jarId == filter;
      }
    });
    return React.createElement("div", null, React.createElement("select", {
      onChange: e => this.setState({
        jarsFilter: e.target.value
      }),
      value: this.state.jarsFilter
    }, React.createElement("option", {
      value: ""
    }, " - "), jarList.map((e, i) => React.createElement("option", {
      key: i,
      value: e
    }, "Jar No. ", e))), React.createElement("hr", null), React.createElement("pre", null, JSON.stringify(historyGlobalToShow)));
  }

}

class JarHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortField: 'timestamp',
      sortWay: 'DESC'
    };
  }

  changeSorting(sortField) {
    let sortWay = this.state.sortWay === 'DESC' ? 'ASC' : 'DESC';
    this.setState({
      sortField,
      sortWay
    });
  }

  render() {
    let preparedData = this.props.history.sort((a, b) => {
      const fieldToParse = ['modifier'];
      const fieldName = this.state.sortField;
      const sortWay = this.state.sortWay;
      let aComparer = a[fieldName];
      let bComparer = b[fieldName];

      if (fieldToParse.includes(fieldName)) {
        aComparer = parseFloat(aComparer);
        bComparer = parseFloat(bComparer);
      }

      if (aComparer > bComparer) {
        return sortWay === 'DESC' ? -1 : 1;
      }

      if (aComparer < bComparer) {
        return sortWay === 'DESC' ? 1 : -1;
      }

      if (aComparer == bComparer) {
        return 0;
      }
    });
    return React.createElement("div", null, React.createElement("h3", null, "History"), React.createElement("table", {
      width: "100%"
    }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", {
      style: thStyle,
      onClick: this.changeSorting.bind(this, 'method')
    }, "Method ", this.state.sortField === 'method' ? this.state.sortWay === 'DESC' ? '/\\' : '\\/' : ''), React.createElement("th", {
      style: thStyle,
      onClick: this.changeSorting.bind(this, 'timestamp')
    }, "Timestamp ", this.state.sortField === 'timestamp' ? this.state.sortWay === 'DESC' ? '/\\' : '\\/' : ''), React.createElement("th", {
      style: thStyle,
      onClick: this.changeSorting.bind(this, 'modifier')
    }, "Amount ", this.state.sortField === 'modifier' ? this.state.sortWay === 'DESC' ? '/\\' : '\\/' : ''))), React.createElement("tbody", null, preparedData.map((element, index) => React.createElement("tr", {
      key: index
    }, React.createElement("td", {
      style: tdStyle
    }, element.method), React.createElement("td", {
      style: tdStyle
    }, element.timestamp.toLocaleDateString(), " : ", element.timestamp.toLocaleTimeString()), React.createElement("td", {
      style: tdStyle
    }, React.createElement("b", null, parseFloat(element.modifier).toFixed(2), " ", element.currency)))))));
  }

}

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
      historySort: {
        field: 'timestamp',
        sort: 'DESC'
      },
      selectedJarIdId: props.element.index
    };
  }

  changeSorting(fieldName, sortWay) {
    this.setState({
      historySort: {
        field: fieldName,
        sort: sortWay
      }
    });
  }

  render() {
    return React.createElement("div", null, React.createElement("p", null, "Current Amount: ", React.createElement("b", null, this.props.element.e.currentAmount.toFixed(2)), " | Id of Jar: ", this.props.element.index, " | Currency: ", this.state.jarObj.currency.name, " "), React.createElement("div", null, " ", React.createElement("select", {
      onChange: e => {
        this.setState({
          selectedInputCurrency: e.target.value
        });
      },
      value: this.state.selectedInputCurrency
    }, currencyList.map(element => React.createElement("option", {
      key: element.symbol,
      value: element.symbol
    }, element.symbol))), React.createElement("input", {
      type: "number",
      onChange: a => {
        this.setState({
          amount: a.target.value
        });
      },
      value: this.state.amount
    }), React.createElement("button", {
      onClick: () => {
        if (this.state.selectedInputCurrency !== this.state.jarObj.currency.symbol) {
          alert(`Cannot operate in different currency than: ${this.state.jarObj.currency.name}`);
          return false;
        }

        this.props.fnHandlers.depositCoinsHandler(this.state.amount, this.props.element.index);
        this.setState({
          amount: ''
        });
      }
    }, "Deposit"), React.createElement("button", {
      onClick: () => {
        if (this.state.selectedInputCurrency !== this.state.jarObj.currency.symbol) {
          alert(`Cannot operate in different currency than: ${this.state.jarObj.currency.name}`);
          return false;
        }

        this.props.fnHandlers.withdrawCoinsHandler(this.state.amount, this.props.element.index);
        this.setState({
          amount: ''
        });
      }
    }, "Withdraw")), React.createElement("hr", null), React.createElement("div", null, React.createElement("span", null, this.state.jarObj.currency.name), React.createElement("input", {
      type: "number",
      onChange: a => {
        this.setState({
          amountToMove: a.target.value
        });
      },
      value: this.state.amountToMove
    }), React.createElement("select", {
      onChange: e => {
        this.setState({
          selectedJarIdId: e.target.value
        });
      },
      value: this.state.selectedJarIdId
    }, this.props.element.jars.map((el, i) => {
      return React.createElement("option", {
        key: i,
        value: i
      }, "Jar No: ", i, " (Current state: ", el.currentAmount.toFixed(2), ")");
    })), React.createElement("button", {
      onClick: () => {
        if (this.state.selectedInputCurrency !== this.props.element.jars[this.state.selectedJarIdId].currency.symbol) {
          alert(`Coins will be converted to the origin currency of picked Jar. (Jar's currency: ${this.props.element.jars[this.state.selectedJarIdId].currency.name}) `);
        }

        this.props.fnHandlers.moveCoinsHandler(this.state.amountToMove, this.props.element.index, this.state.selectedJarIdId, this.state.jarObj.currency);
        this.setState({
          amountToMove: ''
        });
      }
    }, "Move coins")), React.createElement(JarHistory, {
      history: this.state.jarObj.history
    }));
  }

}

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
    };
  }

  depositCoins(amount, index) {
    const currentState = this.state;
    const currencyName = this.state.jars[index].currency.name;

    if (isNaN(parseFloat(amount))) {
      return false;
    }

    currentState.jars[index].currentAmount = parseFloat(currentState.jars[index].currentAmount, 10) + parseFloat(amount, 10);
    currentState.globalHistory = [...this.state.globalHistory, {
      method: 'Deposit',
      jarId: index,
      amount: amount,
      timestamp: new Date()
    }];
    this.setState(currentState);
    this.addJarHistory({
      timestamp: new Date(),
      modifier: amount,
      currency: currencyName,
      currentState: currentState.jars[index].currentAmount,
      method: "Deposit",
      jarId: index
    }, index);
    return {
      timestamp: new Date(),
      modifier: amount,
      currentState: currentState.jars[index].currentAmount,
      method: "Deposit",
      jarId: index
    };
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

    currentState.globalHistory = [...this.state.globalHistory, {
      method: 'Withdraw',
      jarId: index,
      amount: amount,
      timestamp: new Date()
    }];
    this.setState(currentState);
    this.addJarHistory({
      timestamp: new Date(),
      modifier: amount,
      currency: currencyName,
      currentState: currentState.jars[index].currentAmount,
      method: "Withdraw",
      jarId: index
    }, index);
    return {
      timestamp: new Date(),
      modifier: amount,
      currentState: currentState.jars[index].currentAmount,
      method: "Withdraw",
      jarId: index
    };
  }

  moveCoins(amount, from, into, fromCurrencyObj) {
    if (from === into) {
      alert('Please select different Jar.');
      return false;
    }

    if (!into) {
      alert('Cannot move coins, there is no more Jars.');
      return false;
    }

    const intoJarCurrency = this.state.jars[into].currency;
    const currentState = this.state;

    if (isNaN(parseFloat(amount))) {
      return false;
    }

    if (parseFloat(currentState.jars[from].currentAmount, 10) < parseFloat(amount, 10)) {
      currentState.jars[from].currentAmount = 0;
      amount = parseFloat(currentState.jars[from].currentAmount, 10);
    } else {
      currentState.jars[from].currentAmount = parseFloat(currentState.jars[from].currentAmount, 10) - parseFloat(amount, 10);
    }

    if (amount === 0) {
      alert('No coins to move.');
      return false;
    }

    let convertedAmount = currencyConverter(amount, fromCurrencyObj.symbol, intoJarCurrency.symbol);
    currentState.jars[into].currentAmount = currentState.jars[into].currentAmount + parseFloat(convertedAmount, 10);
    currentState.globalHistory = [...this.state.globalHistory, {
      method: 'Move',
      jarId: from,
      moveToJar: into,
      amount: amount,
      currency: intoJarCurrency.name
    }];
    this.setState(currentState);
    this.addJarHistory({
      timestamp: new Date(),
      modifier: amount,
      currentState: currentState.jars[from].currentAmount,
      method: "Move out",
      currency: fromCurrencyObj.name,
      jarId: from
    }, from);
    this.addJarHistory({
      timestamp: new Date(),
      modifier: convertedAmount,
      currentState: currentState.jars[into].currentAmount,
      currency: intoJarCurrency.name,
      method: "Move in",
      jarId: into
    }, into);
    return {
      timestamp: new Date(),
      modifier: amount,
      currentState: currentState.jars[from].currentAmount,
      method: "Move out",
      currency: fromCurrencyObj.name,
      jarId: from
    };
  }

  addJar() {
    const selectedCurrency = this.state.selectedCurrency;
    const currentJars = this.state.jars.concat({
      currentAmount: 0,
      history: [],
      currency: currencyList.find(item => item.symbol === selectedCurrency)
    });
    const globalHistory = [...this.state.globalHistory, {
      method: 'New Jar',
      jarId: currentJars.length - 1,
      timestamp: new Date()
    }];
    this.setState({
      jars: currentJars,
      globalHistory
    });
  }

  removeJar() {
    let currentJars = this.state.jars.slice(0, -1);
    const globalHistory = [...this.state.globalHistory, {
      method: 'Remove Jar',
      jarId: currentJars.length + 1,
      timestamp: new Date()
    }];
    this.setState({
      jars: currentJars,
      globalHistory
    });
  }

  addJarHistory(historyRecord, jarId) {
    const state = this.state;
    state.jars[jarId].history = [...this.state.jars[jarId].history, historyRecord];
    this.setState(state);
  }

  render() {
    return React.createElement("div", null, React.createElement("h2", null, "Control panel"), React.createElement("hr", null), React.createElement("label", null, "Add/Remove JAR: "), React.createElement("button", {
      onClick: this.addJar.bind(this)
    }, "+"), React.createElement("button", {
      onClick: this.removeJar.bind(this)
    }, "-"), React.createElement("select", {
      onChange: e => {
        this.setState({
          selectedCurrency: e.target.value
        });
      },
      value: this.state.selectedCurrency
    }, currencyList.map(element => React.createElement("option", {
      key: element.symbol,
      value: element.symbol
    }, element.name))), React.createElement("hr", null), React.createElement("h3", null, "Global deposit panel"), React.createElement(GlobalDeposit, {
      jarList: this.state.jars,
      fnHandlers: {
        depositCoinsHandler: this.depositCoins.bind(this)
      }
    }), React.createElement("hr", null), React.createElement("h3", null, "List of Jar's"), this.state.jars.map((e, index) => React.createElement("div", {
      key: index
    }, React.createElement(JarContainer, {
      fnHandlers: {
        depositCoinsHandler: this.depositCoins.bind(this),
        withdrawCoinsHandler: this.withdrawCoins.bind(this),
        moveCoinsHandler: this.moveCoins.bind(this)
      },
      element: {
        e,
        index,
        jars: this.state.jars
      }
    }))), React.createElement("hr", null), React.createElement("h3", null, "Global History"), React.createElement(JarGlobalHistory, {
      globalHistory: this.state.globalHistory
    }));
  }

}

const render = () => {
  ReactDOM.render(React.createElement(SloikApp, null), document.getElementById('root'));
};

render(); // if (module != undefined && module.exports) {
//   module.exports = {
//     currencyList,
//     currencyConverter,
//     GlobalDeposit,
//     JarGlobalHistory,
//     JarHistory,
//     JarContainer,
//     SloikApp
//   }
// }