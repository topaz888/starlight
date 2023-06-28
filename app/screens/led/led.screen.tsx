import { Text, Alert, SafeAreaView, View, StyleSheet, TouchableOpacity } from  'react-native';
import { RootState } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import CTAButton from '../../components/buttons/CTAButton';
import { sendMessage, startLEDControl } from '../../redux/bluetooth/bluetooth.reducer';
import { Message } from "../../models/BluetoothPeripheral";
import { moveNextMode, movePrevMode } from '../../redux/led/led.reducer';
import { useEffect } from 'react';

const LedScreen = () => {
  const dispatch = useDispatch();

  const ConnectedDevice = useSelector(
    (state: RootState) => state.bluetooth.connectedDevice,
  );
  const isConnected = !!ConnectedDevice;

  const rvSignal = useSelector(
    (state: RootState) => state.bluetooth.receiveMessage,
  );

  const ledStaticMode = useSelector((state: RootState) => state.led.ledStaticMode)
  
  useEffect(() => {
    if(isConnected)
      sdMessage(ConnectedDevice,ledStaticMode)
  },[ledStaticMode])


  const sdMessage = (deviceId: string, message: number) => {
    const messagePackage: Message = {deviceId: deviceId, message: message};
    dispatch(sendMessage(messagePackage));
  }
  
return(
<SafeAreaView style={styles.container}>
      <Text> this is BTC page</Text>
      <View style={styles.heartRateTitleWrapper}>
        {isConnected ? (
          <>
            <Text style={styles.heartRateTitleText}>Mode Send:</Text>
            <Text style={styles.heartRateText}>{ledStaticMode}</Text>
            <Text style={styles.heartRateTitleText}>Mode Receive:</Text>
            <Text style={styles.heartRateText}>{rvSignal}</Text>
            <TouchableOpacity
              onPress={() => {dispatch(moveNextMode());}
              }
              style={styles.ctaButton}
            >
              <Text style={styles.ctaButtonText}>
                {"NEXT"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {dispatch(movePrevMode());}
              }
              style={styles.ctaButton}
            >
              <Text style={styles.ctaButtonText}>
                {"PREV"}
              </Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              onPress={() => {sdMessage(
                              ConnectedDevice,
                              ledStaticMode
                              )
                            }
              }
              style={styles.ctaButton}
            >
              <Text style={styles.ctaButtonText}>
                {"submit"}
              </Text>
            </TouchableOpacity> */}

            {/* {isConnected && (
              <CTAButton title="Get Message" onPress={() => {dispatch(startLEDControl());}}/>
            )} */}
          </>
        ) : (
          <Text style={styles.heartRateTitleText}>
            Please Connect to ESP32
          </Text>
        )
        }
      </View>
      </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  heartRateTitleWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heartRateTitleText: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginHorizontal: 20,
    color: "black",
  },
  heartRateText: {
    fontSize: 25,
    marginTop: 15,
  },
  ctaButton: {
    backgroundColor: "#FF6060",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    marginHorizontal: 20,
    marginBottom: 5,
    borderRadius: 8,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});

export default LedScreen;