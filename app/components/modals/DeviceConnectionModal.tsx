import React, {FC, useCallback} from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  Modal,
  SafeAreaView,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {BluetoothPeripheral} from '../../models/BluetoothPeripheral';
import CTAButton from '../buttons/CTAButton';
import { screenWidth } from '../constant/constant';

const _screenWidth = screenWidth;
type DeviceModalListItemProps = {
  item: ListRenderItemInfo<BluetoothPeripheral>;
  connectToPeripheral: (device: BluetoothPeripheral) => void;
  closeModal: () => void;
};

type DeviceModalProps = {
  devices: BluetoothPeripheral[];
  visible: boolean;
  connectToPeripheral: (device: BluetoothPeripheral) => void;
  closeModal: () => void;
};

const DeviceModalListItem: FC<DeviceModalListItemProps> = props => {
  const {item, connectToPeripheral, closeModal} = props;
  const connectAndCloseModal = useCallback(() => {
    connectToPeripheral(item.item);
    closeModal();
  }, [closeModal, connectToPeripheral, item.item]);
  return <CTAButton title={item.item.name} onPress={connectAndCloseModal} />;
};

const DeviceModal: FC<DeviceModalProps> = props => {
  const {devices, visible, connectToPeripheral, closeModal} = props;

  const renderDeviceModalListItem = useCallback(
    (item: ListRenderItemInfo<BluetoothPeripheral>) => {
      return (
        <DeviceModalListItem
          item={item}
          connectToPeripheral={connectToPeripheral}
          closeModal={closeModal}
        />
      );
    },
    [closeModal, connectToPeripheral],
  );

  return (
    <Modal
      style={modalStyle.modalContainer}
      animationType="slide"
      transparent={false}
      visible={visible}>
      <SafeAreaView style={modalStyle.modalTitle}>
        <Text style={modalStyle.modalTitleText}>
          Tap on a device to connect
        </Text>
        <FlatList
          contentContainerStyle={modalStyle.modalFlatlistContiner}
          data={devices}
          renderItem={renderDeviceModalListItem}
        />
        <View style={modalStyle.buttonContainer}>
          <CTAButton title= "Close" onPress={closeModal} />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const modalStyle = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  modalFlatlistContiner: {
    flex: 1,
    justifyContent: 'center',
  },
  buttonContainer: {
    position:'absolute',
    bottom: 20,
    left: _screenWidth/2-150,
},
  modalCellOutline: {
    borderWidth: 1,
    borderColor: 'black',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 8,
  },
  modalTitle: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  modalTitleText: {
    marginTop: 40,
    fontSize: 30,
    fontWeight: 'bold',
    marginHorizontal: 20,
    textAlign: 'center',
  },
});

export default DeviceModal;