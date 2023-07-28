import React, {FC, useEffect} from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

type ToggleButtonProps = {title: string[]; onPress: Function; theme: string};

const LedToggleButton: FC<ToggleButtonProps> = props => {
  const [status, setStatus] = React.useState(0);
  const isDarkTheme = props.theme === 'Dark';

  useEffect(() => {
    setStatus(0);
    props.onPress(0);
    },[]);

  const onButtonToggle = (key: number) => {
    setStatus(key);
    props.onPress(key);
  };

  return (
    <>
    {props.title.map((item, key) =>{
      return(
        isDarkTheme?        
        <TouchableOpacity style={status === key ? styles.DarkActiveButtonContiner : styles.DarkButtonContiner} disabled={status === key}
        onPress={()=>onButtonToggle(key)}  key={key}>
        <Text style={status === key?styles.ButtonText:styles.DarkButtonText}>{item}</Text>
        </TouchableOpacity>
        :
        <TouchableOpacity style={status === key ? styles.activeButtonContiner : styles.ButtonContiner} disabled={status === key}
            onPress={()=>onButtonToggle(key)}  key={key}>
          <Text style={status === key?styles.ButtonText:styles.DarkButtonText}>{item}</Text>
          <Ionicons name="bulb-outline" style={status === key?styles.ButtonText:styles.DarkButtonText}></Ionicons>
        </TouchableOpacity>
      )
      })
    }
    </>
  );
};

const styles = StyleSheet.create({
  DarkActiveButtonContiner: {
    height: 80,
    width: 140,
    borderColor: "#CFDEE7",
    borderWidth: 3,
    marginHorizontal: 10,
    backgroundColor: '#3F6786',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  DarkButtonContiner: {
    height: 80,
    width: 140,
    marginHorizontal: 10,
    backgroundColor: '#D4D6DE',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    elevation:4,
  },
  activeButtonContiner: {
    height: 40,
    width: 70,
    marginHorizontal: 10,
    backgroundColor: '#174F8A',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  ButtonContiner: {
    height: 40,
    width: 70,
    marginHorizontal: 10,
    backgroundColor: '#F8F9FB',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  DarkButtonText: {
    color: '#2F587A',
    fontWeight: 'bold',
    fontSize: 16,
    paddingHorizontal: 10,
  },
  ButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    paddingHorizontal: 10,
  },
});

export default LedToggleButton;