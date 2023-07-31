import { FC, useEffect, useState } from "react"
import { StyleSheet, View } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { screenWidth } from "../constant/constant";
import CustomText from "../text/CustomText";

type CustomTabProps = {title: string[]; renderView:Function[], onPress: Function; value:number};
const _screenWidth = screenWidth;
const CustomTab: FC<CustomTabProps> = props =>{
  const [status, setStatus] = useState(0);
  const toggleSwitch = (key: number)=>{
    setStatus(key)
    props.onPress(key);
  }
  useEffect(()=>{
    console.log(props.value)
    toggleSwitch(props.value)
  },[props.value])
  return(
    <View style={styles.container}>
    <View style={styles.switch}>
        {props.title.map((item, key) => {
          return (
              <TouchableOpacity style={status === key ? styles.Activebutton : styles.Inactivebutton} onPress={() => toggleSwitch(key)}
                disabled={status === key} activeOpacity={1} key={key}>
                <CustomText style={styles.text} key={key}> {item}</CustomText>
              </TouchableOpacity>
          );
        })}
    </View>
        {props.renderView[status]()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'center',
  },
  switch: {
    flexDirection: 'row',
    shadowColor: '#000000',
    shadowOffset: {'width':0,'height':3},
    shadowRadius: 2,
    shadowOpacity: 0.2,
    elevation: 5,
    position: 'relative',
    zIndex: 1,
    width: 300,
    height: 40,
    marginHorizontal: _screenWidth/2-150,
    marginVertical: 10,
  },
  text:{
    fontWeight: 'bold',
    fontSize: 14,
    color: '#215e79',
    textAlign: 'center',
  },
  Inactivebutton: {
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    zIndex: 1,
    width: 150,
    height: 40,
    opacity:1,
  },
  Activebutton: {
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: '#D0DBE9',
    zIndex: 1,
    width: 150,
    height: 40,
    opacity:1,
  },
});

export default CustomTab;