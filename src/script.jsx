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


console.log('Application START')
const { Component } = React;

const tdStyle = {
  textAlign: 'center'
}
const thStyle = {
  cursor: 'pointer',
  borderBottom: '1px solid'
}
class JarHistory extends Component {
  constructor(props) {
    super(props);
    this.state = { sortField: 'timestamp', sortWay: 'DESC' };
  }

  changeSorting(sortField) {
    let sortWay = this.state.sortWay === 'DESC' ? 'ASC' : 'DESC'
    this.setState({ sortField, sortWay });
  }

  render() {
    let preparedData = (this.props.history).sort((a, b) => {
      const fieldToParse = ['modifier'];
      const fieldName = this.state.sortField;
      const sortWay = this.state.sortWay;

      let aComparer = a[fieldName];
      let bComparer = b[fieldName];
      if (fieldToParse.includes(fieldName)) {
        aComparer = parseInt(aComparer);
        bComparer = parseInt(bComparer);
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
    return (
      <div>
        <h3>History</h3>
        <table width="100%">
          <thead>
            <tr>
              <th style={thStyle} onClick={this.changeSorting.bind(this, 'method')}>Method {this.state.sortField === 'method' ? (this.state.sortWay === 'DESC' ? '/\\' : '\\/') : ''}</th>
              <th style={thStyle} onClick={this.changeSorting.bind(this, 'timestamp')}>Timestamp {this.state.sortField === 'timestamp' ? (this.state.sortWay === 'DESC' ? '/\\' : '\\/') : ''}</th>
              <th style={thStyle} onClick={this.changeSorting.bind(this, 'modifier')}>Amount {this.state.sortField === 'modifier' ? (this.state.sortWay === 'DESC' ? '/\\' : '\\/') : ''}</th>
            </tr>
          </thead>
          <tbody>
            {preparedData.map((element, index) =>
              <tr key={index}>
                <td style={tdStyle} >{element.method}</td>
                <td style={tdStyle} >{element.timestamp.toLocaleDateString()} : {element.timestamp.toLocaleTimeString()}</td>
                <td style={tdStyle} ><b>{element.modifier}</b></td>
              </tr>)}
          </tbody>
        </table>
      </div>
    )

  }
}

class JarContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { amount: '', history: [], historySort: { field: 'timestamp', sort: 'DESC' } };

  }
  historyAppend(element) {
    if (!element) {
      alert('Please insert valid number!');
      return false;
    }
    let newHistory = [...this.state.history, element];
    this.setState({ history: newHistory });
  }
  changeSorting(fieldName, sortWay) {
    this.setState({ historySort: { field: fieldName, sort: sortWay } });
  }
  render() {
    return (
      <div>
        <pre>{JSON.stringify(this.state)}</pre>
        <pre>{JSON.stringify(this.props)}</pre>
        <p>Current Amount: <b>{this.props.element.e.currentAmount}</b> | Id of Jar: {this.props.element.index} </p>
        <input type="number" onChange={(a) => { this.setState({ amount: a.target.value }) }} value={this.state.amount} />
        <button onClick={() => { this.historyAppend(this.props.fnHandlers.onAdd(this.state.amount, this.props.element.index)); this.setState({ amount: '' }) }} >Increament</button>
        <button onClick={() => { this.historyAppend(this.props.fnHandlers.onRemove(this.state.amount, this.props.element.index)); this.setState({ amount: '' }) }} >Decreament</button>
        <div>

          <JarHistory history={this.state.history} />
        </div>
      </div>

    )
  }
}
class SloikApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jars: [{
        currentAmount: 0
      }]
    }
  }
  addFn(amount, index) {
    const currentState = this.state;
    if (isNaN(parseInt(amount))) {
      return false;
    }
    currentState.jars[index].currentAmount = parseInt(currentState.jars[index].currentAmount, 10) + parseInt(amount, 10);
    this.setState(currentState);
    return { timestamp: new Date(), modifier: amount, currentState: currentState.jars[index].currentAmount, method: "Increased" }
  }
  onRemove(amount, index) {
    const currentState = this.state;
    if (isNaN(parseInt(amount))) {
      return false;
    }
    if (parseInt(currentState.jars[index].currentAmount, 10) < parseInt(amount, 10)) {
      currentState.jars[index].currentAmount = 0;
    } else {
      currentState.jars[index].currentAmount = parseInt(currentState.jars[index].currentAmount, 10) - parseInt(amount, 10);
    }
    this.setState(currentState);
    return { timestamp: new Date(), modifier: amount, currentState: currentState.jars[index].currentAmount, method: "Decreased" }
  }
  addJar() {
    let currentJars = this.state.jars.concat({currentAmount:0});
    this.setState({jars: currentJars})
  }
  removeJar() {
    let currentJars = this.state.jars.slice(0,-1);
    this.setState({jars:currentJars});
  }
  render() {
    return (
      <div>
        <p>List of Jar's</p>
        <pre>{JSON.stringify(this.state)}</pre>
        <button onClick={this.addJar.bind(this)}>+</button>
        <button onClick={this.removeJar.bind(this)}>-</button>
        <ul>
          {this.state.jars.map((e, index) =>
            <li key={index}>
              <JarContainer fnHandlers={{ onAdd: this.addFn.bind(this), onRemove: this.onRemove.bind(this) }} element={{ e, index, jars: this.state.jars }} />
            </li>)}
        </ul>
      </div>
    )
  }
}

const render = () => {
  ReactDOM.render(
    <SloikApp />,
    document.getElementById('root')
  );
};

render();