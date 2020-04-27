import React from 'react';
import {
  Segment,
  Button,
  Table,
  Icon,
  Header,
  Input,
  Grid,
  Dropdown,
} from 'semantic-ui-react';
class Department extends React.Component {
  render() {
    return (
      <Grid.Column width={8}>
        <Segment>
          <Segment basic>
            <Header size='large' textAlign='center'>
              Add New Department
            </Header>
            <Input fluid size='large' placeholder='Add Topic'>
              <Dropdown
                placeholder='Department Name'
                selection
                className='category-select'
                options={[
                  {
                    text: 'CSC',
                    value: 'c1',
                  },
                  {
                    text: 'ECE',
                    value: 'c2',
                  },
                  {
                    text: 'IT',
                    value: 'c3',
                  },
                ]}
                style={{
                  borderTopRightRadius: '0px',
                  borderBottomRightRadius: '0px',
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
          </Segment>
          <Segment basic>
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Dept ID</Table.HeaderCell>
                  <Table.HeaderCell>Dept name</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>101</Table.Cell>
                  <Table.Cell>Topic 1</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>102</Table.Cell>
                  <Table.Cell>Topic 2</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>201</Table.Cell>
                  <Table.Cell>Topic 3</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Segment>
        </Segment>
      </Grid.Column>
    );
  }
}

export default Department;
