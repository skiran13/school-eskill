import React from 'react';
import { Segment, Input, Icon, Header, Grid, Card } from 'semantic-ui-react';
import history from './history';
import 'react-circular-progressbar/dist/styles.css';
import CircularProgressbar from 'react-circular-progressbar';
import _ from 'lodash';

class StudentDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      modalVisible: false,
      filter: props.categories,
      searchContent: '',
    };
    this.logout = this.logout.bind(this);
    this.emit = this.emit.bind(this);
  }
  handleClick() {
    this.setState({ visible: !this.state.visible });
  }

  logout() {
    this.props.logout();
  }

  componentDidMount() {}
  emit(name, obj) {
    this.props.emit(name, obj);
  }
  updateSearch(e) {
    this.setState({ searchContent: e.value });
  }
  render() {
    let { qs: qstate, categories } = this.props;

    let questions = [],
      chunkedquestions = [];
    if (qstate != undefined) {
      questions = Object.keys(qstate);
      chunkedquestions = _.chunk(
        _.compact(
          _.flatten([
            'first',
            ...questions.map((x) => {
              return Object.keys(qstate[x]).map((key) => {
                if (
                  x.match(new RegExp(this.state.searchContent, 'gi')) ||
                  key.match(new RegExp(this.state.searchContent, 'gi'))
                ) {
                  return {
                    ...qstate[x][key],
                  };
                } else return null;
              });
            }),
          ])
        ),
        4
      );
    }

    return (
      <div>
        <Segment inverted={this.props.dark}>
          <Header as='h3'>Assigned Courses</Header>
        </Segment>
        <Segment basic>
          <Grid centered className='centered'>
            <Grid.Column width={14}>
              <Input
                fluid
                placeholder='Search'
                value={this.state.searchContent}
                onChange={(e, syn) => this.updateSearch(syn)}
              />
            </Grid.Column>
          </Grid>
        </Segment>
        <Segment
          basic
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Grid stackable container columns={4} style={{ flexGrow: '1' }}>
            {chunkedquestions.map((q, qi) => {
              return (
                <Grid.Row key={'row-' + qi}>
                  {q.map((qu, i) => {
                    if (qu != 'first') {
                      let qd = qu;
                      let attempted = 0;

                      let correct = 0;

                      let complete = 0;
                      if (qd.a === true) {
                        qd.q.map((x) => {
                          if (x.a > 0) {
                            attempted++;
                            if (x.a < 3) {
                              complete++;
                            }
                            if (x.a == 2) {
                              correct++;
                            }
                          }
                        });
                      }
                      return (
                        <Grid.Column
                          style={{ display: 'flex', justifyContent: 'center' }}
                          width={4}
                          key={'col-' + qi + '-' + i}
                        >
                          <Card
                            className='courseCard'
                            style={{
                              backgroundColor: this.props.dark
                                ? '#1b1c1d'
                                : '#fff',
                              borderColor: this.props.dark ? '#1b1c1d' : '#fff',
                              boxShadow: this.props.dark ? 'none' : null,
                            }}
                            onClick={(e) => {
                              if (qd.a === true) {
                                history.push(
                                  `/question/${qd.cat.replace(
                                    / /g,
                                    '+'
                                  )}/${qd.topic.replace(/ /g, '+')}`
                                );
                                this.props.stateSet('selcatname', qu);
                              }
                            }}
                          >
                            <Card.Content>
                              <Card.Header style={{ color: '#676d2d' }}>
                                {qd.topic}
                              </Card.Header>
                              <Card.Description>
                                {qd.a === false ? (
                                  <Header as='h3'>Awaiting Approval</Header>
                                ) : qd.a == 'rejected' ? (
                                  <Header as='h3'>Rejected</Header>
                                ) : (
                                  <CircularProgressbar
                                    percentage={(complete / qd.q.length) * 100}
                                    text={`${
                                      (complete / qd.q.length) * 100
                                    }% Complete`}
                                    styles={{
                                      path: { stroke: `#676d2d` },
                                      text: {
                                        fill: '#676d2d',
                                        fontSize: '8px',
                                        fontFamily: 'Lato, sans-serif',
                                      },
                                      root: {
                                        minWidth: '150px',
                                        minHeight: '150px',
                                      },
                                    }}
                                  />
                                )}
                              </Card.Description>
                            </Card.Content>
                            {qd.a === true ? (
                              <Card.Content
                                extra
                                style={{
                                  borderTopColor: this.props.dark
                                    ? '#666 !important'
                                    : null,
                                  color: this.props.dark ? '#fff' : null,
                                }}
                              >
                                <Icon name='tasks' />
                                {attempted} Questions Attempted
                              </Card.Content>
                            ) : null}
                            {qd.a === true ? (
                              <Card.Content
                                extra
                                style={{
                                  borderTopColor: this.props.dark
                                    ? '#666 !important'
                                    : null,
                                  color: this.props.dark ? '#fff' : null,
                                }}
                              >
                                <Icon name='checkmark' />
                                {correct} Answered Correctly
                              </Card.Content>
                            ) : null}
                          </Card>
                        </Grid.Column>
                      );
                    } else {
                      return (
                        <Grid.Column
                          style={{ display: 'flex', justifyContent: 'center' }}
                        >
                          <Card
                            style={{
                              height: '100%',
                              backgroundColor: this.props.dark
                                ? '#1b1c1d'
                                : '#fff',
                            }}
                            className='courseCard request-course'
                            onClick={(e) => {
                              history.push('/request');
                            }}
                          >
                            <Card.Content
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                textAlign: 'center',
                              }}
                            >
                              <Icon
                                name='add'
                                size='huge'
                                style={{
                                  alignSelf: 'center',
                                  color: '#676d2d',
                                }}
                              />
                              <Header as='h4'>Request Topic</Header>
                            </Card.Content>
                          </Card>
                        </Grid.Column>
                      );
                    }
                  })}
                </Grid.Row>
              );
            })}
            {chunkedquestions.length == 0 ? (
              <Grid.Row>
                <Grid.Column
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  <Card
                    style={{
                      height: '100%',
                      backgroundColor: this.props.dark ? '#1b1c1d' : '#fff',
                    }}
                    className='courseCard request-course'
                    onClick={(e) => {
                      history.push('/request');
                    }}
                  >
                    <Card.Content
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        textAlign: 'center',
                      }}
                    >
                      <Icon
                        name='add'
                        size='huge'
                        style={{ alignSelf: 'center', color: '#798162' }}
                      />
                      <Header as='h4'>Request Topic</Header>
                    </Card.Content>
                  </Card>
                </Grid.Column>
              </Grid.Row>
            ) : null}
          </Grid>
        </Segment>
      </div>
    );
  }
}

export default StudentDashboard;
