// TODO: Enter your SignalWireRoom Token here. Get one from the SignalWire REST APIs.
const TOKEN = 'eyJ0eXAiOiJWUlQiLCJjaCI6InJlbGF5LnNpZ25hbHdpcmUuY29tIiwiYWxnIjoiSFM1MTIifQ.eyJpYXQiOjE2NTk3MDY0MTUsImp0aSI6ImU3Yzg0ZjE1LTZjNTktNDNhMy04Y2VjLTQ0NDcwY2NhY2VhOSIsInN1YiI6ImExNmQ4ZjllLTIxNjYtNGU4Mi05NmFmLWE0ODQwZjIxN2JjMyIsInUiOiJ0ZXN0IiwiamEiOiJtZW1iZXIiLCJyIjoiMTAxMCIsInMiOlsicm9vbS5saXN0X2F2YWlsYWJsZV9sYXlvdXRzIiwicm9vbS5zZWxmLmF1ZGlvX211dGUiLCJyb29tLnNlbGYuYXVkaW9fdW5tdXRlIiwicm9vbS5zZWxmLnZpZGVvX211dGUiLCJyb29tLnNlbGYudmlkZW9fdW5tdXRlIiwicm9vbS5zZWxmLmRlYWYiLCJyb29tLnNlbGYudW5kZWFmIiwicm9vbS5zZWxmLnNldF9pbnB1dF92b2x1bWUiLCJyb29tLnNlbGYuc2V0X291dHB1dF92b2x1bWUiLCJyb29tLnNlbGYuc2V0X2lucHV0X3NlbnNpdGl2aXR5Iiwicm9vbS5oaWRlX3ZpZGVvX211dGVkIiwicm9vbS5zaG93X3ZpZGVvX211dGVkIl0sImFjciI6dHJ1ZSwibWEiOiJhbGwiLCJlcnAiOnRydWUsIm10YSI6e30sInJtdGEiOnt9fQ.Mlr4fYY7-2qLMPDt8QImtyIrzkDH9NJcVy6kgwhukFTWarhfcMGsQ2ud6_kk6gSAVM8QQZhI0nLfGhl8u2hNew'

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
      <RoomPreview previewUrl={{uri: 'https://swrooms.com/swloading.gif'}} loadingUrl={{uri: 'https://swrooms.com/swloading.gif'}} style={{width: '50%'}} />
      <RoomPreview previewUrl={{uri: 'https://mathiasbynens.be/demo/animated-webp-supported.webp'}} loadingUrl={{uri: 'https://mathiasbynens.be/demo/animated-webp-supported.webp'}} style={{width: '50%'}} />
      {/* <Image
        style={{height: 150, width: 200}}
        source={{ uri: "https://mathiasbynens.be/demo/animated-webp-supported.webp"}}
      /> */}
    </SafeAreaView>
  );
};
export default App;
