import React, { FC, useEffect, useState } from 'react';
import {
  Modal,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomText from '../text/CustomText';

type DialogInputProps = {
    isDialogVisible: boolean,
    title?: string,
    message?: string,
    hintInput?: string,
    initValueTextInput?: string
    cancelText?: string,
    submitText?: string,
    submitInput: (inputText:string)=>void,
    closeDialog: ()=>void,
}

const DialogInput: FC<DialogInputProps> = props =>{
    const {
        isDialogVisible, title, message, hintInput,
        initValueTextInput,
        cancelText, submitText, 
        submitInput, closeDialog} = props;
 
    // const [openning, setOpenning]= useState(true);
    const [inputModal, setinputModal]= useState(initValueTextInput??'');
    const [isInvalid, setIsInvalid] = useState(false);

    useEffect(() => {
      if(validateName(inputModal))
        setIsInvalid(false);
      else 
        setIsInvalid(true);
      },[inputModal]);

    const handleOnRequestClose = () => {
        closeDialog();
        setinputModal(''); 
    };

    const handleOnChangeText = (inputModal: string) => {
        setinputModal(inputModal);
    };

    const handleOnCloseDialog = () => {
        closeDialog();
        setinputModal('');
    };
    const validateName = (inputModal: string) => {
      var re = /^[A-Za-z0-9_]+$/;
        return re.test(inputModal);
    };

    const handleSubmit = () => {
        if(inputModal.length===0){
          return handleOnCloseDialog();
        }
        if(!isInvalid){
          submitInput(inputModal);
          handleOnCloseDialog();
        }
        setinputModal('');
    };

    let cancelTextPlatform = cancelText || 'Cancel';
    let submitTextPlatform = submitText || 'Submit';
    cancelTextPlatform = (Platform.OS === 'ios')? cancelTextPlatform:cancelTextPlatform.toUpperCase();
    submitTextPlatform = (Platform.OS === 'ios')? submitTextPlatform:submitTextPlatform.toUpperCase();

    return(
        <Modal
        transparent={true}
        visible={isDialogVisible}
        onRequestClose={handleOnRequestClose}>
        <View style={[styles.container]}  >
            <TouchableOpacity style={styles.container} activeOpacity={1} onPress={handleOnCloseDialog}>
            <View style={[styles.modal_container]} >
                <View style={styles.modal_body} >
                <CustomText style={styles.title_modal}>{title}</CustomText>
                <CustomText style={[message ? styles.message_modal : {height:0} ]}>{message}</CustomText>
                  <TextInput style={styles.input_container}
                      autoCorrect={false}
                      autoCapitalize={'none'}
                      maxLength={10}
                      returnKeyType='search'
                      inputMode='search'
                      autoFocus={true}
                      onSubmitEditing={()=>{handleSubmit()}}
                      // onKeyPress={(e)=>handleOnKeyPress(e)}
                      underlineColorAndroid='transparent'
                      placeholder={hintInput}
                      placeholderTextColor={'#E2E3E4'}
                      onChangeText={handleOnChangeText}
                      value={inputModal}
                      />
                {!inputModal || isInvalid && <CustomText style={styles.error_text}>Error: invalid symbols, (A-Za-z0-9)</CustomText>}
            </View>
                <View style={styles.btn_container}>
                <TouchableOpacity style={styles.touch_modal}
                    onPress={handleOnCloseDialog}>
                    <CustomText style={styles.btn_modal_left}>{cancelTextPlatform}</CustomText>
                </TouchableOpacity>
                <View style={styles.divider_btn}></View>
                <TouchableOpacity  style={styles.touch_modal}
                    onPress={handleSubmit}>
                    <CustomText style={styles.btn_modal_right}>{submitTextPlatform}</CustomText>
                </TouchableOpacity>
                </View>
            </View>
            </TouchableOpacity>
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
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      android:{
        backgroundColor: 'rgba(0,0,0,0.62)'
      }
    }),
  },
  modal_container:{
    marginLeft: 30,
    marginRight: 30,
    ...Platform.select({
      ios: {
        backgroundColor:'#E3E6E7',
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
    ...Platform.select({
      ios: {
        textAlign:'center',
        marginBottom: 10,
      },
      android: {
        textAlign:'left',
        marginTop: 20
      },
    }),
  },
  input_container:{
    textAlign:'left',
    color: 'rgba(0,0,0,0.54)',
    ...Platform.select({
      ios: {
        fontSize: 12,
        backgroundColor: 'white',
        borderRadius: 5,
        paddingTop: 5,
	      borderWidth: 1,
        borderColor: '#B0B0B0',
        paddingBottom: 5,
        paddingLeft: 10,
        marginBottom: 15,
        marginTop: 10,
      },
      android: {
        fontSize: 8,
        marginTop: 8,
        borderBottomWidth: 2,
        borderColor: '#009688',
      },
    }),
  },
  btn_container:{
    flex: 1,
    flexDirection: 'row',
    ...Platform.select({
      ios: {
        justifyContent: 'center',
        borderTopWidth: 1,
        borderColor: '#B0B0B0',
        maxHeight: 48,
      },
      android:{
        alignSelf: 'flex-end',
        maxHeight: 52,
        paddingTop: 8,
        paddingBottom: 8,
      }
    }),
  },
  divider_btn:{
    ...Platform.select({
      ios:{
      	width: 1,
        backgroundColor: '#B0B0B0',
      },
      android:{
	      width: 0
      },
    }),
  },
  touch_modal:{
    ...Platform.select({
      ios: {
        flex: 1,
      },
      android:{
        paddingRight: 8,
        minWidth: 64,
        height: 36,
      }
    }),
  },
  btn_modal_left:{
    ...Platform.select({
      ios: {
        fontWeight: 'bold',
        fontSize:18,
        color:'#408AE2',
        textAlign:'center',
        borderRightWidth: 5,
        borderColor: '#B0B0B0',
        padding: 10,
	      height: 48,
	      maxHeight: 48,
      },
      android: {
        fontWeight: 'bold',
        textAlign:'right',
        color:'#009688',
        padding: 8
      },
    }),
  },
  btn_modal_right:{
    ...Platform.select({
      ios: {
        fontWeight: 'bold',
        fontSize:18,
        color:'#408AE2',
        textAlign:'center',
        padding: 10,
      },
      android: {
        fontWeight: 'bold',
        textAlign:'right',
        color:'#009688',
        padding: 8
      },
    }),
  },
  error_text:{
    fontWeight: 'bold',
    color: '#D97872',
    fontSize:12,
  }
});
export default DialogInput;

