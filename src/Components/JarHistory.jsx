import React, { Component } from 'react'
import { style } from '../Helper'

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
    return (
      <div>
        <h3>History</h3>
        <table width="100%">
          <thead>
            <tr>
              <th style={style.thStyle} onClick={this.changeSorting.bind(this, 'method')}>Method {this.state.sortField === 'method' ? (this.state.sortWay === 'DESC' ? '/\\' : '\\/') : ''}</th>
              <th style={style.thStyle} onClick={this.changeSorting.bind(this, 'timestamp')}>Timestamp {this.state.sortField === 'timestamp' ? (this.state.sortWay === 'DESC' ? '/\\' : '\\/') : ''}</th>
              <th style={style.thStyle} onClick={this.changeSorting.bind(this, 'modifier')}>Amount {this.state.sortField === 'modifier' ? (this.state.sortWay === 'DESC' ? '/\\' : '\\/') : ''}</th>
            </tr>
          </thead>
          <tbody>
            {preparedData.map((element, index) =>
              <tr key={index}>
                <td style={style.tdStyle} >{element.method}</td>
                <td style={style.tdStyle} >{element.timestamp.toLocaleDateString()} : {element.timestamp.toLocaleTimeString()}</td>
                <td style={style.tdStyle} ><b>{parseFloat(element.modifier).toFixed(2)} {element.currency}</b></td>
              </tr>)}
          </tbody>
        </table>
      </div>
    )

  }
}

export default JarHistory;