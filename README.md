# @signalwire-community/react-native-room-preview

[![@signalwire-community/react-native-room-preview](https://img.shields.io/npm/v/@signalwire-community/react-native-room-preview)](https://www.npmjs.com/package/@signalwire-community/react-native-room-preview)

React Native component for displaying [SignalWire](https://signalwire.com) Room Previews.

> ⚠️ Disclaimer:
>
> The libraries in this repository are NOT supported by SignalWire.

## Installation

```bash
npm install @signalwire-community/react-native-room-preview react-native-webview
```

## Usage

Import and use the component, for example:

```jsx
import React from 'react';
import { SafeAreaView } from 'react-native';
import { RoomPreview } from '@signalwire-community/react-native-room-preview';

export default function App() {
  return (
    <SafeAreaView>
      <RoomPreview
        previewUrl={{ uri: 'https://my-preview-url' }}
        loadingUrl={{ uri: 'https://swrooms.com/swloading.gif' }}
        style={{ width: '50%' }}
      />
    </SafeAreaView>
  );
}
```
