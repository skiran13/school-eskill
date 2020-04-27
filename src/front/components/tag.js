import React from 'react';
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
class Tag extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropVal: '',
      inputVal: '',
      tagError: '',
    };
    this.handleDropdown = this.handleDropdown.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }
  handleSubmit() {
    let { dropVal, inputVal } = this.state;
    if (dropVal == '') {
      this.setState({ tagError: 'Please choose a group!' });
    } else if (inputVal == '' || inputVal.match(/[a-z]\w/gi) == null) {
      this.setState({ tagError: 'Invalid Tag Name!' });
    } else {
      this.setState({ tagError: '' });
      this.props.emit('addTag', { group: dropVal, name: inputVal });
    }
  }
  handleInput(e) {
    this.setState({ inputVal: e.target.value });
  }
  handleDropdown(e, syn) {
    this.setState({ dropVal: syn.value });
  }
  componentWillUpdate(nextProps, nextState) {
    if (this.props.tagError !== nextProps.tagError) {
      nextState.tagError = nextProps.tagError;
      nextState.tagSuccess = nextProps.tagSuccess;
    } else {
    }
    return true;
  }
  render() {
    let { tagError } = this.state;
    let { tagSuccess, tags } = this.props;
    return (
      <Grid.Column width={8}>
        <Segment>
          <Form onSubmit={this.handleSubmit}>
            <Segment basic>
              <Header size='large' textAlign='center'>
                Add New Tag
              </Header>
              <Input fluid size='large' placeholder='Tag Name'>
                <Dropdown
                  onChange={this.handleDropdown}
                  placeholder='Choose Group'
                  selection
                  className='category-select'
                  options={[
                    {
                      text: 'Company',
                      value: 'company',
                    },
                    {
                      text: 'Exam',
                      value: 'exam',
                    },
                    {
                      text: 'Subject',
                      value: 'subject',
                    },
                    {
                      text: 'Topic',
                      value: 'topic',
                    },
                  ]}
                  style={{
                    borderTopRightRadius: '0px',
                    borderBottomRightRadius: '0px',
                  }}
                />
                <input
                  onChange={this.handleInput}
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
            </Segment>
            {tagSuccess == 'success' ? (
              <div
                className='ui success message'
                style={{
                  display: 'block',
                  border: 'none',
                  margin: '0 3.5%',
                }}
              >
                Tag Successfully Added!
              </div>
            ) : null}
            {tagError !== '' ? (
              <div
                className='ui error message'
                style={{
                  display: 'block',
                  border: 'none',
                  margin: '0 3.5%',
                }}
              >
                {tagError}
              </div>
            ) : null}
            {tags != null ? (
              <Segment basic>
                <Table>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Tag Name</Table.HeaderCell>
                      <Table.HeaderCell>Group Name</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {tags.map((t) => (
                      <Table.Row>
                        <Table.Cell>{t.name}</Table.Cell>
                        <Table.Cell
                          style={{
                            textTransform: 'capitalize',
                          }}
                        >
                          {t.group}
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </Segment>
            ) : null}
          </Form>
        </Segment>
      </Grid.Column>
    );
  }
}

export default Tag;
