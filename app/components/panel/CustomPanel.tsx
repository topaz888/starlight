import { Platform, StyleSheet, View } from "react-native";
import DataSlider from "../sliders/DataSlider";
import PlayPanel from "./PlayerPanel";
import CustomText from "../text/CustomText";
import DataList from "../../language/EN/language.data";

interface CustomPanelProps {
    titleName: string,
    modeId: string,
    cycle: number,
    brightness: number,
    backward: Function,
    forward: Function,
    play: Function,
    isPlay: boolean,
    updataLedCycle:Function,
    updataLedBrightness: Function,
  }
const Panel = (props: CustomPanelProps) =>{
        
    const displayModeId = () => {
        if(props.modeId == "29")
            return "1";
        else if(props.modeId == "24")
            return "2";
        else if(props.modeId == "7")
            return "3";
        else if(props.modeId == "15")
            return "4";
        else return props.modeId;
    }
    return (
        <View style={styles.container}>
            <View style={styles.controlPanel}>
                <View style={styles.titleContainer}>
                    <CustomText style={styles.titleKey}>{props.titleName}</CustomText>
                    <CustomText style={styles.titleNumber}>{displayModeId()}</CustomText>
                </View>
                <PlayPanel backward={() => { props.backward(); } } forwardward={() => { props.forward(); } } play={() => { props.play(); } } isPlay={props.isPlay} modeId={props.modeId}/>
                {props.isPlay && <View style={styles.buttonsContainer}>
                    {(+props.modeId > 7 || props.titleName === `Custom`) && 
                        <View style={styles.dataContainer}>
                            <CustomText style={styles.Text}>{DataList.components.Text[1]}</CustomText>
                            {(+props.modeId < 16) &&
                            <DataSlider minVal={1} maxVal={40} step={2} onPress={props.updataLedCycle} value={props.cycle} />}
                            {(+props.modeId > 15) &&
                            <DataSlider minVal={10} maxVal={60} step={2} onPress={props.updataLedCycle} value={props.cycle} />}
                            {(props.titleName === `Custom`) &&
                            <DataSlider minVal={1} maxVal={60} step={2} onPress={props.updataLedCycle} value={props.cycle} />}
                        </View>
                    }
                    <View style={styles.dataContainer}>
                        <CustomText style={styles.Text}>{DataList.components.Text[2]}</CustomText>
                        <DataSlider minVal={0} maxVal={100} step={1} onPress={props.updataLedBrightness} value={props.brightness} />
                    </View>
                </View>}
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
        height: 40,
    },
    titleKey: {
        backgroundColor: '#D8DAE2',
        width:"50%",
        fontSize: 20,
        fontWeight: "bold",
        ...Platform.select({
            ios: {
                lineHeight: 40,
            },
            android: {}
        }),
        textAlign: "center",
        textAlignVertical:'center',
        color: '#215e79',
    }, 
    titleNumber: {
        width:"50%",
        fontSize: 18,
        fontWeight: "bold",
        ...Platform.select({
            ios: {
                lineHeight: 40,
            },
            android: {}
        }),
        textAlign: "center",
        textAlignVertical:'center',
        color: '#215e79',
    }, 
    Text: {
        flex: 1,
        fontWeight: 'bold',
        fontSize: 17,
        color: '#215e79',
        textAlign: 'justify',
        textAlignVertical: 'center',
    },
    buttonsContainer: {
        flexDirection:'column',
    }
  });

export default Panel;