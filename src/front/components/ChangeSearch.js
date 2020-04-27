import { Header, Form, Grid, Button, Segment, Input } from 'semantic-ui-react';
import { Progress } from 'react-sweet-progress';
import Select from 'react-select';
import React from 'react';
import history from './history';
export default class ChangeSearch extends React.Component {
  constructor(props) {
    super(props);
    super(props);
    this.state = {
      visible: false,
      modalVisible: false,
      filter: props.categories,
      faculty: [],
      selfac: null,
      selcat: null,
    };
  }
  componentDidMount() {}
  updateSearch(e) {
    this.setState({ searchValue: e.value });
  }
  handleCatChange(e) {
    this.setState({ selcat: e });
  }
  handleTopChange(e) {
    this.setState({ seltop: e });
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
            <Form.Field label='Choose Branch' />
            <Form.Group>
              <Select
                value={this.state.selcat}
                onChange={(e) => this.handleCatChange(e)}
                options={
                  categories == null
                    ? []
                    : categories.map((c) => ({
                        label: c.name,
                        value: c._id,
                        topics: c.topics,
                      }))
                }
                styles={{
                  container: (style) => ({ ...style, width: '100%' }),
                }}
              />
            </Form.Group>
            <Form.Field label='Choose Course' />
            <Form.Group>
              <Select
                value={this.state.seltop}
                onChange={(e) => this.handleTopChange(e)}
                options={
                  this.state.selcat == undefined
                    ? []
                    : this.state.selcat.topics.map((c) => ({
                        label: c.name,
                        value: c._id,
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
