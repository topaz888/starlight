import React, {FC, useEffect} from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

type ToggleButtonProps = {title: string[]; onPress: Function};

const LedToggleButton: FC<ToggleButtonProps> = props => {
  const [status, setStatus] = React.useState(0);
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
        <TouchableOpacity style={status === key ? styles.activeButtonContiner : styles.ButtonContiner} disabled={status === key}
            onPress={()=>onButtonToggle(key)}  key={key}>
          <Text style={styles.ButtonText}>{item}</Text>
        </TouchableOpacity>
        )
      })
    }
    </>
  );
};

const styles = StyleSheet.create({
  activeButtonContiner: {
    height: 40,
    width: 70,
    marginHorizontal: "auto",
    backgroundColor: '#D9C2F5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  ButtonContiner: {
    height: 40,
    width: 70,
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

export default LedToggleButton;