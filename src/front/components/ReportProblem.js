import { Table, Pagination, Input } from 'semantic-ui-react';
import React from 'react';
export default class RequestProblem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { searchValue: '', activePage: 1 };
  }
  componentDidMount() {}
  updateSearch(e) {
    this.setState({ searchValue: e.value });
  }
  handlePaginationChange = (e, { activePage }) => this.setState({ activePage });
  render() {
    let { details } = this.props.details;
    let { width } = this.props;
    let problems = [];
    if (details.problems != undefined) {
      problems = details.problems;
    }
    return (
      <Table inverted={this.props.dark}>
        {width > 768 ? (
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell colSpan='7'>
                <Input
                  fluid
                  placeholder='Search'
                  onChange={(e, syn) => this.updateSearch(syn)}
                />
              </Table.HeaderCell>
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell>Student ID</Table.HeaderCell>
              <Table.HeaderCell>Student Name</Table.HeaderCell>
              <Table.HeaderCell>Question Category</Table.HeaderCell>
              <Table.HeaderCell>Question Topic</Table.HeaderCell>
              <Table.HeaderCell>Question Number</Table.HeaderCell>
              <Table.HeaderCell>Problem Description</Table.HeaderCell>
              <Table.HeaderCell>Resolved</Table.HeaderCell>
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
                  <Table.Row key={s.name + '-problem-' + s.n}>
                    <Table.Cell>{s.sid}</Table.Cell>
                    <Table.Cell>{s.name}</Table.Cell>
                    <Table.Cell>{s.cat.name}</Table.Cell>
                    <Table.Cell>{s.topic.name}</Table.Cell>
                    <Table.Cell>{s.n}</Table.Cell>
                    <Table.Cell>{s.desc}</Table.Cell>

                    <Table.Cell>
                      {s.resolution === false
                        ? 'Pending Resolution'
                        : s.resolution === true
                        ? 'Resolved'
                        : 'Rejected'}
                    </Table.Cell>
                  </Table.Row>
                );
              }
            })}
          <Table.Row>
            <Table.Cell colSpan={6}>
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
