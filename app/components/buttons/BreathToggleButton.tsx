import React, {FC, useEffect} from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import CustomText from '../text/CustomText';

type ToggleButtonProps = {title: string[]; onPress: Function; val:number;};

const BreathToggleButton: FC<ToggleButtonProps> = props => {
  const [status, setStatus] = React.useState(0);
  useEffect(() => {
      console.log(props.val)
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
          <CustomText style={styles.ButtonText}>{item}</CustomText>
        </TouchableOpacity>
        )
      })
    }
    </>
  );
};

const styles = StyleSheet.create({
  activeButtonContiner: {
    height: 30,
    width: 50,
    marginHorizontal: "auto",
    backgroundColor: '#D9C2F5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  ButtonContiner: {
    height: 30,
    width: 50,
    marginHorizontal: "auto",
    backgroundColor: '#7735C2',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  ButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    paddingHorizontal: 10,
  },
});

export default BreathToggleButton;