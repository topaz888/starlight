import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import IconFether from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import { FC } from "react";


interface PlayPanelProps {
    forwardward: Function,
    backward: Function,
    play: Function,
    isPlay: boolean,
    modeId: String
  }

const PlayPanel : FC<PlayPanelProps>= props=>{
    const handlePlay = () => {
        props.play()
    }

    return (
        <View style={styles.container}>
            <View>
                <TouchableOpacity style={styles.backButton} onPress={()=>{props.backward()}}>
                    <IconFether name="skip-back" style={styles.SideButton}/>
                </TouchableOpacity>
            </View>
            <View>
                <TouchableOpacity style={(props.isPlay)?styles.playButton:styles.playButton} onPress={()=>{handlePlay()}}>
                    {props.isPlay? 
                        <Ionicons name="pause" style={styles.ItemButton} />
                        :
                        <Icon name="caretright" style={styles.ItemButton}/>
                    }
                </TouchableOpacity>
            </View>
            <View>
                <TouchableOpacity style={styles.forwardButton} onPress={()=>{props.forwardward()}}>
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
        borderRadius:100,
        ...Platform.select({
            ios:{
                shadowColor: '#000',
                shadowOffset: {width:0, height:1},
                shadowOpacity: 0.5,
                shadowRadius: 0.8,
            },
            android:{
                elevation: 4
            }
        })
    },
    playButtonDisable: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 140,
        width: 140,
        backgroundColor: '#EDEDED',
        borderRadius:100,
        ...Platform.select({
            ios:{
                shadowColor: '#000',
                shadowOffset: {width:0, height:1},
                shadowOpacity: 0.5,
                shadowRadius: 0.8,
            },
            android:{
                elevation: 4
            }
        })
    },
    ItemButton: {
        fontSize: 40,
        color: "#285476",
    },
    ItemButtonDisable: {
        fontSize: 40,
        color: "#94A0A8",
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