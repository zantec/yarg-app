import React from 'react';
import { 
  TextInput, 
  StyleSheet, 
  View,
  TouchableOpacity,
  Text 
} from 'react-native';
import Axios from 'axios';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      success: false,
    };
    this._submit = this._submit.bind(this);
  }

  _submit(event) {
    console.log(event);
    if (event === 'Login') {
      Axios.get(`http://ec2-3-17-167-48.us-east-2.compute.amazonaws.com/login?username=${this.state.username}&password=${this.state.password}`).then((result) => {
        this.props.screenProps.appLogin(result.data);
        this.setState({
          success: true,
        });
      }).catch((err) => {
        this.setState({
          username: '',
          password: '',
        });
      });
    } else {
      Axios({
        method: 'post',
        url: 'http://ec2-3-17-167-48.us-east-2.compute.amazonaws.com/signup',
        data: {
          username: this.state.username,
          password: this.state.password,
        },
      }).then((result) => {
        this.props.screenProps.appLogin(result.data);
        this.setState({
          success: true,
        });
      }).catch((err) => {
        this.setState({
          username: '',
          password: '',
        })
      });
    }
  }

  render() {
    if (this.state.success === false) {
      return (
        <View style={styles.loginContainer}>
          <TextInput
            style={styles.loginInput}
            onChangeText={(text) => this.setState({ username: text })}
            placeholder='username'
            value={this.state.username}
          />
          <TextInput
            style={styles.passwordInput}
            onChangeText={(text) => this.setState({ password: text })}
            secureTextEntry={true}
            placeholder='password'
            value={this.state.password}
          />
          <TouchableOpacity style={styles.button} onPress={() => { this._submit('Login'); }}>
            <Text style={styles.btntext}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => { this._submit('Signup') }}>
            <Text style={styles.btntext}>Signup</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View>
          <Text style={styles.result}>{'Login/Signup Successful'}</Text>
        </View>
      );
    }
  }
}

var styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  loginInput: {
    height: 40,
    width: 150,
    marginTop: 300,
    borderWidth: 1,
    borderColor: 'gray'
  },
  passwordInput: {
    height: 40,
    width: 150,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'gray'
  },
  button: {
    alignSelf: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#59cbbd',
    marginTop: 30,
  },
  btntext: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  result: {
    height: 40,
    width: 150,
    marginTop: 300,
    alignSelf: 'center',
    alignItems: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  }
})