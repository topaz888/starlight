import { FC } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type CustomSectionListProps = {sections:{title:string,data:string[]}[], renderSectionHeader:(section:{title:string,data:string[]})=>{}, 
                                renderItem:(title:string,data:string[])=>{}};
const SectionList: FC<CustomSectionListProps> = props => {

    return (
      <View>
        {props.sections.map((item, key) => {
          return (
            <>
                <>{props.renderSectionHeader(item)}</>
                <>{props.renderItem(item.title, item.data)}</>
            </>
          );
        })}
      </View>
    );
  };

export default SectionList;