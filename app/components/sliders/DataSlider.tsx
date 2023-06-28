import Slider from '@react-native-community/slider';
import React, {FC, useState} from 'react';
import {Text, StyleSheet, View} from 'react-native';

type DataSliderProps = {minVal: number; maxVal: number; step: number; onPress: Function; value: number};

const DataSlider: FC<DataSliderProps> = props => {
  const onValChange = (val:number) => {
    props.onPress(val/10);
  };
  return (
    <View style={styles.Continer}>
        <Text style={styles.text}>{props.value}</Text>
        <Slider
          style={styles.slider}
          onValueChange={(val) => onValChange(val)}
          value={props.value*10}
          minimumValue={props.minVal}
          maximumValue={props.maxVal}
          step={props.step}
          minimumTrackTintColor="#FFFFFF"
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