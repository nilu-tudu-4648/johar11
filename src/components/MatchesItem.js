import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { AppText } from "../components";
import { COLORS, FSTYLES } from "../constants/theme";
import { useNavigation } from "@react-navigation/native";
import { NAVIGATION } from "../constants/routes";
import { useDispatch } from "react-redux";
import { setselectedTournament } from "../store/userReducer";
import { Image } from "react-native";
import { showToast } from "../constants/functions";

const MatchesItem = ({ item, completed ,fetchData}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch()
  const navigateToMatchDetails = () => {
    navigation.navigate(NAVIGATION.MATCH_DETAILS, { item, completed });
    dispatch(setselectedTournament(item));
  };
  
  const tournamentDateTime = new Date(item.dateAndTime)
  const currentDateTime = new Date();
  return (
    <TouchableOpacity
    onPress={() => {
if(completed){

  navigateToMatchDetails();
}else     if (!completed && currentDateTime < tournamentDateTime) {
        console.log('Navigating to match details...');
        navigateToMatchDetails();
      } else {
        console.log('Match time has ended. Fetching completed matches...');
        showToast("Match time has ended. Please wait for the results.");
        fetchData && fetchData('completed');
      }
    }}
    style={styles.mainContainer}
  >
      <View
        style={{
          ...FSTYLES,
          backgroundColor: COLORS.lightyellow,
          padding: 4,
        }}
      >
        <AppText size={1.5}>Prize {item?.prizeAmount}</AppText>
        <AppText style={{ fontWeight: "400" }} bold={true} size={1.5}>
          {item?.eventName}
        </AppText>
      </View>
      <View
        style={{
          ...FSTYLES,
          paddingHorizontal: 8,
        }}
      >
        <View
          style={{
            alignItems: "flex-start",
            width: "30%",
          }}
        >
          {item.captain1Pic ? (
            <Image
              source={{ uri: item.captain1Pic }}
              style={{ width: 40, height: 40 }}
            />
          ) : (
            <View style={{ backgroundColor: "red", height: 20, width: 20 }} />
          )}
          <AppText size={1.5} bold={true}>
            {item.firstTeamName}
          </AppText>
        </View>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <AppText size={1.5}>{item.date}</AppText>
          <AppText color={COLORS.primary} size={1.2}>
            {item.time}
          </AppText>
        </View>
        <View
          style={{
            width: "30%",
            alignItems: "flex-end",
          }}
        >
          {item.captain2Pic ? (
            <Image
              source={{ uri: item.captain2Pic }}
              style={{ width: 40, height: 40 }}
            />
          ) : (
            <View style={{ backgroundColor: "red", height: 20, width: 20 }} />
          )}
          <AppText size={1.5} bold={true}>
            {item.secondTeamName}
          </AppText>
        </View>
      </View>
      <View
        style={{
          ...FSTYLES,
          padding: 4,
          backgroundColor: COLORS.lightgray,
        }}
      >
        <AppText size={1.5}>{item.eventLocation}</AppText>
        <AppText size={1.5}>{item.eventType}</AppText>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    height: 150,
    width: "99%",
    backgroundColor: COLORS.white,
    borderRadius: 8,
    justifyContent: "space-between",
    alignSelf: "center",
    marginVertical: 8,
    elevation: 5,
  },
});
export default React.memo(MatchesItem);
