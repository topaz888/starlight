import Slider from '@react-native-community/slider';
import React, {FC, useEffect, useState} from 'react';
import {Text, StyleSheet, View} from 'react-native';

type DataSliderProps = {minVal: number; maxVal: number; step: number; onPress: Function; value: number};

const DataSlider: FC<DataSliderProps> = props => {
  const [initVal,setInitVal] = useState<number>();
  const [buffer, setBuffer] = useState<number>();
  useEffect(()=>{
    setInitVal(props.value/1);
    setBuffer(props.value/1);
    },[props.value])
  const onValChange = (val:number) => {
    props.onPress(val);
  };
  return (
    <View style={styles.Continer}>
        <Text style={styles.text}>{buffer}</Text>
        <Slider
          style={styles.slider}
          onSlidingComplete={(val) => onValChange(val)}
          onValueChange={(val)=>setBuffer(val)}
          value={initVal}
          minimumValue={props.minVal}
          maximumValue={props.maxVal}
          step={props.step}
          minimumTrackTintColor="#285476"
          maximumTrackTintColor="#000000" />
    </View>
  );
};

const styles = StyleSheet.create({
  Continer: {
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
  slider: {
    width: 220, 
    height: 40,
    marginLeft:10
  },
});

export default DataSlider;