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

class JarContainer extends Component {
  render(){
    return(
    <div>
      <p>Current Amount: <b>{this.props.amount}</b></p>
      <button onClick={this.props.amount =+ 100}>Increament</button>
    </div>
    )
  }
}

let uniqueJarsId = 0;
class SloikApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jars : [{
        id: uniqueJarsId++,
        currentAmount: 0
        }]
    }
  }
  addFn(amount, index) {
    const currentState = this.state;
    currentState.jars[index] =+ amount;
    this.setState = currentState;
  }
  render() {
    return (
      <div>
        <p>List of Jar's</p>
        <ul>
          {this.state.jars.map((e, index) => <li key={index}><JarContainer onAdd={addFn} amount={e.currentAmount} /></li>)}
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