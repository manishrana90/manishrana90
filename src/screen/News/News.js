import React, {useLayoutEffect} from 'react';
import { View, Text } from 'react-native';
import { WebView } from "react-native-webview";

const News = () => {


  return (
    <WebView
        source={{
          html: `<iframe src="https://www.scorebat.com/embed/" frameborder="0" width="100%" height="100%" allowfullscreen allow='autoplay; fullscreen' style="width:100%;height:760px;overflow:hidden;display:block;" class="_scorebatEmbeddedPlayer_"></iframe><script>(function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = 'https://www.scorebat.com/embed/embed.js?v=arrv';
            fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'scorebat-jssdk'));</script>`,
        }}
        nestedScrollEnabled
        androidHardwareAccelerationDisabled={true}
        automaticallyAdjustContentInsets={true}
        startInLoadingState={true}
        scalesPageToFit={false}
        style={{
            flex: 1,
        }}
    />
  )
}


export default News;