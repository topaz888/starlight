import React, {FC} from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import { Item } from 'react-native-paper/lib/typescript/src/components/Drawer/Drawer';

type CTAButtonProps = {title: string; onPress: () => void};

const CTAButton: FC<CTAButtonProps> = props => {
  return (
    <TouchableOpacity style={styles.ButtonContiner} onPress={props.onPress} key={1} activeOpacity={0.5}>
      <Text style={styles.ButtonText}>{props.title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  ButtonContiner: {
    height: 40,
    width: 300,
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

export default CTAButton;