import {ActivityIndicator} from 'react-native';
import styles from '../constants/styles';
import React from 'react';

export const LoadingIndicatorView = () => {
  return (
    <ActivityIndicator
      color="#00B14F"
      size="large"
      hidesWhenStopped={false}
      // style={styles.activityIndicatorStyle}
    />
  );
};
