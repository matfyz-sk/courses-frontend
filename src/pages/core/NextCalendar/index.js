import React from "react";
import { Card } from "reactstrap";
import './NextCalendar.css';

const Next3Events = [
  {name: 'Choose Team members', endDate: '2020-05-01T17:00+01:00'},
  {name: 'Project Topic', endDate: '2020-05-02T15:00+01:00'},
  {name: 'Quadterm', endDate: '2020-05-28T11:00+01:00'},
];

class NextCalendar extends React.Component {
  constructor(props) {
    super(props);
    this.daysOfTheWeek = [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday' ];
    this.monthsOfTheYear = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
      'October', 'November', 'December' ];
    this.state = {
      events: Next3Events,
    };
  }

  componentDidMount() {
    let events = this.state.events;

    events.map(event => {
      let dateTime = (new Date(event.endDate));
      event.day = dateTime.getDate();
      event.dayOfTheWeek = this.daysOfTheWeek[dateTime.getDay()];
      let month = dateTime.getMonth();
      event.month = this.monthsOfTheYear[month];
      let hours = dateTime.getHours();
      let hoursFormated = (hours < 10 ? '0' + hours : hours);
      let minutes = dateTime.getMinutes();
      let minutesFormated = (minutes < 10 ? '0' + minutes : minutes);
      event.time = hoursFormated + ':' + minutesFormated;
      return event;
    });

    this.setState({
      events: events,
    })
  }

  render() {
    return (
      <Card className='next-calendar'>
        { this.state.events.map((event, index) => (
          <React.Fragment key={ index }>
            <div className='next-calendar-top next-calendar-header'>
              <div className='next-calendar-left'>
                <div className='next-calendar-date'>{ event.day }</div>
                <div className='next-calendar-above'>
                  <span>{ event.dayOfTheWeek }</span>
                  <span>{ event.month }</span>
                </div>

              </div>
              <div className='next-calendar-right'>
                <div className='next-calendar-time'>{ event.time }</div>
              </div>
            </div>
            <div className='next-calendar-name'>{ event.name }</div>
          </React.Fragment>
        )) }
      </Card>
    )
  }
}

export default NextCalendar;
