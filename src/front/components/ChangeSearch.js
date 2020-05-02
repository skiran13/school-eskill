import { Header, Form, Segment } from 'semantic-ui-react';
import Select from 'react-select';
import React from 'react';
import history from './history';
export default class ChangeSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      modalVisible: false,
      filter: props.categories,
      faculty: [],
      selfac: null,
      selcat: null,
      selectedClass: null,
    };
  }
  componentDidMount() {}
  updateSearch(e) {
    this.setState({ searchValue: e.value });
  }
  handleCatChange(e) {
    this.setState({ selcat: e, seltop: null });
  }
  handleTopChange(e) {
    this.setState({ seltop: e });
  }
  handleClassChange(e) {
    this.setState({ selectedClass: e, selcat: null, seltop: null });
  }
  handleSubmit(e) {
    let number = document.getElementById('number').value;
    let { selcat, seltop } = this.state;
    if (selcat != null) {
      history.push(
        `/change/${selcat.label.replace(/ /g, '+')}/${seltop.label.replace(
          / /g,
          '+'
        )}/${number - 1}`
      );
    }
  }
  render() {
    let { categories, topics } = this.props;
    console.log(this.state);
    const classes = [
      { key: 'c1', label: 'Class 1', value: 'Class 1' },
      { key: 'c2', label: 'Class 2', value: 'Class 2' },
      { key: 'c3', label: 'Class 3', value: 'Class 3' },
      { key: 'c4', label: 'Class 4', value: 'Class 4' },
      { key: 'c5', label: 'Class 5', value: 'Class 5' },
      { key: 'c6', label: 'Class 6', value: 'Class 6' },
      { key: 'c7', label: 'Class 7', value: 'Class 7' },
      { key: 'c8', label: 'Class 8', value: 'Class 8' },
      { key: 'c9', label: 'Class 9', value: 'Class 9' },
      { key: 'c10', label: 'Class 10', value: 'Class 10' },
      { key: 'c11', label: 'Class 11', value: 'Class 11' },
      { key: 'c12', label: 'Class 12', value: 'Class 12' },
    ];
    return (
      <div>
        <Segment basic>
          <Header inverted={this.props.dark} as={'h3'}>
            Change Question
          </Header>
          <Form
            inverted={this.props.dark}
            onSubmit={(e) => this.handleSubmit()}
          >
            <Form.Field label='Choose Class' />
            <Form.Group>
              <Select
                value={this.state.selectedClass}
                onChange={(e) => this.handleClassChange(e)}
                options={classes}
                styles={{
                  container: (style) => ({ ...style, width: '100%' }),
                }}
              />
            </Form.Group>
            <Form.Field label='Choose Subject' />
            <Form.Group>
              <Select
                value={this.state.selcat}
                onChange={(e) => this.handleCatChange(e)}
                isDisabled={this.state.selectedClass == null}
                options={
                  this.state.selectedClass != null
                    ? categories
                        .filter(
                          (c) => c.class == this.state.selectedClass.value
                        )
                        .map((k) => ({
                          value: k._id,
                          label: k.name,
                          class: k.class,
                          topics: k.topics,
                        }))
                    : classes //temorary fix
                }
                styles={{
                  container: (style) => ({ ...style, width: '100%' }),
                }}
              />
            </Form.Group>
            <Form.Field label='Choose Topic' />
            <Form.Group>
              <Select
                value={this.state.seltop}
                onChange={(e) => this.handleTopChange(e)}
                isDisabled={this.state.selcat == null}
                options={
                  this.state.selcat == undefined
                    ? []
                    : this.state.selcat.topics.map((c) => ({
                        label: c.name,
                        value: c.id,
                      }))
                }
                styles={{
                  container: (style) => ({ ...style, width: '100%' }),
                }}
              />
            </Form.Group>
            <Form.Field label='Question Number' />
            <Form.Input
              type='number'
              fluid
              placeholder={'Enter the question number'}
              id='number'
            />

            <Form.Group widths='equal'>
              <Form.Button
                fluid
                type='cancel'
                onClick={(e) => {
                  e.preventDefault();
                  history.push(`/`);
                }}
              >
                Cancel
              </Form.Button>
              <Form.Button
                style={{ height: '36px' }}
                fluid
                primary
                type='submit'
              >
                Change
              </Form.Button>
            </Form.Group>
          </Form>
        </Segment>
      </div>
    );
  }
}
