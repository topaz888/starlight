import React from 'react';
import {
  View,
} from 'react-native';
import { Svg, Path, Circle } from 'react-native-svg';
import Animated, { useAnimatedProps, withSpring, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { screenHeight, screenWidth } from '../constant/constant';
const Circle_Length = 400;
const Radius = Circle_Length / (2 * Math.PI);

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);

const CircularProgress = () => {
    const progressCircle = useSharedValue(1);
    const tickScale = useSharedValue(1);
    const bckgrdOpacity = useSharedValue(0);
    const tickOpacity = useSharedValue(0);

    const animatedProps= useAnimatedProps(() => ({
        strokeDashoffset: Circle_Length * progressCircle.value,
    }))

    React.useEffect(() => {
        progressCircle.value = withTiming(0, {duration: 2000})
        tickScale.value = withDelay(500, withSpring(10,{damping:5, mass:1, stiffness:100}));
        bckgrdOpacity.value = withDelay(1000, withTiming(1));
        tickOpacity.value = withDelay(1500, withTiming(1, {duration: 500}) );
    }, [])

    const bckgrdAnimatedStyle = useAnimatedStyle(() => {
        return {
          opacity: bckgrdOpacity.value,
          transform: [{scale: tickScale.value}]
        }
      })
      
      
      const tickAnimatedStyle = useAnimatedStyle(() => {
        return {
          opacity: tickOpacity.value,
        }
      });
    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Svg>
                <Circle
                    cx={screenWidth / 2}
                    cy={screenHeight / 3}
                    r={Radius}
                    stroke="#404258"
                    fill="#fff"
                    strokeWidth={12}
                />
                <AnimatedCircle
                    cx={screenWidth / 2}
                    cy={screenHeight / 3}
                    r={Radius}
                    stroke="#82CD47"
                    strokeWidth={5}
                    fill="transparent"
                    strokeDasharray={Circle_Length}
                    animatedProps={animatedProps}
                    strokeLinecap="round"
                />
            </Svg>
            <Animated.View
                style={[{
                height: 10,
                position: "absolute",
                width: 10,
                top: (screenHeight / 3 - 5),
                backgroundColor: "#54B435",
                borderRadius: 50,
                },
                bckgrdAnimatedStyle,
            ]}/>
            <Svg viewBox="0 0 40 40"
                style={{
                height: 110,
                position: "absolute",
                width: 110,
                top: (screenHeight / 3 - 55),
                backgroundColor: "transparent",
                transform: [{ scale: 2 }]}}>
                <AnimatedPath
                    d="M15.5 20l3 3 6-6"
                    stroke={"#fff"}
                    strokeWidth={2}
                    fill="#54B435"
                    strokeLinecap="round"
                    style={tickAnimatedStyle}
                />
            </Svg>
        </View>
    );
};

export default CircularProgress;