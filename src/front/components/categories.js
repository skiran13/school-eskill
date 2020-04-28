import React from 'react';
import _ from 'lodash';
import {
  Segment,
  Button,
  Table,
  Icon,
  Header,
  Input,
  Form,
  Grid,
  Dropdown,
} from 'semantic-ui-react';
import Spinner from 'react-spinkit';
class Categories extends React.Component {
  constructor(props) {
    super(props);
    this.category = React.createRef();
    this.topic = React.createRef();
    this.topicSelect = React.createRef();
    this.state = {
      catError: '',
      topError: '',
    };
    this.handleCategory = this.handleCategory.bind(this);
    this.handleTopic = this.handleTopic.bind(this);
  }
  handleCategory(e) {
    e.preventDefault();
    let { emit } = this.props;
    let c = {
      category: this.category.current.inputRef.value,
      classes: document.querySelector('#classes').innerText,
    };

    if (
      c.category.match(/[a-z]\w/gi) !== null &&
      c.category !== null &&
      c.classes !== 'Select Class' &&
      c.classes !== null
    ) {
      this.props.loading('catSuccess');
      emit('addCategory', c);
    } else {
      this.setState({ catError: 'Invalid Class/Subject Name' });
    }
  }
  handleTopic(e) {
    if (this.topicSelect.current.state.value > 0) {
      let topic = this.topic.current.inputRef.value;
      if (topic.match(/[a-z]\w/gi) !== null && topic !== null) {
        this.props.emit('addTopic', {
          category: this.props.categories[
            this.topicSelect.current.state.value - 1
          ].name,
          topic: topic,
        });
        this.props.loading('topSuccess');
      } else {
        this.setState({ topError: 'Invalid Topic Name' });
      }
    } else {
      this.setState({ topError: 'Please Select a Category' });
    }
  }
  notify(c) {
    this.props.emit('categoryNotify', c);
  }
  removeTop(t) {
    this.props.emit('removeTop', t);
  }
  removeCat(t) {
    this.props.emit('removeCat', t);
  }
  componentWillUpdate(nextProps, nextState) {
    if (this.props.catError !== nextProps.catError) {
      nextState.catError = nextProps.catError;
      nextState.catSuccess = nextProps.catSuccess;
    } else {
    }
    if (this.props.topError !== nextProps.topError) {
      nextState.topError = nextProps.topError;
    } else {
    }
    return true;
  }
  render() {
    let { categories, catSuccess, topSuccess } = this.props;
    let { catError, topError } = this.state;
    const classes = [
      { key: 'c1', text: 'Class 1', value: 'Class 1' },
      { key: 'c2', text: 'Class 2', value: 'Class 2' },
      { key: 'c3', text: 'Class 3', value: 'Class 3' },
      { key: 'c4', text: 'Class 4', value: 'Class 4' },
      { key: 'c5', text: 'Class 5', value: 'Class 5' },
      { key: 'c6', text: 'Class 6', value: 'Class 6' },
      { key: 'c7', text: 'Class 7', value: 'Class 7' },
      { key: 'c8', text: 'Class 8', value: 'Class 8' },
      { key: 'c9', text: 'Class 9', value: 'Class 9' },
      { key: 'c10', text: 'Class 10', value: 'Class 10' },
      { key: 'c11', text: 'Class 11', value: 'Class 11' },
      { key: 'c12', text: 'Class 12', value: 'Class 12' },
    ];
    console.log(this.props);
    return (
      <Grid.Column width={8}>
        <Segment inverted={this.props.dark}>
          <Segment basic>
            <Header inverted={this.props.dark} size='large' textAlign='center'>
              Add New Subject
            </Header>
            <Form onSubmit={this.handleCategory}>
              <Form.Field inline>
                <Input
                  fluid
                  size='large'
                  placeholder='Add Subject'
                  ref={this.category}
                >
                  <Dropdown
                    placeholder='Select Class'
                    selection
                    id='classes'
                    ref={this.topicSelect}
                    className='category-select'
                    options={classes}
                    style={{
                      borderTopRightRadius: '0px',
                      borderBottomRightRadius: '0px',
                      height: '50px',
                    }}
                  />
                  <input
                    style={{
                      borderTopRightRadius: '0px',
                      borderBottomRightRadius: '0px',
                    }}
                  />
                  <Form.Button
                    primary
                    style={{
                      borderTopLeftRadius: '0px',
                      borderBottomLeftRadius: '0px',
                      height: '50px',
                    }}
                  >
                    <Icon
                      name='add'
                      style={{
                        margin: '0',
                        opacity: '1',
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
                justifyContent: 'center',
              }}
            >
              <Spinner color='#798162' name='circle' />
            </div>
          }
          {catSuccess == 'success' ? (
            <div
              className='ui success message'
              style={{
                display: 'block',
                border: 'none',
                margin: '0 3.5%',
              }}
            >
              Subject Successfully Added!
            </div>
          ) : null}
          <div
            className='ui error message'
            style={{
              display: catError == '' ? 'none' : 'block',
              border: 'none',
              margin: '0 3.5%',
            }}
          >
            {catError}
          </div>
          <Segment basic>
            <Table inverted={this.props.dark}>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Subject ID</Table.HeaderCell>
                  <Table.HeaderCell>Subject Name</Table.HeaderCell>
                  <Table.HeaderCell>Class</Table.HeaderCell>
                  <Table.HeaderCell>Remove</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {this.props.categories.map((t, i) => {
                  return (
                    <Table.Row key={i}>
                      <Table.Cell>{t._id}</Table.Cell>
                      <Table.Cell>{t.name}</Table.Cell>
                      <Table.Cell>{t.class}</Table.Cell>
                      <Table.Cell>
                        <Button negative onClick={(e) => this.removeCat(t)}>
                          Remove
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
          </Segment>
          <Segment basic>
            <Form onSubmit={this.handleTopic}>
              <Form.Field inline>
                <Input
                  fluid
                  size='large'
                  placeholder='Add Topic'
                  ref={this.topic}
                >
                  <Dropdown
                    placeholder='Select Subject'
                    selection
                    ref={this.topicSelect}
                    className='category-select'
                    options={_.map(categories, (k) => {
                      return { text: k.name, value: k._id };
                    })}
                    style={{
                      borderTopRightRadius: '0px',
                      borderBottomRightRadius: '0px',
                      height: '50px',
                    }}
                  />
                  <input
                    style={{
                      borderRadius: '0px',
                    }}
                  />
                  <Button
                    primary
                    style={{
                      borderTopLeftRadius: '0px',
                      borderBottomLeftRadius: '0px',
                    }}
                  >
                    <Icon
                      name='add'
                      style={{
                        margin: '0',
                        opacity: '1',
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
                justifyContent: 'center',
              }}
            >
              <Spinner color='#798162' name='circle' />
            </div>
          }
          {topSuccess == 'success' ? (
            <div
              className='ui success message'
              style={{
                display: 'block',
                border: 'none',
                margin: '0 3.5%',
              }}
            >
              Topic Successfully Added!
            </div>
          ) : null}
          <div
            className='ui error message'
            style={{
              display: topError == '' ? 'none' : 'block',
              border: 'none',
              margin: '0 3.5%',
            }}
          >
            {topError}
          </div>
          <Segment basic>
            <Table inverted={this.props.dark}>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Topic ID</Table.HeaderCell>
                  <Table.HeaderCell>Topic Name</Table.HeaderCell>
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
                            onClick={(e) => this.notify(t)}
                          >
                            Notify
                          </Button>
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        <Button negative onClick={(e) => this.removeTop(t)}>
                          Remove
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
          </Segment>
        </Segment>
      </Grid.Column>
    );
  }
}

export default Categories;
