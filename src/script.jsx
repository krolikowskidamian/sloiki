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

class jarHistory extends Component {
  render() {
    let preparedData;
    return (
      <div>
        <p>History</p>
        <table width="100%">
          <tr>
            <th>Method</th>
            <th>Timestamp</th>
            <th>Amount</th>
          </tr>
          {this.props.history.map((element, index) => <tr key={index}>
            <td style={tdStyle} ><b>{element.method}</b></td>
            <td style={tdStyle} >{element.timestamp.toLocaleDateString()} : {element.timestamp.toLocaleTimeString()}</td>
            <td style={tdStyle} ><b>{element.modifier}</b></td> </tr>)}

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
    let newHistory = [...this.state.history, element];
    this.setState({ history: newHistory });
  }
  changeSorting(fieldName, sortWay) {
    this.setState({ historySort: { field: fieldName, sort: sortWay } });
  }
  render() {
    let propertiess = this.props;
    return (
      <div>
        <pre>{JSON.stringify(this.state)}</pre>
        <pre>{JSON.stringify(this.props)}</pre>
        <p>Current Amount: <b>{this.props.element.e.currentAmount} ID: {this.props.element.e.id} </b></p>
        <input type="number" onChange={(a) => { this.setState({ amount: a.target.value }) }} value={this.state.amount} />
        <button onClick={() => { this.historyAppend(this.props.fnHandlers.onAdd(this.state.amount, this.props.element.index)); this.setState({ amount: '' }) }} >Increament</button>
        <button onClick={() => { this.historyAppend(this.props.fnHandlers.onRemove(this.state.amount, this.props.element.index)); this.setState({ amount: '' }) }} >Decreament</button>
        <div>


        </div>
      </div>

    )
  }
}
let uniqueJarsId = 10;
class SloikApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jars: [{
        id: uniqueJarsId++,
        currentAmount: 20
      }]
    }
  }
  addFn(amount, index) {
    const currentState = this.state;
    currentState.jars[index].currentAmount = parseInt(currentState.jars[index].currentAmount, 10) + parseInt(amount, 10);
    this.setState(currentState);
    return { timestamp: new Date(), modifier: amount, currentState: currentState.jars[index].currentAmount, method: "Increased" }
  }
  onRemove(amount, index) {
    const currentState = this.state;
    if (parseInt(currentState.jars[index].currentAmount, 10) < parseInt(amount, 10)) {
      currentState.jars[index].currentAmount = 0;
    } else {
      currentState.jars[index].currentAmount = parseInt(currentState.jars[index].currentAmount, 10) - parseInt(amount, 10);
    }
    this.setState(currentState);
    return { timestamp: new Date(), modifier: amount, currentState: currentState.jars[index].currentAmount, method: "Decreased" }
  }
  render() {
    return (
      <div>
        <p>List of Jar's</p>
        <pre>{JSON.stringify(this.state)}</pre>
        <ul>
          {this.state.jars.map((e, index) =>
            <li key={index}>
              <JarContainer fnHandlers={{ onAdd: this.addFn.bind(this), onRemove: this.onRemove.bind(this) }} element={{ e, index }} />
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