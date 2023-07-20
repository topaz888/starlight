import { StyleSheet, Text, View } from "react-native";
import DataSlider from "../sliders/DataSlider";
import CTAButton from "../buttons/CTAButton";
import { screenHeight, screenWidth } from "../constant/constant";
import PlayPanel from "./PlayerPanel";
import { FC, JSXElementConstructor, ReactElement, ReactFragment, ReactPortal, useEffect } from "react";
import { updateledBrightness, updateledCycle } from "../../redux/led/led.reducer";
import { useDispatch } from "react-redux";

interface CustomPanelProps {
    titleName: string,
    modeId: string,
    cycle: number,
    brightness: number,
    backward: Function,
    forward: Function,
    play: Function,
    updataLedCycle:Function,
    updataLedBrightness: Function,
  }

const _screenWidth = screenWidth;
const _screenHeight = screenHeight;

const Panel = (props: CustomPanelProps) =>{
    return (
        <View style={styles.container}>
            <View style={styles.controlPanel}>
                <View style={styles.titleContainer}>
                    <Text style={styles.titleKey}>{props.titleName}</Text>
                    <Text style={styles.titleNumber}>{props.modeId}</Text>
                </View>
                <PlayPanel backward={()=>{props.backward()}} forwardward={props.forward} play={()=>{props.play()}}/>
                <View style={styles.buttonsContainer}>
                    {+props.modeId > 7 && 
                        <View style={styles.dataContainer}>
                            <Text style={styles.Text}>Cycle</Text>
                            <DataSlider minVal={0} maxVal={100} step={1} onPress={props.updataLedCycle} value={props.cycle} />
                        </View>
                    }
                    <View style={styles.dataContainer}>
                        <Text style={styles.Text}>Brightness</Text>
                        <DataSlider minVal={0} maxVal={100} step={1} onPress={props.updataLedBrightness} value={props.brightness} />
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    dataContainer: {
        justifyContent: "space-around",
        flexDirection: "row",
        marginVertical: 5,
        marginHorizontal: 12,
    },
    controlPanel: {
        backgroundColor: "#FAFCFE",
        justifyContent:'flex-start',
        marginHorizontal: 25,
        marginVertical: 8,
        borderBottomEndRadius: 20,
        borderBottomStartRadius: 20,
        paddingBottom: "2%",
    },
    titleContainer: {
        flexDirection: 'row',
        backgroundColor: "#EFF0F4",
        height: 70,
    },
    titleKey: {
        backgroundColor: '#D8DAE2',
        width:"50%",
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        textAlignVertical:'center',
        color: '#215e79',
    }, 
    titleNumber: {
        width:"50%",
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        textAlignVertical:'center',
        color: '#215e79',
    }, 
    Text: {
        flex: 1,
        fontWeight: 'bold',
        fontSize: 18,
        color: '#215e79',
        textAlign: 'justify',
        textAlignVertical: 'center',
    },
    buttonsContainer: {
        flexDirection:'column',
    }
  });

export default Panel;