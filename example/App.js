// TODO: Enter your SignalWireRoom Token here. Get one from the SignalWire REST APIs.
const TOKEN = ''

import React, { useState } from 'react';
import { SafeAreaView, View, Text, Image } from 'react-native';

import { Video } from '@signalwire-community/react-native';
import { RoomPreview } from '@signalwire-community/react-native-room-preview';

const App = () => {

  const [roomSession, setRoomSession] = useState()
  const [previewUrl, setPreviewUrl] = useState()

  console.log("Started")

  return (
    <SafeAreaView style={{ height: '100%' }}>
      <Text>Remote video:</Text>
      {
        TOKEN
          ? <View style={{ borderWidth: 5, borderColor: 'red' }}>
            <Video
              token={TOKEN}
              onRoomReady={(roomSession) => {
                console.log("Raw room session object:", roomSession)
                setRoomSession(roomSession)
              }}
              onMemberTalking={(e) => console.log(`Member ${e.member.id} is talking.`)}
              onMemberJoined={(e) => console.log(`${e.member.name} joined the room!`)}
              onRoomJoined={(e) => setPreviewUrl(roomSession.previewUrl)}
            />
          </View>
          : <Text>Please set a token at the top of App.js</Text>
      }
      <RoomPreview previewUrl={previewUrl ? { uri: previewUrl } : undefined} loadingUrl={{ uri: 'https://swrooms.com/swloading.gif' }} style={{ width: '50%' }} />
    </SafeAreaView>
  );
};
export default App;
