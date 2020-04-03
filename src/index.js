import React from "react";
import ReactDOM from "react-dom";

import launches from "./launches.json";
import './index.css';

import humanizeDuration from "humanize-duration";


class DataTimer extends React.Component {
  constructor(props) {
    super(props);
    this.targetDate = this.props.date;
    this.state = {
      now: new Date()
    };
  }

  update() {
    this.setState({
      now: new Date(Date.now())
    })
  }

  componentDidMount() {
    this.timer = setInterval(
        () => this.update(),
        1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    var diff = Math.round((this.targetDate - this.state.now) / 1000) * 1000;
    var sign = Math.sign(diff);
    if (sign >= 1) {
      return `Осталось до старта ${humanizeDuration(diff, { language: 'ru' })}`;
    }
    else {
      return `Прошло со старта ${humanizeDuration(diff, { language: 'ru' })}`;
    }
  }

}

class DataElement extends React.Component {
  constructor(props) {
    super(props);
    var launch = props.value.launch;
    var quarter = (launch.quarter == null) ? 0 : launch.quarter - 1;
    var months = (launch.months == null) ? quarter * 3 : launch.months - 1;
    var date = (launch.date == null) ? 1 : launch.date;
    this.launchDate = new Date(launch.years, months, date, launch.hours, launch.minutes);
  }

  render() {
    return <tr>
      <td>{this.props.value.mission}</td>
      <td>{this.props.value.vehicle}</td>
      <td>{this.props.value.location}</td>
      <td><DataTimer date={this.launchDate}/></td>
    </tr>;
  }
}

class DataList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <table className={"responstable"}>
      <thead>
      <tr>
        <td>Mission</td><td>Vehicle</td><td>Location</td><td>Delta</td>
      </tr>
      </thead>
      <tbody>
        {this.props.map((value, i) => {
          return <DataElement value={value} key={i}/>;
        })}
      </tbody>
    </table>
  }
}

const domContainer = document.querySelector('#root');
ReactDOM.render(
    new DataList(launches).render(),
    domContainer);