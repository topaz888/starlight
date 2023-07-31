import React, {FC} from 'react';
import {TouchableOpacity, StyleSheet, Platform} from 'react-native';
import CustomText from '../text/CustomText';

type ListBUttonProps = {title: string; onPress: () => void};

const ListBUtton: FC<ListBUttonProps> = props => {
  return (
    <TouchableOpacity style={styles.ButtonContiner} onPress={props.onPress} key={1} activeOpacity={0.5}>
      <CustomText style={styles.ButtonText}>{props.title}</CustomText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  ButtonContiner: {
    height: 100,
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: "#329aea", 
    ...Platform.select({
        ios: {
            shadowOffset: {
                width: 0,
                height: 8,
              },
            shadowOpacity:  0.21,
            shadowRadius: 8.19,
        },
        android: {
            elevation: 11,
        },
      }),
  },
  ButtonText: {
    color: '#285476',
    fontWeight: '800',
    fontSize: 24,
    paddingHorizontal: 10,
  },
});

export default ListBUtton;