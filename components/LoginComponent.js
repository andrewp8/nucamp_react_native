import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Input, CheckBox, Button, Icon } from 'react-native-elements';
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { baseUrl } from '../shared/baseUrl';
import * as ImageManipulator from 'expo-image-manipulator';
class LoginTab extends Component {

	constructor(props) {
		super(props);

		this.state = {
			username: '',
			password: '',
			remember: false
		};
	}

	static navigationOptions = {
		title: 'Login',
		tabBarIcon: ({ tintColor }) => (
			<Icon
				name='sign-in'
				type='font-awesome'
				iconStyle={{ color: tintColor }}
			/>
		)
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
						icon={
							<Icon
								name='sign-in'
								type='font-awesome'
								color='#fff'
								iconStyle={{ marginRight: 10 }}
							/>
						}
						buttonStyle={{ backgroundColor: '#5637DD' }}
					/>
				</View>
				<View style={styles.formButton}>
					<Button
						onPress={() => this.props.navigation.navigate('Register')}
						title='Register'
						type='clear'
						icon={
							<Icon
								name='user-plus'
								type='font-awesome'
								color='blue'
								iconStyle={{ marginRight: 10 }}
							/>
						}
						titleStyle={{ color: 'blue' }}
					/>
				</View>
			</View>
		);
	}
}

// -----------------Register Tab-----------------------------------
class RegisterTab extends Component {

	constructor(props) {
		super(props);

		this.state = {
			username: '',
			password: '',
			firstname: '',
			lastname: '',
			email: '',
			remember: false,
			imageUrl: baseUrl + 'images/logo.png'
		};
	}

	static navigationOptions = {
		title: 'Register',
		tabBarIcon: ({ tintColor }) => (
			<Icon
				name='user-plus'
				type='font-awesome'
				iconStyle={{ color: tintColor }}
			/>
		)
	}

	getImageFromCamera = async () => {
		// always have to get the device permission to access settings/features

		// CAMERA can be use to scan barcode only
		const cameraPermission = await Permissions.askAsync(Permissions.CAMERA);

		// CAMERA_ROLL is used when talking/edit/select picture
		const cameraRollPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);

		if (cameraPermission.status === 'granted' && cameraRollPermission.status === 'granted') {
			const capturedImage = await ImagePicker.launchCameraAsync({
				// This enable edit/rotate/crop capturedImage
				allowsEditing: true,
				aspect: [1, 1]
			});
			if (!capturedImage.cancelled) {
				console.log(capturedImage);
				this.processImage(capturedImage.uri)
			}
		}
	}

	processImage = async (imgUri) => {
		const processedImage = await ImageManipulator.manipulateAsync(
			imgUri,
			[{ resize: { width: 400 } }],
			{ format: ImageManipulator.SaveFormat.PNG }
		);
		console.log(processedImage);
		this.setState({ imageUrl: processedImage.uri });
	}

	handleRegister() {
		console.log(JSON.stringify(this.state));
		if (this.state.remember) {
			SecureStore.setItemAsync('userinfo', JSON.stringify(
				{ username: this.state.username, password: this.state.password }))
				.catch(error => console.log('Could not save user info', error));
		} else {
			SecureStore.deleteItemAsync('userinfo').catch(
				error => console.log('Could not delete user info', error)
			);
		}
	}

	render() {
		return (
			<ScrollView>
				<View style={styles.container}>
					<View style={styles.imageContainer}>
						<Image
							source={{ uri: this.state.imageUrl }}
							loadingIndicatorSource={require('./images/logo.png')}
							style={styles.image}
						/>
						<Button
							title='Camera'
							onPress={this.getImageFromCamera}
						/>
					</View>
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
					<Input
						placeholder='First Name'
						leftIcon={{ type: 'font-awesome', name: 'user-o' }}
						onChangeText={firstname => this.setState({ firstname })}
						value={this.state.firstname}
						containerStyle={styles.formInput}
						leftIconContainerStyle={styles.formIcon}
					/>
					<Input
						placeholder='Last Name'
						leftIcon={{ type: 'font-awesome', name: 'user-o' }}
						onChangeText={lastname => this.setState({ lastname })}
						value={this.state.lastname}
						containerStyle={styles.formInput}
						leftIconContainerStyle={styles.formIcon}
					/>
					<Input
						placeholder='Email'
						leftIcon={{ type: 'font-awesome', name: 'envelope-o' }}
						onChangeText={email => this.setState({ email })}
						value={this.state.email}
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
							onPress={() => this.handleRegister()}
							title='Register'
							icon={
								<Icon
									name='user-plus'
									type='font-awesome'
									color='#fff'
									iconStyle={{ marginRight: 10 }}
								/>
							}
							buttonStyle={{ backgroundColor: '#5637DD' }}
						/>
					</View>
				</View>
			</ScrollView>
		);
	}
}

const Login = createBottomTabNavigator(
	{
		Login: LoginTab,
		Register: RegisterTab
	},
	{
		tabBarOptions: {
			activeBackgroundColor: '#5637DD',
			inactiveBackgroundColor: '#CEC8FF',
			activeTintColor: '#fff',
			inactiveTintColor: '#808080',
			labelStyle: { fontSize: 16 }
		}
	}
);

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		margin: 10
	},
	formIcon: {
		marginRight: 10
	},
	formInput: {
		padding: 2
	},
	formCheckbox: {
		margin: 5,
		backgroundColor: null
	},
	formButton: {
		margin: 10,
		marginRight: 40,
		marginLeft: 40
	},
	imageContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-evenly',
		margin: 10
	},
	image: {
		width: 60,
		height: 60
	}
});

export default Login;