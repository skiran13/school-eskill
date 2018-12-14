import { Table, Grid, Button, Segment, Input } from 'semantic-ui-react'
import { Progress } from 'react-sweet-progress'
import React from 'react'
export default class CompletionTable extends React.Component {
  constructor (props) {
    super(props)
    this.state = { searchvalue: '' }
    this.accept = this.accept.bind(this)
  }
  updateSearch (e) {
    this.setState({ searchvalue: e.value })
  }
  componentDidMount () {}
  accept (s, action) {
    let { details, stateSet, emit } = this.props
    console.log('clicked')

    details.details.students = details.details.students.map(st => {
      if (st == s) {
        return { ...st, a: action || 'rejected' }
      }
      return st
    })

    stateSet('details', details)
    console.log(details)
    emit('acceptCourse', [s._id, s.cat, action, details])
  }
  render () {
    let { width, studentDetails } = this.props
    let { searchvalue } = this.state
    let { details } = this.props.details
    return (
      <Table>
        {width > 768 ? (
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell colSpan='4'>
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
              <Table.HeaderCell>Category</Table.HeaderCell>
              <Table.HeaderCell>Completion Level</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
        ) : null}
        <Table.Body>
          {[...studentDetails].reverse().map(s => {
            if (
              Object.values(s).find(a => {
                if (typeof a === 'string') {
                  let reg = new RegExp(searchvalue, 'gi')
                  return a.match(reg)
                }
              }) != undefined
            ) {
              return (
                <Table.Row key={s.name + s.cat}>
                  <Table.Cell>{s._id}</Table.Cell>
                  <Table.Cell>{s.name}</Table.Cell>
                  <Table.Cell>{s.cat}</Table.Cell>
                  <Table.Cell>
                    <Progress
                      percent={parseInt(s.c)}
                      status='success'
                      theme={{
                        success: {
                          color: '#1456ff',
                          symbol: s.c + '%'
                        }
                      }}
                    />
                  </Table.Cell>
                </Table.Row>
              )
            }
          })}
        </Table.Body>
      </Table>
    )
  }
}