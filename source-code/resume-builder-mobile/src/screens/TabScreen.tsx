import React, {useEffect} from 'react';
import {WebView, WebViewMessageEvent} from 'react-native-webview';
import styles from '../constants/styles';
import {BackHandler, KeyboardAvoidingView} from 'react-native';
import {LoadingIndicatorView} from '../utils/common';

const TabScreen = (props: {route: any; navigation: any}) => {
  const data = props.route.params;
  const navigation = props.navigation;
  const webviewRef = React.useRef<WebView>(null);

  const onNavigationStateChange = (newNavState: {url: any}) => {
    console.log('navigation Changed');
    const {url} = newNavState;
    if (!url) {
      return;
    }
    let checkUrl = url.split(/[?#]/)[0];
    if (checkUrl.endsWith('#')) {
      checkUrl = url.substring(0, checkUrl.length - 1);
    }

    navigation.setOptions({tabBarVisible: checkUrl === data.href});
  };

  // const handleBackButtonClick = () => {
  //   console.log('handleBackButtonClick');
  //   if (webviewRef.current) {
  //     webviewRef.current.goBack();
  //   }
  //   return true;
  // };
  //
  // useEffect(() => {
  //   BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
  //   return () => {
  //     BackHandler.removeEventListener(
  //       'hardwareBackPress',
  //       handleBackButtonClick,
  //     );
  //   };
  // }, []);

  return (
    <KeyboardAvoidingView style={styles.flexContainer}>
      <WebView
        onMessage={(event: WebViewMessageEvent) => {
          console.log('event ', event);
        }}
        ref={webviewRef}
        source={{uri: data.href}}
        renderLoading={LoadingIndicatorView}
        startInLoadingState={true}
        allowsBackForwardNavigationGestures
        onNavigationStateChange={onNavigationStateChange}
        onLoadProgress={({nativeEvent}) => {
          console.log('nativeEvent ', nativeEvent);
        }}
        // allowFileAccess={true}
        // allowFileAccessFromFileURLs={true}
        // allowUniversalAccessFromFileURLs={true}
        // cacheEnabled={true}
        // injectedJavaScriptForMainFrameOnly={false}
        // javaScriptEnabled={true}
        // sharedCookiesEnabled={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />
    </KeyboardAvoidingView>
  );
};

export default TabScreen;
