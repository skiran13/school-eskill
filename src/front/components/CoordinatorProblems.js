import { Table, Grid, Button, Input, Pagination } from 'semantic-ui-react';
import React from 'react';
import ChangeModal from './ChangeModal';
import { server } from '../enpoint';
export default class CoordinatorProblems extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      visible: false,
      cat: '',
      n: '',
      topic: '',
      activePage: 1,
    };
    this.resolve = this.resolve.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }
  componentDidMount() {}
  updateSearch(e) {
    this.setState({ searchValue: e.value });
  }
  handlePaginationChange = (e, { activePage }) => this.setState({ activePage });
  setProblem(p) {
    this.setState({ problem: p }, () => {
      this.resolve(false);
    });
  }
  handleButtonClick(e) {
    let obj = this.props.details.details;
    obj.problems = obj.problems.filter((e) => e.resolution == false);
    fetch(server + '/api/clearallproblems', {
      body: JSON.stringify(obj),
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }).then(this.forceUpdate());
  }
  handleClick(e, n, cat, p, topic) {
    this.setState({
      n: n,
      cat: cat || '',
      topic: topic || '',
      visible: !this.state.visible,
      problem: p,
    });
  }
  resolve(action) {
    let { emit } = this.props;
    emit('resolve', { problem: this.state.problem, action: action });
    this.setState({ visible: false });
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.details.details.problems !=
        nextProps.details.details.problems ||
      nextState != this.state
    ) {
      return true;
    }
    return false;
  }
  render() {
    let { details } = this.props.details;
    let { width } = this.props;
    let problems = [];
    if (details.problems != undefined) {
      problems = details.problems;
    }
    return (
      <Table stackable inverted={this.props.dark}>
        {width > 768 ? (
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell colSpan='5'>
                <Input
                  fluid
                  placeholder='Search'
                  onChange={(e, syn) => this.updateSearch(syn)}
                />
              </Table.HeaderCell>
              <Table.HeaderCell colSpan='2'>
                {' '}
                <Button
                  onClick={this.handleButtonClick}
                  style={{ height: '50px' }}
                  color='google plus'
                  fluid
                >
                  Clear all Resolved Problems
                </Button>
              </Table.HeaderCell>
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell>Student ID</Table.HeaderCell>
              <Table.HeaderCell>Student Name</Table.HeaderCell>
              <Table.HeaderCell>Question Branch</Table.HeaderCell>
              <Table.HeaderCell>Question Course</Table.HeaderCell>
              <Table.HeaderCell>Question Number</Table.HeaderCell>
              <Table.HeaderCell>Problem Description</Table.HeaderCell>
              <Table.HeaderCell>Solve</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
        ) : null}
        <Table.Body>
          {[...problems]
            .reverse()
            .filter((s) => {
              return (
                Object.values(s).find((a) => {
                  if (typeof a === 'string') {
                    let reg = new RegExp(this.state.searchValue, 'gi');
                    return a.match(reg);
                  }
                }) != undefined
              );
            })
            .map((s, index) => {
              if (
                index < this.state.activePage * 10 &&
                index > this.state.activePage * 10 - 11
              ) {
                return (
                  <Table.Row key={s.name + '-problem-' + s.n + Math.random()}>
                    <Table.Cell>{s.sid}</Table.Cell>
                    <Table.Cell>{s.name}</Table.Cell>
                    <Table.Cell>{s.cat.name}</Table.Cell>
                    <Table.Cell>{s.topic.name}</Table.Cell>
                    <Table.Cell>{s.n}</Table.Cell>
                    <Table.Cell>{s.desc}</Table.Cell>
                    <Table.Cell>
                      {this.state.visible ? (
                        <ChangeModal
                          visible={this.state.visible}
                          n={this.state.n}
                          dark={this.props.dark}
                          cat={this.state.cat}
                          handleClick={this.handleClick}
                          chError={this.props.chError}
                          chSuccess={this.props.chSuccess}
                          topic={this.state.topic}
                          resolve={this.resolve}
                          emit={this.props.emit}
                        />
                      ) : null}
                      {s.resolution === false ? (
                        <Grid padded={false} columns={2} stackable>
                          <Grid.Column style={{ padding: '5px' }}>
                            <Button
                              fluid
                              negative
                              icon='close'
                              onClick={(e) => this.setProblem(s)}
                            />
                          </Grid.Column>
                          <Grid.Column style={{ padding: '5px' }}>
                            <Button
                              fluid
                              icon='check'
                              positive
                              onClick={(e) =>
                                this.handleClick(
                                  e,
                                  s.n,
                                  s.cat.name.replace(/ /g, '+'),
                                  s,
                                  s.topic.name.replace(/ /g, '+')
                                )
                              }
                            />
                          </Grid.Column>
                        </Grid>
                      ) : s.resolution === true ? (
                        'Resolved'
                      ) : (
                        'Rejected'
                      )}
                    </Table.Cell>
                  </Table.Row>
                );
              }
            })}
          <Table.Row>
            <Table.Cell colSpan={7}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  width: '100%',
                }}
              >
                <Pagination
                  inverted={this.props.dark}
                  activePage={this.state.activePage}
                  boundaryRange={1}
                  onPageChange={this.handlePaginationChange}
                  siblingRange={1}
                  totalPages={
                    problems != undefined
                      ? parseInt(problems.length / 10) + 1
                      : 0
                  }
                  ellipsisItem
                  prevItem
                  siblingRange={2}
                  nextItem
                />
              </div>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
  }
}
