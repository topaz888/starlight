import React, { FC, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import CustomText from '../text/CustomText';

import { Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

type ProgressProps = {
    isDialogVisible: boolean,
    title?: string,
    message?: string,
    closeDialog: ()=>void,
}

const Progress: FC<ProgressProps> = props =>{
    const {isDialogVisible, message, closeDialog} = props;

    useEffect(() => {
      const timer = setTimeout(() => {
        closeDialog()
      }, 32000);
      return () => {clearTimeout(timer)
        if(isDialogVisible){
          console.log("Timeout")
        }
      };
    }, [isDialogVisible]);

    return(
        <Modal
          transparent={true}
          animationType='fade'
          visible={isDialogVisible}>
        <View style={[styles.container]}  >
            <View style={[styles.modal_container]} >
                <View style={styles.modal_body} >
                  <ActivityIndicator size="large" />
                  <CustomText style={styles.message_modal}>{message}</CustomText>
              </View>
            </View>
        </View>
        </Modal>
    );
}
const styles = StyleSheet.create({
  container:{
    flex:1,
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    ...Platform.select({
      android:{
        backgroundColor: 'rgba(0,0,0,0.62)',
        justifyContent: 'center',
      }
    }),
  },
  modal_container:{
    marginLeft: 30,
    marginRight: 30,
    ...Platform.select({
      ios: {
        top: "32%",
        backgroundColor:'#e6f1f5',
        borderRadius: 10,
        minWidth: 300,
      },
      android: {
        backgroundColor:'#fff',
        elevation: 24,
        minWidth: 280,
        borderRadius: 5,
      },
    }),
  },
  modal_body:{
    flexDirection: 'row',
    justifyContent: 'center',
    
    ...Platform.select({
      ios: {
        padding: 10,
      },
      android: {
        padding: 24,
      },
    }),
  },
  title_modal:{
    fontWeight: 'bold',
    fontSize: 20,
    color: '#215e79',
    ...Platform.select({
      ios: {
        marginTop: 10,
        textAlign:'center',
        marginBottom: 5,
      },
      android: {
        textAlign:'left',
      },
    }),
  },
  message_modal:{
    fontSize: 16,
    color: '#215e79',
    marginHorizontal: 20,
    ...Platform.select({
      ios: {
        textAlign:'center',
        marginBottom: 5,
      },
      android: {
        textAlign:'left',
        marginTop: 10
      },
    }),
  },
});
export default Progress;

