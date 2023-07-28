import React, {FC} from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

type CTAButtonProps = {title: string; theme: string; onPress: () => void; width:number|string, height:number|string};

const CTAButton: FC<CTAButtonProps> = props => {
  const isDarkTheme = props.theme === 'Dark';
  return (
    <TouchableOpacity style={[isDarkTheme? styles.DarkButtonContiner : styles.WhiteButtonContiner, 
    {width:props.width}, {height:props.height}]} onPress={props.onPress} key={1} activeOpacity={0.5}>
      <Text style={isDarkTheme? styles.DarkButtonText : styles.WhiteButtonText}>{props.title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  DarkButtonContiner: {
    marginHorizontal: "auto",
    backgroundColor: '#285476',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  DarkButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    paddingHorizontal: 10,
  },

  WhiteButtonContiner: {
    marginHorizontal: 5,
    backgroundColor: '#fff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  WhiteButtonText: {
    color: '#285476',
    fontWeight: 'bold',
    fontSize: 16,
    paddingHorizontal: 10,
  },
});

export default CTAButton;