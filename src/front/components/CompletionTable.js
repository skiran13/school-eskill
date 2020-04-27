import { Table, Pagination, Input } from 'semantic-ui-react';
import { Progress } from 'react-sweet-progress';
import React from 'react';
export default class CompletionTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { searchvalue: '', activePage: 1 };
    this.accept = this.accept.bind(this);
  }
  updateSearch(e) {
    this.setState({ searchvalue: e.value });
  }
  componentDidMount() {}
  accept(s, action) {
    let { details, stateSet, emit } = this.props;

    details.details.students = details.details.students.map((st) => {
      if (st == s) {
        return { ...st, a: action || 'rejected' };
      }
      return st;
    });

    stateSet('details', details);
    emit('acceptCourse', [s._id, s.cat, action, details]);
  }
  handlePaginationChange = (e, { activePage }) => this.setState({ activePage });
  render() {
    let { width, studentDetails } = this.props;
    let { searchvalue } = this.state;
    let { details } = this.props.details;
    return (
      <Table inverted={this.props.dark}>
        {width > 768 ? (
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell colSpan='6'>
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
              <Table.HeaderCell>Branch</Table.HeaderCell>
              <Table.HeaderCell>Course</Table.HeaderCell>
              <Table.HeaderCell>Completion Level</Table.HeaderCell>
              <Table.HeaderCell>Correct Answers</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
        ) : null}
        <Table.Body>
          {[...studentDetails]
            .reverse()
            .filter((s) => {
              return (
                Object.values(s).find((a) => {
                  if (typeof a === 'string') {
                    let reg = new RegExp(this.state.searchvalue, 'gi');
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
                  <Table.Row key={s.name + s.cat + s.topic}>
                    <Table.Cell>{s._id}</Table.Cell>
                    <Table.Cell>{s.name}</Table.Cell>
                    <Table.Cell>{s.cat}</Table.Cell>
                    <Table.Cell>{s.topic}</Table.Cell>
                    <Table.Cell>
                      <Progress
                        percent={parseInt(s.c)}
                        status='success'
                        theme={{
                          success: {
                            color: '#3281ff',
                            symbol: s.c + '%',
                            trailColor: this.props.dark ? '#fff' : '#efefef',
                          },
                        }}
                      />
                    </Table.Cell>
                    <Table.Cell textAlign='center'>{s.cor}</Table.Cell>
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
                    studentDetails != undefined
                      ? parseInt(studentDetails.length / 10) + 1
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
