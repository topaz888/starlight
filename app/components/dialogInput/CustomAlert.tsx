import { FC, useEffect } from "react";
import { Alert, View, Text} from "react-native";

type AlertProps = {

}
const AlertWithoutClick: FC<AlertProps> = props =>{
    useEffect(() => {
        createTwoButtonAlert();
      }, []);
    const createTwoButtonAlert = () =>
    {    
        return Alert.alert('Warning', 'If you choose Yes, this setting is removed.', [
        {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
        },
        { text: 'Yes', 
            onPress: () => console.log('Yes Pressed')
        },
        ])
    }

    return(
            <View>
                <Text>hello</Text>     
            </View>
        )
}

export default AlertWithoutClick;