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

class JarContainer extends Component {
  render() {
    return React.createElement("div", null, React.createElement("p", null, "Current Amount: ", React.createElement("b", null, this.props.amount)), React.createElement("button", {
      onClick: this.props.amount = +100
    }, "Increament"));
  }

}

let uniqueJarsId = 0;

class SloikApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jars: [{
        id: uniqueJarsId++,
        currentAmount: 0
      }]
    };
  }

  render() {
    return React.createElement("div", null, React.createElement("p", null, "List of Jar's"), React.createElement("ul", null, this.state.jars.map(e => React.createElement("li", {
      key: e.id
    }, React.createElement(JarContainer, {
      amount: e.currentAmount
    })))));
  }

}

const render = () => {
  ReactDOM.render(React.createElement(SloikApp, null), document.getElementById('root'));
};

render();