import React, { FC } from 'react';
import {View, StyleSheet, Button, Alert} from 'react-native';

type AlertProps = {title: string; message:string};

const CustomAlert:FC<AlertProps> = props =>{
  const showAlert = () => Alert.alert(
    'Alert Title',
    'My Alert Msg',
    [
      {
        text: 'Cancel',
        onPress: () => Alert.alert('Cancel Pressed'),
        style: 'cancel',
      },
    ],
    {
      cancelable: true,
      onDismiss: () =>
        Alert.alert(
          'This alert was dismissed by tapping outside of the alert dialog.',
        ),
    },
  );
  return (
    <View style={styles.container}>
      <Button title="Show alert" onPress={showAlert} />
    </View>
)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomAlert;