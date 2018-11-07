export const style = {
  alignRight: {
    textAlign: 'right'
  },
  thStyle: {
    cursor: 'pointer',
    borderBottom: '1px solid'
  },
  tdStyle: {
    textAlign: 'center'
  }
}

export const currencyList = [
  { symbol: 'pln', name: 'Polish Zlotych', ratio: 1 },
  { symbol: '$', name: 'US Dollar', ratio: 3.5 },
  { symbol: '€', name: 'Euro', ratio: 4 },
]
export const currencyConverter = (amount, from, to) => {
  let convertedValue = 0;
  const currencyFromRatio = currencyList.find((e) => e.symbol === from).ratio;
  const currencyToRatio = currencyList.find((e) => e.symbol === to).ratio;
  amount = parseFloat(amount);
  if (from === 'pln') {
    convertedValue = amount / currencyToRatio;
  } else {
    const fromPlnValue = amount * currencyFromRatio;
    convertedValue = fromPlnValue / currencyToRatio;
  }

  return convertedValue;
}

