import Slider from '@react-native-community/slider';
import React, {FC, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import CustomText from '../text/CustomText';

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
        {/* <CustomText style={styles.text}>{buffer}</CustomText> */}
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
    fontSize: 18,
    fontWeight: "500",
    color: '#215e79',
  },
  slider: {
    width: 192, 
    height: 40,
    marginLeft:10
  },
});

export default DataSlider;