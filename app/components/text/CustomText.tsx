import { FC } from 'react';
import { Text, TextProps } from 'react-native';

const defaultProps: TextProps = {
    allowFontScaling: false
}

const CustomText: FC<TextProps> = ({ children, ...props }) => {
    return <Text {...{ ...defaultProps, ...props }}>{children}</Text>
}

export default CustomText;