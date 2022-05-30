import React, { Component } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { Input, CheckBox } from 'react-native-elements';
import * as SecureStore from 'expo-secure-store';

class Login extends Component {

	constructor(props) {
		super(props);

		this.state = {
			username: '',
			password: '',
			remember: false
		};
	}

	static navigationOptions = {
		title: 'Login'
	}

	handleLogin() {
		console.log(JSON.stringify(this.state));
		if (this.state.remember) {
			/*
				In this case, if the user CLICKED the Remember Me button then
					1) SecureStore.setItemAsync will create a KEY and save the key in the SecureStore under a name called 'userinfo'
					2) 'userinfo' will be save in the SecureStore under STRING form by being converted using JSON.stringify for human readable purpose
						Ex: "{"username": "username", "password": "password"}"
					3) Once SercureStore has a key name 'userinfo' (componentDidMount's purpose is to check if 'userinfo' was initialized/render at least once ), whenever the key need to be restrived, SecureStore.getItemAsync will does the job by convert the key from STRING back to an OBJECT by using JSON.parse for Javascript reading purpose
					4) If the user decided to not remember the login info by DON'T CLICK or UNCLICKED the Remember Me button, then SecureStore.deleteItemAsync will delete the 'userinfo' in the SecureStore  
			*/
			SecureStore.setItemAsync(
				'userinfo',
				JSON.stringify({
					username: this.state.username,
					password: this.state.password
				})
			).catch(error => console.log('Could not save user info', error));
		} else {
			SecureStore.deleteItemAsync('userinfo').catch(
				error => console.log('Could not delete user info', error)
			);
		}
	}

	componentDidMount() {
		SecureStore.getItemAsync('userinfo')
			.then(userdata => {
				const userinfo = JSON.parse(userdata);
				if (userinfo) {
					this.setState({ username: userinfo.username });
					this.setState({ password: userinfo.password });
					this.setState({ remember: true })
				}
			});
	}

	render() {
		return (
			<View style={styles.container}>
				<Input
					placeholder='Username'
					leftIcon={{ type: 'font-awesome', name: 'user-o' }}
					onChangeText={username => this.setState({ username })}
					value={this.state.username}
					containerStyle={styles.formInput}
					leftIconContainerStyle={styles.formIcon}
				/>
				<Input
					placeholder='Password'
					leftIcon={{ type: 'font-awesome', name: 'key' }}
					onChangeText={password => this.setState({ password })}
					value={this.state.password}
					containerStyle={styles.formInput}
					leftIconContainerStyle={styles.formIcon}
				/>
				<CheckBox
					title='Remember Me'
					center
					checked={this.state.remember}
					onPress={() => this.setState({ remember: !this.state.remember })}
					containerStyle={styles.formCheckbox}
				/>
				<View style={styles.formButton}>
					<Button
						onPress={() => this.handleLogin()}
						title='Login'
						color='#5637DD'
					/>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		margin: 20
	},
	formIcon: {
		marginRight: 10
	},
	formInput: {
		padding: 10
	},
	formCheckbox: {
		margin: 10,
		backgroundColor: null
	},
	formButton: {
		margin: 40
	}
});

export default Login;