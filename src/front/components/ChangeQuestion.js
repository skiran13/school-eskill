import React from 'react';
import _ from 'lodash';
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
  TextArea,
  Grid,
  Dropdown,
  Pagination,
  Modal,
} from 'semantic-ui-react';
import Answers from './Answers';
import Preview from './Preview';
import Select from 'react-select';
import Spinner from 'react-spinkit';
import makeAnimated from 'react-select/lib/animated';
import { InlineTex } from 'react-tex';
import { server } from '../enpoint';

class ChangeQuestion extends React.Component {
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
      loading: true,
      err: false,
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
  componentDidMount() {
    let { category, n, topic } = this.props;
    let cat = category.replace(/[+]/g, ' ');
    let top = topic.replace(/[+]/g, ' ');
    //Changes for running local
    fetch(server + '/api/question', {
      body: JSON.stringify({ n: n, cat: cat, topic: top }),
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((question) => {
        if (!question.err && question.question != null) {
          let { question: q } = question;
          this.setState({
            selCat: q.category,
            previewData: q.qdef,
            name: q.qname,
            options: q.options,
            hints: q.hints,
            value: q.answer,
            oldCat: cat,
            oldtop: top,
            oldn: n,
            loading: false,
          });
        } else {
          this.setState({ loading: false, err: true });
        }
      });
  }
  toggleForm() {
    this.setState({ hidden: !this.state.hidden });
  }
  handleChange(e) {
    let { emit, afterEmit } = this.props;
    let data = {
      category: this.state.selCat,
      qname: this.state.name,
      qdef: this.state.previewData,
      options: this.state.options,
      answer: this.state.value,
      hints: this.state.hints,
      topic: this.state.oldtop,
    };
    if (data.category == null) {
      this.setState({ err: 'cat' });
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
      emit('questionChange', {
        changed: data,
        cat: this.state.oldCat,
        n: this.state.oldn,
        topic: this.state.oldtop,
      });
      if (afterEmit != undefined) {
        afterEmit(true);
      }
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
    let { value, topics, loading, err } = this.state;
    let { categories, grouped } = this.props;
    if (loading) {
      return (
        <Segment inverted={this.props.dark} basic>
          <Spinner color='#3281ff' name='circle' />
        </Segment>
      );
    }
    if (err) {
      return (
        <Segment inverted={this.props.dark} basic>
          Question not found
        </Segment>
      );
    }
    return (
      <Grid stackable centered>
        <Grid.Column width={this.props.modal ? 16 : 14}>
          <Segment inverted={this.props.dark} basic={this.props.modal}>
            <Form
              inverted={this.props.dark}
              id='addform'
              onSubmit={this.handleChange}
            >
              <Segment basic>
                <Form.Group widths='equal'>
                  <Form.Field>
                    <label>Category</label>
                    <Input fluid value={this.state.selCat.name} disabled />
                  </Form.Field>
                  <Form.Field>
                    <label>Topic</label>
                    <Input fluid value={this.state.oldtop} disabled />
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
                    Please select a category
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
                    value={this.state.name}
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
                      value={this.state.previewData}
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
                              value={this.state.options.a}
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
                              value={this.state.options.b}
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
                              value={this.state.options.c}
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
                              value={this.state.options.d}
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
                  <TextArea
                    size='large'
                    placeholder='Explanation for the question (will be shown once answered)'
                    onChange={this.handleHintsChange}
                    required
                    type='textarea'
                    value={this.state.hints}
                  />
                </Form.Field>

                <Segment inverted={this.props.dark}>
                  <b>Explanation:</b>{' '}
                  <InlineTex
                    texContent={this.state.hints}
                    texSeperator='${1}'
                  />
                </Segment>
              </Segment>
            </Form>
            <Segment basic style={{ margin: '0' }}>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  this.handleChange();
                }}
                form='addform'
                fluid
                primary
                className='addQButton'
              >
                Change Question
              </Button>
            </Segment>
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
                Error changing Question
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
                Question successfully changed
              </div>
            </Segment>
          ) : null}
        </Grid.Column>
      </Grid>
    );
  }
}

export default ChangeQuestion;
