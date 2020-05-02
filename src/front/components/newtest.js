import React from 'react';
import { Segment, Button, Grid, Form } from 'semantic-ui-react';
import Spinner from 'react-spinkit';
import history from './history';
import _ from 'lodash';
import Preview from './Preview';
import { server } from '../enpoint';
class NewTest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      modalVisible: false,
      filter: props.categories,
      selCat: null,
      topics: [],
      selTopic: null,
      value:
        props.q[props.cat] != undefined
          ? props.q[props.cat][props.topic] != undefined &&
            props.q[props.cat][props.topic].q[props.i] != undefined
            ? props.q[props.cat][props.topic].q[props.i].v || ''
            : ''
          : '',
      check:
        props.q[props.cat] != undefined
          ? props.q[props.cat][props.topic] != undefined &&
            props.q[props.cat][props.topic].q[props.i] != undefined
            ? props.q[props.cat][props.topic].q[props.i].a != 0 &&
              props.q[props.cat][props.topic].q[props.i].a != 3
            : false
          : false,
    };
    this.logout = this.logout.bind(this);
    this.emit = this.emit.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleTopicChange = this.handleTopicChange.bind(this);
    this.handleRadio = this.handleRadio.bind(this);
    this.handleSub = this.handleSub.bind(this);
    this.fetchQuestion = this.fetchQuestion.bind(this);
    this.reset = this.reset.bind(this);
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

  reset() {
    this.setState({ check: false, value: null, question: undefined });
  }
  handleSub(e) {
    let { question: qu } = this.state;
    let { i, q, stateSet, emit, cat, topic } = this.props;
    let { value } = this.state;
    if (qu.answer == value) {
      q[cat][topic].q[i].a = 2;
    } else {
      q[cat][topic].q[i].a = 1;
    }
    emit('changeQuestion', [q[cat][topic], cat, topic]);
    stateSet('qstate', q);
    this.setState({ check: true });
  }
  logout() {
    this.props.logout();
  }
  fetchQuestion() {
    let { q, i, cat, topic } = this.props;
    console.log(this.props);
    let { props } = this;
    if (q[cat] !== undefined) {
      //Changes for running local
      fetch(server + '/api/question', {
        body: JSON.stringify({
          n: q[cat][topic].q[i].n,
          cat: cat,
          topic: this.props.topic,
        }),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
        .then((res) => res.json())
        .then((question) => {
          if (!question.err) {
            this.setState({
              question: question.question,
              value:
                props.q[props.cat] != undefined
                  ? props.q[props.cat][props.topic] != undefined &&
                    props.q[props.cat][props.topic].q[props.i] != undefined
                    ? props.q[props.cat][props.topic].q[props.i].v || ''
                    : ''
                  : '',
              check:
                props.q[props.cat] != undefined
                  ? props.q[props.cat][props.topic] != undefined &&
                    props.q[props.cat][props.topic].q[props.i] != undefined
                    ? props.q[props.cat][props.topic].q[props.i].a != 0 &&
                      props.q[props.cat][props.topic].q[props.i].a != 3
                    : false
                  : false,
            });
          }
        });
    }
  }
  componentDidMount() {
    this.fetchQuestion();
  }
  emit(name, obj) {
    this.props.emit(name, obj);
  }

  handleRadio(e, { value }) {
    let { i, q, stateSet, emit, cat, topic } = this.props;

    if (!this.state.check) {
      this.setState({ value });
      q[cat][topic].q[i].a = 3;
      q[cat][topic].q[i].v = value;
      emit('changeQuestion', [q[cat][topic], cat, topic]);
      stateSet('qstate', q);
    }
  }
  render() {
    let { topics, value, check, question: q } = this.state;
    let { categories, i, q: qall, cat, cid, topic } = this.props;

    let ac = cat.replace(/ /g, '+'),
      top = topic.replace(/ /g, '+');
    let qa = qall[cat];
    if (qa != undefined && q == undefined) {
      this.fetchQuestion();
    }

    return (
      <div>
        {qa != undefined ? (
          <Segment basic>
            {q != undefined ? (
              <Segment inverted={this.props.dark}>
                <Preview
                  dark={this.props.dark}
                  q={q}
                  emit={this.emit}
                  without
                  pid={qa[topic].pid}
                  sid={this.props.id}
                  name={this.props.sname}
                  i={i}
                />

                <Segment basic>
                  <Grid columns={2} divided stackable>
                    <Grid.Row>
                      <Grid.Column>
                        <Grid column={2}>
                          <Grid.Column className='radio-column'>
                            <Form.Radio
                              value='a'
                              checked={value == 'a'}
                              onChange={this.handleRadio}
                              disabled={check}
                            />
                          </Grid.Column>
                          <Grid.Column className='input-column'>
                            <Segment
                              className='cursorpointer'
                              onClick={(e) =>
                                this.handleRadio(e, { value: 'a' })
                              }
                              inverted={
                                value == 'a' ||
                                (check && q.answer == 'a') ||
                                this.props.dark
                              }
                              color={
                                value == 'a' && check && q.answer != 'a'
                                  ? 'red'
                                  : (!check && value == 'a') ||
                                    (check && q.answer == 'a')
                                  ? 'green'
                                  : this.props.dark
                                  ? 'grey'
                                  : null
                              }
                            >
                              {q.options.a.slice(q.options.a.indexOf(')') + 1)}
                            </Segment>
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
                              disabled={check}
                            />
                          </Grid.Column>
                          <Grid.Column className='input-column'>
                            <Segment
                              className='cursorpointer'
                              onClick={(e) =>
                                this.handleRadio(e, { value: 'b' })
                              }
                              inverted={
                                value == 'b' ||
                                (check && q.answer == 'b') ||
                                this.props.dark
                              }
                              color={
                                value == 'b' && check && q.answer != 'b'
                                  ? 'red'
                                  : (!check && value == 'b') ||
                                    (check && q.answer == 'b')
                                  ? 'green'
                                  : this.props.dark
                                  ? 'grey'
                                  : null
                              }
                            >
                              {q.options.b.slice(q.options.b.indexOf(')') + 1)}
                            </Segment>
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
                              disabled={check}
                            />
                          </Grid.Column>
                          <Grid.Column className='input-column'>
                            <Segment
                              className='cursorpointer'
                              onClick={(e) =>
                                this.handleRadio(e, { value: 'c' })
                              }
                              inverted={
                                value == 'c' ||
                                (check && q.answer == 'c') ||
                                this.props.dark
                              }
                              color={
                                value == 'c' && check && q.answer != 'c'
                                  ? 'red'
                                  : (!check && value == 'c') ||
                                    (check && q.answer == 'c')
                                  ? 'green'
                                  : this.props.dark
                                  ? 'grey'
                                  : null
                              }
                            >
                              {q.options.c.slice(q.options.c.indexOf(')') + 1)}
                            </Segment>
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
                              disabled={check}
                            />
                          </Grid.Column>
                          <Grid.Column className='input-column'>
                            <Segment
                              className='cursorpointer'
                              onClick={(e) =>
                                this.handleRadio(e, { value: 'd' })
                              }
                              inverted={
                                value == 'd' ||
                                (check && q.answer == 'd') ||
                                this.props.dark
                              }
                              color={
                                value == 'd' && check && q.answer != 'd'
                                  ? 'red'
                                  : (!check && value == 'd') ||
                                    (check && q.answer == 'd')
                                  ? 'green'
                                  : this.props.dark
                                  ? 'grey'
                                  : null
                              }
                            >
                              {q.options.d.slice(q.options.d.indexOf(')') + 1)}
                            </Segment>
                          </Grid.Column>
                        </Grid>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Segment>
                <Form
                  inverted={this.props.dark}
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (![null, ''].includes(this.state.value)) {
                      this.handleSub();
                    }
                  }}
                >
                  <Segment basic>
                    <Button
                      primary
                      fluid
                      disabled={check || [null, ''].includes(this.state.value)}
                    >
                      Submit
                    </Button>
                  </Segment>
                  {check ? (
                    <Segment inverted={this.props.dark}>{q.hints}</Segment>
                  ) : null}
                </Form>
              </Segment>
            ) : (
              <Segment padded inverted={this.props.dark}>
                <Grid centered style={{ minHeight: '500px' }}>
                  <Spinner color='#798162' name='circle' />{' '}
                </Grid>
              </Segment>
            )}
            <Segment inverted={this.props.dark}>
              <Segment basic>
                <Grid columns={3} stackable>
                  <Grid.Column>
                    <Button
                      primary
                      fluid
                      onClick={(e) => {
                        if (i > 0) {
                          this.reset();
                          history.push(
                            `/question/${ac}/${top}/${parseInt(i) - 1}`
                          );
                        }
                      }}
                      disabled={!(i > 0)}
                    >
                      Previous Question
                    </Button>
                  </Grid.Column>
                  <Grid.Column>
                    <Button
                      primary
                      fluid
                      onClick={(e) => {
                        history.push(`/question/${ac}/${top}`);
                      }}
                    >
                      Back
                    </Button>
                  </Grid.Column>
                  <Grid.Column>
                    <Button
                      primary
                      fluid
                      onClick={(e) => {
                        if (i < qa[topic].q.length - 1) {
                          this.reset();
                          history.push(
                            `/question/${ac}/${top}/${parseInt(i) + 1}`
                          );
                        }
                      }}
                      disabled={!(i < qa[topic].q.length - 1)}
                    >
                      Next Question
                    </Button>
                  </Grid.Column>
                </Grid>
              </Segment>
            </Segment>
          </Segment>
        ) : null}
      </div>
    );
  }
}
export default NewTest;
