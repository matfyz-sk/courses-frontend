import React, { Component } from 'react';
import { CardBody, Card, CardHeader, ListGroup, ListGroupItem } from 'reactstrap';
import AddTeam from './addTeam';

export default class Assignments extends Component{
  constructor(props){
    super(props);
    this.state={
      teams:[
        {id:0,title:'Jarovice',members:[{id:1,name:'Jaroslav',surname:'Matejovic'},{id:2,name:'Jaroslav',surname:'Biely'},{id:0,name:'Juraj',surname:'Macek'}]},
        {id:1,title:'Failures',members:[{id:4,name:'Barbora',surname:'Severna'},{id:5,name:'Martin',surname:'Juzny'},{id:0,name:'Juraj',surname:'Macek'}]}
      ],
      currentTeam:this.props.task.currentTeam,
    }
  }

  render(){
    return(
        <Card>
          <CardHeader>
            TEAMS (Current team - <span className="boldText">{this.state.teams.find((team)=>team.id===this.state.currentTeam).title}</span>)
          </CardHeader>
          <CardBody>
            <h2>All teams</h2>
            <ListGroup>
              {
                this.state.teams.map((team) =>
                  <ListGroupItem className="clickable" active={team.id===this.state.currentTeam} tag="button" action>
                    <h5>Name</h5>
                    {team.title}
                    <span className="p-l-10">
                      <h5>Members</h5>
                      {
                        team.members.map((member,index)=>
                          <span className="p-l-4">
                            {member.name+" "+member.surname + (member.id===0?" (you)":"")+(team.members.length===index+1?'':',')}
                          </span>
                        )
                      }
                    </span>
                  </ListGroupItem>
                )
              }
            </ListGroup>
            <AddTeam onToggle={()=>this.setState({addTeamOpen:!this.state.addTeamOpen})} />
          </CardBody>
        </Card>
    )
  }
}
