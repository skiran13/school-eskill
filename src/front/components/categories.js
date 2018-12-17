import React from 'react'
import _ from 'lodash'
import {
  Sidebar,
  Segment,
  Button,
  Menu,
  Image,
  Container,
  Table,
  Icon,
  Header,
  Input,
  Form,
  Grid,
  Dropdown,
  Pagination,
  Modal
} from 'semantic-ui-react'
import Spinner from 'react-spinkit'
class Categories extends React.Component {
  constructor (props) {
    super(props)
    this.category = React.createRef()
    this.topic = React.createRef()
    this.topicSelect = React.createRef()
    this.state = {
      catError: '',
      topError: ''
    }
    this.handleCategory = this.handleCategory.bind(this)
    this.handleTopic = this.handleTopic.bind(this)
  }
  handleCategory (e) {
    e.preventDefault()
    let { emit } = this.props
    let category = this.category.current.inputRef.value

    if (category.match(/[a-z]\w/gi) !== null && category !== null) {
      this.props.loading('catSuccess')
      emit('addCategory', category)
    } else {
      this.setState({ catError: 'Invalid Category Name' })
    }
  }
  handleTopic (e) {
    if (this.topicSelect.current.state.value > 0) {
      let topic = this.topic.current.inputRef.value
      if (topic.match(/[a-z]\w/gi) !== null && topic !== null) {
        this.props.emit('addTopic', {
          category: this.props.categories[
            this.topicSelect.current.state.value - 1
          ].name,
          topic: topic
        })
        this.props.loading('topSuccess')
      } else {
        this.setState({ topError: 'Invalid Topic Name' })
      }
    } else {
      this.setState({ topError: 'Please Select a Category' })
    }
  }
  notify (c) {
    this.props.emit('categoryNotify', c)
  }
  removeTop (t) {
    this.props.emit('removeTop', t)
  }
  componentWillUpdate (nextProps, nextState) {
    if (this.props.catError !== nextProps.catError) {
      nextState.catError = nextProps.catError
      nextState.catSuccess = nextProps.catSuccess
    } else {
    }
    if (this.props.topError !== nextProps.topError) {
      nextState.topError = nextProps.topError
    } else {
    }
    return true
  }
  render () {
    let { categories, catSuccess, topSuccess } = this.props
    let { catError, topError } = this.state
    return (
      <Grid.Column width={8}>
        <Segment inverted={this.props.dark}>
          <Segment basic>
            <Header inverted={this.props.dark} size='large' textAlign='center'>
              Add New Branch/Course
            </Header>
            <Form onSubmit={this.handleCategory}>
              <Form.Field inline>
                <Input
                  fluid
                  size='large'
                  placeholder='Add Branch'
                  ref={this.category}
                >
                  <input
                    style={{
                      borderTopRightRadius: '0px',
                      borderBottomRightRadius: '0px'
                    }}
                  />
                  <Form.Button
                    primary
                    style={{
                      borderTopLeftRadius: '0px',
                      borderBottomLeftRadius: '0px',
                      height: '50px'
                    }}
                  >
                    <Icon
                      name='add'
                      style={{
                        margin: '0',
                        opacity: '1'
                      }}
                    />
                  </Form.Button>
                </Input>
              </Form.Field>
            </Form>
          </Segment>
          {
            <div
              className='ui'
              style={{
                display: catSuccess == 'load' ? 'flex' : 'none',
                justifyContent: 'center'
              }}
            >
              <Spinner color='#3281ff' name='circle' />
            </div>
          }
          {catSuccess == 'success' ? (
            <div
              className='ui success message'
              style={{
                display: 'block',
                border: 'none',
                margin: '0 3.5%'
              }}
            >
              Branch Successfully Added!
            </div>
          ) : null}
          <div
            className='ui error message'
            style={{
              display: catError == '' ? 'none' : 'block',
              border: 'none',
              margin: '0 3.5%'
            }}
          >
            {catError}
          </div>
          <Segment basic>
            <Form onSubmit={this.handleTopic}>
              <Form.Field inline>
                <Input
                  fluid
                  size='large'
                  placeholder='Add Course'
                  ref={this.topic}
                >
                  <Dropdown
                    placeholder='Select Branch'
                    selection
                    ref={this.topicSelect}
                    className='category-select'
                    options={_.map(categories, k => {
                      return { text: k.name, value: k._id }
                    })}
                    style={{
                      borderTopRightRadius: '0px',
                      borderBottomRightRadius: '0px'
                    }}
                  />
                  <input
                    style={{
                      borderRadius: '0px'
                    }}
                  />
                  <Button
                    primary
                    style={{
                      borderTopLeftRadius: '0px',
                      borderBottomLeftRadius: '0px'
                    }}
                  >
                    <Icon
                      name='add'
                      style={{
                        margin: '0',
                        opacity: '1'
                      }}
                    />
                  </Button>
                </Input>
              </Form.Field>
            </Form>
          </Segment>
          {
            <div
              className='ui'
              style={{
                display: topSuccess == 'load' ? 'flex' : 'none',
                justifyContent: 'center'
              }}
            >
              <Spinner color='#3281ff' name='circle' />
            </div>
          }
          {topSuccess == 'success' ? (
            <div
              className='ui success message'
              style={{
                display: 'block',
                border: 'none',
                margin: '0 3.5%'
              }}
            >
              Course Successfully Added!
            </div>
          ) : null}
          <div
            className='ui error message'
            style={{
              display: topError == '' ? 'none' : 'block',
              border: 'none',
              margin: '0 3.5%'
            }}
          >
            {topError}
          </div>
          <Segment basic>
            <Table inverted={this.props.dark}>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Course ID</Table.HeaderCell>
                  <Table.HeaderCell>Course Name</Table.HeaderCell>
                  <Table.HeaderCell>Notify</Table.HeaderCell>
                  <Table.HeaderCell>Remove</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {this.props.topics.map((t, i) => {
                  return (
                    <Table.Row key={i}>
                      <Table.Cell>{t.tid}</Table.Cell>
                      <Table.Cell>{t.name}</Table.Cell>
                      <Table.Cell>
                        {t.notified ? (
                          'Notified'
                        ) : (
                          <Button
                            style={{ height: '36px' }}
                            primary
                            onClick={e => this.notify(t)}
                          >
                            Notify
                          </Button>
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        <Button negative onClick={e => this.removeTop(t)}>
                          Remove
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  )
                })}
              </Table.Body>
            </Table>
          </Segment>
        </Segment>
      </Grid.Column>
    )
  }
}

export default Categories
