import React, {FC, useEffect} from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomText from '../text/CustomText';

type ToggleButtonProps = {title: string[]; onPress: Function; val:number;};

const ModeToggleButton: FC<ToggleButtonProps> = props => {
  const [status, setStatus] = React.useState(0);
  useEffect(() => {
      onButtonToggle(props.val??0);
    },[props.val]);

  const onButtonToggle = (key: number) => {
    setStatus(key);
    props.onPress(key);
  };

  return (
    <>
    {props.title.map((item, key) =>{
      return(
        <TouchableOpacity style={status === key ? styles.activeButtonContiner : styles.ButtonContiner} disabled={status === key}
            onPress={()=>onButtonToggle(key)} activeOpacity={1} key={key}>
            {
              key===0?
              <MaterialIcons name="lightbulb-on-outline" style={status === key ? styles.Label : styles.activeLabel}></MaterialIcons>
              :
              key===1?
              <Ionicons name="md-sunny-outline" style={status === key ? styles.Label : styles.activeLabel}></Ionicons>
              :
              <MaterialIcons name="shimmer" style={status === key ? styles.Label : styles.activeLabel}></MaterialIcons>
            }
            <CustomText style={status === key ? styles.buttonText : styles.activeButtonText}>{item}</CustomText>
        </TouchableOpacity>
        )
      })
    }
    </>
  );
};

const styles = StyleSheet.create({
  activeButtonContiner: {
    height: 80,
    width: 80,
    backgroundColor: '#174F8A',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    marginBottom: 10,
  },
  ButtonContiner: {
    height: 80,
    width: 80,
    backgroundColor: '#F8F9FB',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 10,
  },
  activeButtonText: {
    color: '#2F587A',
    fontWeight: 'bold',
    fontSize: 16,
    paddingHorizontal: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    paddingHorizontal: 10,
  },
  activeLabel: {
    color: '#2F587A',
    fontSize: 40,
    paddingHorizontal: 10,
  },
  Label: {
    color: 'white',
    fontSize: 36,
    paddingHorizontal: 10,
  },
});

export default ModeToggleButton;