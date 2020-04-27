import React from 'react';
import _ from 'lodash';
import { Segment, Button, Input, Form, Grid } from 'semantic-ui-react';
import Answers from './Answers';
import Preview from './Preview';
import Select from 'react-select';
import makeAnimated from 'react-select/lib/animated';
import { InlineTex } from 'react-tex';
class AddQuestion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: props.categories,
      selCat: null,
      selTopic: null,
      previewData: 'Question Description with an equation: $x^2 + 2x = 0$',
      name: 'Question Name',
      value: '',
      options: {
        a: 'Option A',
        b: 'Option B',
        c: 'Option C',
        d: 'Option D',
      },
      topics: [],
      hints: 'A hint for your question',
      err: '',
    };
    this.catSelector = React.createRef();
    this.qname = React.createRef();
    this.qdef = React.createRef();
    this.exams = React.createRef();
    this.company = React.createRef();
    this.skill = React.createRef();
    this.topic = React.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handlePreviewChange = this.handlePreviewChange.bind(this);
    this.handleRadio = this.handleRadio.bind(this);
    this.handleAnswer = this.handleAnswer.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleTopicChange = this.handleTopicChange.bind(this);
    this.handleHintsChange = this.handleHintsChange.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
  }
  shouldComponentUpdate(nextProps, nextState) {
    nextState.categories = nextProps.categories;

    return true;
  }
  componentDidMount() {}
  toggleForm() {
    this.setState({ hidden: !this.state.hidden });
  }
  handleChange(e) {
    let { emit } = this.props;
    let data = {
      category: this.state.selCat,
      qname: this.state.name,
      qdef: this.state.previewData,
      options: this.state.options,
      answer: this.state.value,
      hints: this.state.hints,
      topic: this.state.selTopic,
    };
    if (data.category == null) {
      this.setState({ err: 'cat' });
      window.scrollTo(0, 0);
    } else if (data.topic == null) {
      this.setState({ err: 'top' });
      window.scrollTo(0, 0);
    } else if (
      data.qdef == 'Question Description with an equation: $x^2 + 2x = 0$' ||
      data.qdef.match(/[a-z]\w/gi) == null
    ) {
      this.setState({ err: 'def' });
      window.scrollTo(0, 0);
    } else if (data.answer == '') {
      this.setState({ err: 'ans' });
      window.scrollTo(0, 0);
    } else {
      let imageData = new FormData();
      imageData.append(
        'file',
        document.getElementById('file').files[0],
        'image'
      );
      emit('addQuestion', data);
    }
  }
  handleRadio(e, { value }) {
    this.setState({ value });
  }
  handlePreviewChange(e) {
    this.setState({ previewData: e.target.value });
  }
  handleNameChange(e) {
    this.setState({ name: e.target.value });
  }
  handleAnswer(e, opt) {
    let { options } = this.state;
    options[opt] = e.target.value;
    this.setState({ options: options });
  }
  handleCategoryChange(e) {
    this.setState({
      topics: e.topics,
      selCat: { _id: e.value, name: e.label },
    });
  }
  handleTopicChange(e) {
    this.setState({ selTopic: { _id: e.value, name: e.label } });
  }

  handleHintsChange(e) {
    this.setState({ hints: e.target.value });
  }
  render() {
    let { value, topics } = this.state;
    let { categories, grouped } = this.props;
    return (
      <div>
        <Form
          inverted={this.props.dark}
          id='addform'
          onSubmit={this.handleChange}
        >
          <Segment basic>
            <Form.Group widths='equal'>
              <Form.Field>
                <label>Select Branch</label>
                <Select
                  className='category-select'
                  ref={this.catSelector}
                  components={makeAnimated()}
                  options={_.map(categories, (k) => {
                    return {
                      value: k._id,
                      label: k.name,
                      topics: k.topics,
                    };
                  })}
                  onChange={this.handleCategoryChange}
                />
              </Form.Field>
              <Form.Field>
                <label>Select Course</label>
                <Select
                  className='category-select'
                  ref={this.catSelector}
                  components={makeAnimated()}
                  options={_.map(topics, (k) => {
                    return { value: k.id, label: k.name };
                  })}
                  isDisabled={topics.length == 0}
                  onChange={this.handleTopicChange}
                />
              </Form.Field>
            </Form.Group>
            {this.state.err == 'cat' ? (
              <div
                className='ui error message'
                style={{
                  display: 'block',
                  border: 'none',
                }}
              >
                Please select a branch
              </div>
            ) : null}
            {this.state.err == 'top' ? (
              <div
                className='ui error message'
                style={{
                  display: 'block',
                  border: 'none',
                }}
              >
                Please select a course
              </div>
            ) : null}
          </Segment>
          <Segment basic>
            <Form.Field>
              <label>Question Name</label>
              <Input
                onChange={this.handleNameChange}
                ref={this.qname}
                fluid
                size='large'
                placeholder='Question Name'
                required
              >
                <input />
              </Input>
            </Form.Field>
          </Segment>

          <Segment
            basic
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Form.Field>
              <label>Question Description</label>
              <Input fluid size='large' required>
                <textarea
                  onChange={this.handlePreviewChange}
                  placeholder='Question Description with an equation: $x^2 + 2x = 0$'
                />
              </Input>
              {this.state.err == 'def' ? (
                <div
                  className='ui error message'
                  style={{
                    display: 'block',
                    border: 'none',
                  }}
                >
                  Please fill this field up
                </div>
              ) : null}
            </Form.Field>
            <Button
              fluid
              basic
              primary
              content='Latex Guide'
              style={{ alignSelf: 'flex-end' }}
              onClick={(e) => {
                e.preventDefault();
                window.location.href =
                  'https://www.latex-tutorial.com/tutorials/';
              }}
            />
          </Segment>

          <Preview
            dark={this.props.dark}
            desc={this.state.previewData}
            name={this.state.name}
          />
          <Segment basic>
            <Form.Field>
              <Grid columns={2} divided>
                <Grid.Row>
                  <Grid.Column>
                    <Grid column={2}>
                      <Grid.Column className='radio-column'>
                        <Form.Radio
                          value='a'
                          checked={value == 'a'}
                          onChange={this.handleRadio}
                        />
                      </Grid.Column>
                      <Grid.Column className='input-column'>
                        <Input
                          required
                          placeholder='Option A'
                          size='small'
                          onChange={(e) => this.handleAnswer(e, 'a')}
                        />
                      </Grid.Column>
                    </Grid>
                  </Grid.Column>
                  <Grid.Column>
                    <Grid column={2}>
                      <Grid.Column className='radio-column'>
                        <Form.Radio
                          value='b'
                          checked={value == 'b'}
                          onChange={this.handleRadio}
                        />
                      </Grid.Column>
                      <Grid.Column className='input-column'>
                        <Input
                          required
                          placeholder='Option B'
                          size='small'
                          onChange={(e) => this.handleAnswer(e, 'b')}
                        />
                      </Grid.Column>
                    </Grid>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column>
                    <Grid column={2}>
                      <Grid.Column className='radio-column'>
                        <Form.Radio
                          value='c'
                          checked={value == 'c'}
                          onChange={this.handleRadio}
                        />
                      </Grid.Column>
                      <Grid.Column className='input-column'>
                        <Input
                          required
                          placeholder='Option C'
                          size='small'
                          onChange={(e) => this.handleAnswer(e, 'c')}
                        />
                      </Grid.Column>
                    </Grid>
                  </Grid.Column>
                  <Grid.Column>
                    <Grid column={2}>
                      <Grid.Column className='radio-column'>
                        <Form.Radio
                          value='d'
                          checked={value == 'd'}
                          onChange={this.handleRadio}
                        />
                      </Grid.Column>
                      <Grid.Column className='input-column'>
                        <Input
                          required
                          placeholder='Option D'
                          size='small'
                          onChange={(e) => this.handleAnswer(e, 'd')}
                        />
                      </Grid.Column>
                    </Grid>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
              {this.state.err == 'ans' ? (
                <div
                  className='ui error message'
                  style={{
                    display: 'block',
                    border: 'none',
                  }}
                >
                  Please choose the correct option
                </div>
              ) : null}
            </Form.Field>
            <Answers
              dark={this.props.dark}
              correct={value}
              options={this.state.options}
            />
            <Segment basic>
              <Form.Group widths='equal'>
                <Form.Field>
                  <Input fluid size='large'>
                    <input type='file' id='file' />
                  </Input>
                </Form.Field>
              </Form.Group>
            </Segment>

            <Form.Field>
              <label>Explanation</label>
              <Input
                fluid
                size='large'
                placeholder='Explanation for the question (will be shown once answered)'
                onChange={this.handleHintsChange}
                required
              >
                <input />
              </Input>
            </Form.Field>

            <Segment inverted={this.props.dark}>
              <b>Explanation:</b>{' '}
              <InlineTex texContent={this.state.hints} texSeperator='${1}' />
            </Segment>
          </Segment>
        </Form>
        <Segment basic style={{ margin: '0' }}>
          <Button
            onClick={(e) => {
              this.handleChange(e);
            }}
            form='addform'
            fluid
            primary
            className='addQButton'
          >
            Add Question
          </Button>
        </Segment>
        {this.props.error != '' ? (
          <Segment basic>
            <div
              className='ui error message'
              style={{
                display: 'block',
                border: 'none',
                height: '38px',
                fontSize: '1rem',
              }}
            >
              Error adding Question
            </div>
          </Segment>
        ) : null}
        {this.props.success != '' ? (
          <Segment basic>
            <div
              className='ui success message'
              style={{
                display: 'block',
                border: 'none',
                height: '38px',
                fontSize: '1rem',
              }}
            >
              Question successfully added
            </div>
          </Segment>
        ) : null}
      </div>
    );
  }
}

export default AddQuestion;
