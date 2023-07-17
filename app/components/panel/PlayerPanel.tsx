import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { screenHeight, screenWidth } from "../constant/constant";
import Icon from "react-native-vector-icons/AntDesign";
import IconFether from "react-native-vector-icons/Feather";


interface PlayPanelProps {
  }

const _screenWidth = screenWidth;
const _screenHeight = screenHeight;

const PlayPanel = (props:PlayPanelProps)=>{

    return (
        <View style={styles.container}>
            <View>
                <TouchableOpacity style={styles.backButton}>
                    <IconFether name="skip-back" style={styles.SideButton}/>
                </TouchableOpacity>
            </View>
            <View>
                <TouchableOpacity style={styles.playButton}>
                    <Icon name="caretright" style={styles.ItemButton} />
                </TouchableOpacity>
            </View>
            <View>
                <TouchableOpacity style={styles.forwardButton}>
                    <IconFether name="skip-forward" style={styles.SideButton} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 200,
    },
    playButton: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 140,
        width: 140,
        backgroundColor: '#FFFFFF',
        elevation: 4,
        borderRadius:100,
    },
    ItemButton: {
        fontSize: 40,
        color: "#285476",
    },
    forwardButton: {
        width:70,
        height: "50%",
        justifyContent: 'center',
    },
    backButton: {
        width:70,
        height: "50%",
        justifyContent: 'center',
    },
    SideButton: {
        color: "#285476", 
        flexDirection: 'row',
        fontSize: 34,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20,
    },
  });

export default PlayPanel;