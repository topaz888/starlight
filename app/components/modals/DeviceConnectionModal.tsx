import React, {FC, useCallback} from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  Modal,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {BluetoothPeripheral} from '../../models/BluetoothPeripheral';
import CTAButton from '../buttons/CTAButton';
import ListBUtton from '../buttons/ListButton';
import CustomText from '../text/CustomText';
import DataList from '../../language/EN/language.data';

type DeviceModalListItemProps = {
  item: ListRenderItemInfo<BluetoothPeripheral>;
  connectToPeripheral: (device: BluetoothPeripheral) => void;
  closeModal: () => void;
};

type DeviceModalProps = {
  devices: BluetoothPeripheral[];
  visible: boolean;
  enableState: boolean;
  connectToPeripheral: (device: BluetoothPeripheral) => void;
  closeModal: () => void;
};

const DeviceModalListItem: FC<DeviceModalListItemProps> = props => {
  const {item, connectToPeripheral, closeModal} = props;
  const connectAndCloseModal = useCallback(() => {
    connectToPeripheral(item.item);
    closeModal();
  }, [closeModal, connectToPeripheral, item.item]);
  return <ListBUtton title={item.item.name} onPress={connectAndCloseModal} />;
};

const DeviceModal: FC<DeviceModalProps> = props => {
  const {devices, visible, enableState, connectToPeripheral, closeModal} = props;

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
        <CustomText style={modalStyle.modalTitleText}>
          {enableState?DataList.components.Text[0]:DataList.components.Text[3]}
        </CustomText>
        <View style={modalStyle.modalFlatlistContiner}>
          <FlatList data={devices} renderItem={renderDeviceModalListItem}/>
        </View>
        <View style={modalStyle.buttonContainer}>
          <CTAButton title="Close" theme={'Dark'} onPress={closeModal} width={300} height={50} />
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
    justifyContent: 'flex-start',
    alignItems:'center',
    marginVertical: 40,
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    alignItems:'center',
    marginVertical: 50,
  },
  modalTitle: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  modalTitleText: {
    marginTop: 40,
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 10,
    textAlign: 'center',
    color: '#285476',
  },
});

export default DeviceModal;