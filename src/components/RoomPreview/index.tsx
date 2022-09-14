import React, { useEffect, useRef, useState } from 'react';
import {
  ImageProps,
  ImageStyle,
  StyleProp,
  View,
} from 'react-native';
import WebView from 'react-native-webview';

type RoomPreviewProps = {
  /** Image to show while the room preview is loading. */
  loadingUrl?: { uri: string };
  /** URL of the room preview. */
  previewUrl?: { uri: string };
  /** Custom styles. */
  style?: StyleProp<ImageStyle> | undefined;
  /**
   * After how much time (in milliseconds) the component should check if there
   * is an updated room preview available. Default is 10000.
   */
  refreshInterval?: number;
};

const BLACK_IMG = {
  uri: 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=',
};

const RoomPreview: React.FC<RoomPreviewProps> = ({
  previewUrl,
  loadingUrl,
  style,
  refreshInterval = 10000
}) => {
  const [currUrl, setCurrUrl] = useState<{ uri: string } | undefined>(
    loadingUrl
  );

  useEffect(() => {
    setCurrUrl(loadingUrl);
  }, [loadingUrl]);

  useEffect(() => {
    if (previewUrl) {
      setCurrUrl(previewUrl);
    }

    let intv: NodeJS.Timer | null = null;

    if (previewUrl) {
      intv = setInterval(async () => {
        // Update the object reference to force a refresh
        setCurrUrl({ ...previewUrl });
      }, refreshInterval);
    }

    return () => {
      if (intv) {
        clearInterval(intv);
      }
    };
  }, [previewUrl]);

  function onError() {
    if (currUrl?.uri !== loadingUrl?.uri) {
      setCurrUrl(loadingUrl);
    }
  }

  return (
    <EtagImage
      source={currUrl ?? BLACK_IMG}
      onError={onError}
      fadeDuration={0}
      style={[
        {
          aspectRatio: 16 / 9,
          backgroundColor: 'black',
        },
        style,
      ]}
    />
  );
};

type EtagImageProps = Omit<ImageProps, 'source' | 'onError'> & {
  source: { uri?: string };
  onError?:
    | (() => void)
    | undefined;
};

/**
 * This component is similar to the Image component, but has some additional caching checks.
 *
 * In particular, whenever you set the `source` property, this component:
 *
 *  1. Makes a HEAD request to check if the Etag of the resouce changed.
 *  2. If the Etag changed, downloads the new image (while still displaying the old one)
 *  3. Replaces the old image with the new image
 *
 * This ensures that
 *
 *  - When changing image, no "empty image" is displayed while downloading the new one.
 *  - The image is properly refreshed (the native Image components never invalidates cache)
 */
function EtagImage(props: EtagImageProps) {
  const lastEtag = useRef<string | null>(null);
  const webref = React.useRef<WebView | null>(null)

  useEffect(() => {
    if (
      !props.source ||
      !props.source.uri ||
      props.source.uri.startsWith('data')
    ) {
      webref.current?.injectJavaScript(`
        document.body.style.backgroundImage = \`url(${props.source.uri})\`;
      `)
    } else {
      (async () => {
        try {
          const response = await fetch(props.source.uri!, { method: 'HEAD' });
          if (response.status < 200 || response.status > 299) {
            throw new Error()
          }
          const etag = response.headers.get('etag');
          if (etag !== lastEtag.current) {
            const datauri = await urlContentToDataUriNoCache(props.source.uri!)
            webref.current?.injectJavaScript(`
              document.body.style.backgroundImage = \`url(${datauri})\`;
            `)
            lastEtag.current = etag;
          }
        } catch (e) {
          props.onError?.();
        }
      })();
    }
  }, [props.source]);

  return <View style={props.style} pointerEvents="none">
    <WebView
      key={props.source.uri}
      ref={webref}
      source={{
        html: `<html>
<head>
  <meta name="viewport" content="initial-scale=1.0">
  <style>
    html, body { margin: 0; padding: 0; width: 100%; height: 100%; }
    body {
      background-color: black;
      background-image: url(${props.source.uri});
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }
  </style>
</head>
</html>` }}
      automaticallyAdjustContentInsets={false}
      scrollEnabled={false}
    />
  </View>
}

/**
 * Takes a URL and downloads it as a data URI. This function does NOT use cache
 * for the network request.
 */
function urlContentToDataUriNoCache(
  url: string
): Promise<string | ArrayBuffer> {
  return fetch(url, {
    headers: new Headers({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    }),
  })
    .then((response) => response.blob())
    .then(
      (blob) =>
        new Promise((callback) => {
          let reader = new FileReader();
          reader.onload = function () {
            callback(this.result);
          };
          reader.readAsDataURL(blob);
        })
    );
}

export default RoomPreview;
