import React, {Component} from 'react'

class JarGlobalHistory extends Component {
    constructor(props) {
      super(props);
      this.state = { jarsFilter: '' }
    }
  
  
    render() {
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
      })
      return (
        <div>
          <select onChange={e => this.setState({ jarsFilter: e.target.value })} value={this.state.jarsFilter} >
            <option value=""> - </option>
            {jarList.map((e, i) => <option key={i} value={e}>Jar No. {e}</option>)}
          </select>
          <hr />
          <pre>
            {JSON.stringify(historyGlobalToShow)}
          </pre>
        </div>
      )
    }
  }

  export default JarGlobalHistory;