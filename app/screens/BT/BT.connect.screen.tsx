import React, { useState,useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DeviceModal from "./DeviceModal.screen";
import useBLE from "../../components/BT/BLE";
import { HeaderBackButton } from '@react-navigation/elements';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { Device } from 'react-native-ble-plx';
import ledController from '../../led/led.controller';

interface BTCScreenProps {
  navigation: NavigationProp<any,any>;
  route: RouteProp<any,any>;
}

const BTConnectScreen = (props:BTCScreenProps) => {
  const [connectedstatus, setConnectedStatus] = useState<Device | null>(null);
  const{
    nextButton,
    prevButton,
    ledStaticMode
  } = ledController();

  const {
    requestPermissions,
    scanForPeripherals,
    allDevices,
    connectToDevice,
    connectedDevice,
    rvSignal,
    sdSignal,
    disconnectFromDevice,
  } = useBLE();

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      scanForPeripherals();
    }
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const openModal = async () => {
    scanForDevices();
    setIsModalVisible(true);
  };

  useEffect(() =>{
    setConnectedStatus(connectedDevice || props.route?.params?.connectedstatus);
  },[connectedDevice, props.route?.params?.connectedstatus]); 

  useEffect( () => {
    props.navigation.setOptions({headerShown: true, headerLeft: () => (
      <HeaderBackButton {...props} onPress={() => 
        {props.navigation.navigate({name: 'Home',params: {  ...props.route.params, connectedstatus}});
        }}
      />
    )});
  });


  return (
    <SafeAreaView style={styles.container}>
      <Text> this is BTC page</Text>
      <View style={styles.heartRateTitleWrapper}>
        {connectedstatus ? (
          <>
            <Text style={styles.heartRateTitleText}>Mode Send:</Text>
            <Text style={styles.heartRateText}>{ledStaticMode}</Text>
            <Text style={styles.heartRateTitleText}>Mode Receive:</Text>
            <Text style={styles.heartRateText}>{rvSignal}</Text>
            <TouchableOpacity
              onPress={async() => {
                              await nextButton();
                            }
              }
              style={styles.ctaButton}
            >
              <Text style={styles.ctaButtonText}>
                {"NEXT"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={async () => {
                              await prevButton()
                            }
              }
              style={styles.ctaButton}
            >
              <Text style={styles.ctaButtonText}>
                {"PREV"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {sdSignal(
                              connectedstatus,
                              ledStaticMode
                              )
                              console.log("submit" + ledStaticMode)
                            }
              }
              style={styles.ctaButton}
            >
              <Text style={styles.ctaButtonText}>
                {"submit"}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.heartRateTitleText}>
            Please Connect to ESP32
          </Text>
        )
        }
      </View>
      {/* <>{console.log(connectedstatus?.id)}</> */}
      <TouchableOpacity
        onPress={connectedstatus ? ()=>{disconnectFromDevice(connectedstatus)
                                        setConnectedStatus(null)} : openModal}
        style={styles.ctaButton}
      >
        <Text style={styles.ctaButtonText}>
          {connectedstatus ? "Disconnect" : "Connect"}
        </Text>
      </TouchableOpacity>
      <DeviceModal
        closeModal={hideModal}
        visible={isModalVisible}
        connectToPeripheral={connectToDevice}
        devices={allDevices}
      />
    </SafeAreaView>
  );
};

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

export default BTConnectScreen;
