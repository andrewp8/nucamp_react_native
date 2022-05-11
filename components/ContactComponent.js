import React, { Component } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { Card } from 'react-native-elements';

class Contact extends Component {

  static navigationOptions = {
    title: 'Contact Us'
  }

  render() {
    return (
      <ScrollView>
        <Card
          wrapperStyle={{ margin: 20 }}>
          <Card.Title>Contact Information</Card.Title>
          {/* <Card.Divider /> */}

          <Text style={{ marginBottom: 10 }}>
            1 Nucamp Way
            Seattle, WA 98001
            U.S.A.
          </Text>
          <Text>Phone: 1-206-555-1234</Text>
          <Text>Email: campsites@nucamp.co</Text>

        </Card>
      </ScrollView>
    )
  }
}

export default Contact;