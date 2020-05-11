import React from 'react'
import { Button, Checkbox, Form } from 'semantic-ui-react'

class ChangePassword extends React.Component {
    constructor(props){
        super(props);
        this.state={
            oldpass:'',
            pass:'',
            cpass:''
        }
        this.onClick= this.onClick.bind(this)
    }
    onClick(e){
        console.log(this.state)
    }
    onChange(e){
        const {name, value} = e.target;
        console.log(name,value)
        this.setState({[e.target.name]: value});
    }
    render() {
        let{oldpass,pass,cpass}=this.state
        return (
            <Form >
    <Form.Field>
      <label>Current Password</label>
      <input placeholder='Current Password' onChange={this.onChange} name='oldpass' value={oldpass} />
    </Form.Field>
    <Form.Field>
      <label>New Password</label>
      <input placeholder='New Password' type='password' name='pass' onChange={this.onChange} value= {pass} />
    </Form.Field>
    <Form.Field>
      <label>Confirm New Password</label>
      <input placeholder='Confirm New Password' type='password' name='cpass' value= {cpass}/>
    </Form.Field>
    <Button primary type='submit' onChange={this.onChange} onClick={this.onClick}>Submit</Button>
  </Form>
        )
    }
}

export default ChangePassword