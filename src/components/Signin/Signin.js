import React from 'react';


//component with no state, so pure function
class Signin extends React.Component {

    constructor(props) {
        super();
        this.state = {
            signInEmail: '',
            signInPassword: ''
        }
    }
    //get input values from sign in form to pass to state as props
    onEmailChange = (event) => {
        this.setState({signInEmail: event.target.value})
    }

    onPasswordChange = (event) => {
        this.setState({signInPassword: event.target.value})
    }

    //on sign in submit, send user login info to server to login verify with a json response, if successful then direct to home page of app, error and remain at login page otherwise
    onSubmitSignIn = () => {
        fetch('http://localhost:3000/signin', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: this.state.signInEmail,
                password: this.state.signInPassword
            })
        })
        .then(response => response.json())
        .then (user => {
            if(user.id){
                this.props.loadUser(user);
                this.props.onRouteChange('home');
            }
        });
    }
    render() {
        const { onRouteChange } = this.props;
        return (
            <article className="br3 ba b--black-10 mv6 shadow-5 w-100 w-50-m w-50-l mw6 center">
                <main className="pa4 black-80">
                    <div className="measure">
                        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                        <legend className="f1 fw6 ph0 mh0">Sign In</legend>
                        <div className="mt3">
                            <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                            <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                            type="email" 
                            name="email-address"  
                            id="email-address"
                            onChange= {this.onEmailChange} />
                        </div>
                        <div className="mv3">
                            <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                            <input className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                            type="password" 
                            name="password"  
                            id="password"
                            onChange={this.onPasswordChange} />
                        </div>
                        </fieldset>
                        <div className="">
                            <input
                            onClick = {this.onSubmitSignIn} //onRouteChange function called onClick not when page loads with arrow function
                            className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
                            type="submit" 
                            value="Sign in" />
                        </div>
                        <div className="lh-copy mt3">
                            <p onClick={() => onRouteChange('register')} className="f6 link dim black db pointer">Register</p>
                        </div>
                    </div>
                </main>
            </article>
        );
    }
    
}

export default Signin;

