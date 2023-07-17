import React, { FC, useState } from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';

type LoadingProps = {
    timer: number,
}

export const Loading: FC<LoadingProps> = props => {
    const [loading, setloading] = useState<boolean>(true);
    setTimeout(() => {
        setloading(false);

   }, props.timer*1000)
  return (
    <>
    {loading?
        <View style={styles.container}>
            <ActivityIndicator/>
        </View>
    :
    <View></View>
    }
    </>
  );
};

const styles = StyleSheet.create({
    container:{
        position: "absolute",
        zIndex: 1,
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F5FCFF88",
    }
})

export default Loading;