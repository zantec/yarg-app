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
      password: ''
    };
  }

  _submit() {
    Axios.get(`http://ec2-3-17-167-48.us-east-2.compute.amazonaws.com/login?username=${this.state.username}&password=${this.state.password}`).then((result) => {
      
    }).catch((err) => {
      
    });
  }

  render() {
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
        <TouchableOpacity style={styles.button} onPress={() => { this._submit(); }}>
          <Text style={styles.btntext}>Login</Text>
        </TouchableOpacity>
      </View>
    );
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
})