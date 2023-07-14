import React, { useEffect, useMemo, useRef, useState } from 'react';
import {Alert, SectionList, StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { useDispatch, useSelector } from 'react-redux';
import { NavigationProp, RouteProp, useIsFocused } from '@react-navigation/native';
import { updateCustomName, updateledMessageByData, uploadMessage } from '../../redux/led/led.reducer';
import { LedMessage, message, messageNumber, realmData } from '../../models/LedMessage';
import DialogInput from '../../components/dialogInput/CustomDialogInput';
import { handleCustomName, bindListener, handleRemoveLed, removeListener, loadStaticData, getMessageByModeId, getStaticMessageByModeId } from '../../realm/led/actions/led.actions';
import { RootState } from '../../redux/store';
import { LedRealmContext } from '../../realm/led';

interface LedScreenProps {
  navigation: NavigationProp<any,any>;
  route: RouteProp<any,any>;
}

const LedChoiceScreen = (props:LedScreenProps) => {
  const [ItemTouch, useItemTouch] = useState<string>();
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState<realmData>([]);
  const premiumRef = useRef<boolean>(true);

  const customName = useSelector(
    (state: RootState) => state.led.customName,
  );

  const createTwoButtonAlert = (item:string) =>
  Alert.alert('Warning', 'If you choose Yes, this setting is removed.', [
    {
      text: 'Cancel',
      onPress: () => console.log('Cancel Pressed'),
      style: 'cancel',
    },
    { text: 'Yes', 
      onPress: () => handleRemoveLed(item)
    },
  ])

  useEffect(() => {
    const fetchData = async () => { 
      try{
          if (premiumRef.current) {
            loadStaticData();
            // const data = await handleCustomName();
            // dispatch(updateCustomName(data));
            console.log("how many times");
            // await bindListener(dispatch);
            premiumRef.current = false;
          }
        }
      catch(e){
          console.log(e);
      }
    }
   fetchData();
   return () => {
                if (!premiumRef.current){
                  removeListener();
                  premiumRef.current = true;
                }}
  },[])

  const createNewName = () => {
    setVisible(true);
  }
  const updateledMessage = (message:message[] | undefined) => {
    try{
      if(message){
          var newarray: messageNumber[] = []
          message.map(item=>{
          const data = 
                      {mode:+item.mode,
                        cycle:+item.cycle,
                        cycle2:item.cycle2===null?0:+item.cycle2,
                        delay:item.delay===null?0:+item.delay,
                        brightness:+item.brightness,
                        waitTime:item.waitTime===null?0:+item.waitTime,
                        waitTimeLen:item.waitTimeLen===null?0:+item.waitTimeLen,
                      }
          newarray[+item.ledId] = data;
                    })
          dispatch(updateledMessageByData(newarray));
          console.log(newarray);
      }
      else
        throw new Error('updateledMessage is NULL.');
    }
    catch(e){
      console.log(e);
    }
  }
  const uploadStaticMessage = async (modeId: string) => {
    // let message = await getMessageByModeId(modeId);
    // if(typeof(message)!="string"){
    //   const messagePackage: LedMessage = {deviceId: null, messages: message as messageNumber[]};
    //   dispatch(uploadMessage(messagePackage))
    // }else
    let result = await getStaticMessageByModeId(modeId, dispatch);
    if(result){
      dispatch(uploadMessage(modeId));
      props.navigation.navigate({ name: 'LEDS', params: { ...props.route.params, modeId: modeId }});
    }
      
    // console.log(message);
  }

  const uploadCustomMessage = (modeId: string) => {
    // const message = getMessageByModeId(modeId);
  }

  return (
    <View style={styles.container}>
      <SectionList
        sections={[
          {title: 'Custom', data: customName},
          {
            title: 'Light',
            data: [
              '1',
              '2',
              '3',
              '4',
              '5',
              '6',
              '7',
            ],
          },
          {
            title: 'Blink',
            data: [
              '8',
              '9',
              '10',
              '11',
              '12',
              '13',
              '14',
              '15',
            ],
          },
          {
            title: 'Breath',
            data: [
              '16',
              '17',
              '18',
              '19',
              '20',
              '21',
              '22',
              '23',
              '24',
              '25',
              '26',
              '27',
              '28',
              '29',
              '30',
            ],
          },
        ]}
        renderItem={({ item, section }) => (
          <View style={ItemTouch===item?styles.containerActiveItem:styles.containerItem} onTouchStart={()=>{useItemTouch(item)}} onTouchCancel={()=>{useItemTouch(item)}}>
              <Text style={styles.item} onPress={()=>{}}>{item}</Text>
              {ItemTouch === item&&
                <View style={styles.containerButton}>
                  {section.title  ==='Custom' ? 
                  <><Icon name="delete" style={styles.ItemButton} onPress={() => { createTwoButtonAlert(item); } } />
                    <Icon name="edit" style={styles.ItemButton} onPress={() => { props.navigation.navigate({ name: 'LEDCU', params: { ...props.route.params, modeId: item } }),
                    updateledMessage(data.find(v => v.modeId === item)?.message);
                  } } /><Icon name="caretright" style={styles.ItemButton} onPress={() => { uploadCustomMessage(item); } } /></>
                  :
                  <><Icon name="back" style={styles.ItemButton} onPress={() => { createTwoButtonAlert(item); } } />
                    <Icon name="edit" style={styles.ItemButton} onPress={() => props.navigation.navigate({ name: 'LEDUD', params: { ...props.route.params, modeId: item, title: section.title } })} />
                    <Icon name="caretright" style={styles.ItemButton} onPress={() => { uploadStaticMessage(item); } } />
                  </>
                }
                </View>
              }
          </View>
        )}

        renderSectionHeader={({section}) => (
            <View style={styles.containerSection}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                {section.title === 'Custom'&&
                <Icon name="plussquareo" style={styles.sectionAddButton} onPress={() =>{createNewName()}}/>}
            </View>
        )}
        keyExtractor={item => `basicListEntry-${item}`}
      />

      <DialogInput 
        isDialogVisible={visible}
        title={"Create a new ID"}
        message={"Enter the Id, then click Submit\n(Max Length 20)"}
        hintInput ={"Enter Text"}
        submitInput={ (inputText) => {
          if(customName.includes(inputText)) return(Alert.alert('Error'), setVisible(false))
          return (
                    props.navigation.navigate({name: 'LEDCU',params: {...props.route.params, modeId:inputText} }),
                    setVisible(false)
          );
        }}
        closeDialog={() => setVisible(false)}></DialogInput>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
    containerSection: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: 'rgba(190, 153, 120, 0.7)',
    },
    containerButton: {
      flexDirection: 'row',
      paddingHorizontal: 10,
    },
    containerItem: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    containerActiveItem: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    sectionTitle: {
      fontSize: 20,
      color: 'white',
      fontWeight: 'bold',
      paddingHorizontal: 20,
    },
    sectionAddButton: {
      fontSize: 30,
      color: "#900",
      paddingHorizontal: 20,
      },
    ItemButton: {
      fontSize: 30,
      color: "#4287f5",
      paddingVertical: 5,
      paddingHorizontal: 10,
      },
    item: {
      padding: 10,
      fontSize: 18,
      height: 44,
    },
  });

export default LedChoiceScreen;