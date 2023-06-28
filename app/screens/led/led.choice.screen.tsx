import React, { useEffect, useMemo, useState } from 'react';
import {Alert, SectionList, StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { useDispatch } from 'react-redux';
import { NavigationProp, RouteProp, useIsFocused } from '@react-navigation/native';
import { updateledMessageByData, uploadMessage } from '../../redux/led/led.reducer';
import { LedMessage, message, realmData } from '../../models/LedMessage';
import DialogInput from '../../components/dialogInput/CustomDialogInput';
import { handleListener, handleRemoveLed, handleViewAllLeds } from '../../realm/led/actions/led.actions';

interface LedScreenProps {
  navigation: NavigationProp<any,any>;
  route: RouteProp<any,any>;
}

const LedChoiceScreen = (props:LedScreenProps) => {
  const [ItemTouch, useItemTouch] = useState<string>();
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState<realmData>([]);
  const [customName, setCustomName] = useState<string[]>([]);
  // const isFocused = useIsFocused();

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
  ]);

  const getAllViews = async () => {
    return new Promise(function(resolve) {
      try{
        resolve(handleListener());
      }
      catch(e){
        console.log(e);
        throw new Error("getAllViews");
      }
    });
  }
  useEffect(() => {
    const fetchData = async () => {
    const data =  await getAllViews() as realmData;
    // setData(data);
    // setCustomName([]);
    // console.log(data)
    // data.map((item)=>{
    //   setCustomName((prev)=>[...prev,item.modeId])
    // })
   }
   fetchData();
  },[])

  const createNewName = () => {
    setVisible(true);
  }
  const updateledMessage = (message:message[] | undefined) => {
    try{
      if(message){
          var newarray: {mode:number, 
                        cycle:number, 
                        delay:number, 
                        brightness: number,
                        waitTime:number,
                        waitTimeLen: number,
                        }[] = []
          message.map(item=>{
          const data = 
                      {mode:+item.mode,
                        cycle:+item.cycle,
                        delay:+item.delay,
                        brightness:+item.brightness,
                        waitTime:+item.waitTime,
                        waitTimeLen:+item.waitTimeLen,
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
  const uploadStaticMessage = (message: string) => {
    dispatch(uploadMessage(message));
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
                  <Icon name="delete" style={styles.ItemButton} onPress={() => {createTwoButtonAlert(item)} } />
                  :
                  <Icon name="back" style={styles.ItemButton} onPress={() => {createTwoButtonAlert(item)} } />
                  }
                  {section.title  ==='Custom' ? 
                  <Icon name="edit" style={styles.ItemButton} onPress={() => {props.navigation.navigate({name: 'LEDCU',params: {...props.route.params, modeId:item} }), 
                                                                              updateledMessage(data.find(v=>v.modeId===item)?.message)}} />
                  :
                  <Icon name="edit" style={styles.ItemButton} onPress={() => props.navigation.navigate({name: 'LEDUD',params: {...props.route.params, modeId:item} })} />}
                  <Icon name="caretright" style={styles.ItemButton} onPress={() => {uploadStaticMessage(item)} } />
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