import { ScrollView, View, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppLoader, AppText, AppView, HomeHeader } from "../components";
import MatchesItem from "../components/MatchesItem";
import { filterUpcomingEvents } from "../constants/functions";
import { setpastTournaments, settournaments } from "../store/userReducer";
import { db } from "../../firebaseConfig";
import { collection, getDocs, onSnapshot, query } from "firebase/firestore";
import { FIRESTORE_COLLECTIONS, IMAGES } from "../constants/data";
import { COLORS, FSTYLES, SIZES } from "../constants/theme";
import { TouchableOpacity } from "react-native";
import { SliderBox } from "react-native-image-slider-box";
const HomeScreen = () => {
  const { tournaments, pastTournaments } = useSelector(
    (state) => state.entities.userReducer
  );
  const dispatch = useDispatch();
  const [loading, setloading] = useState(true);
  const [Completed, setCompleted] = useState(false);
  
  const fetchData = async () => {
    try {
      const q = query(collection(db, FIRESTORE_COLLECTIONS.TOURNAMENTS));
      const querySnapshot = await getDocs(q);
      let arr = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const id = doc.id;
        return arr.push({ id, ...data });
      });

      const events = filterUpcomingEvents(arr);
      const upcomingEvents = events.filter(
        (item) => item.status !== "completed" && item.isTesting !=='true'
      );
      const completedEvents = events.filter(
        (item) => item.status === "completed" && item.isTesting !=='true'
      );
      dispatch(settournaments(upcomingEvents));
      dispatch(setpastTournaments(completedEvents));
      setloading(false);
    } catch (error) {
      console.error("Error fetching and listening for data:", error);
    }
  };

  useEffect(() => {
    fetchData();

    const unsubscribe = onSnapshot(
      collection(db, FIRESTORE_COLLECTIONS.TOURNAMENTS),
      () => {
        // When there are changes in the collection, re-fetch the data
        fetchData();
      }
    );

    // Cleanup: Unsubscribe when the component unmounts
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [dispatch]);

  return (
    <>
      <AppLoader loading={loading} />
      <HomeHeader header={"JOHAR11"} />
      <AppView>
        <View
          style={{
            bottom: 15,
          }}
        >
          <SliderBox
            images={IMAGES}
            sliderBoxHeight={100}
            resizeMode={"contain"}
            autoplay
            parentWidth={SIZES.width * 0.935}
            circleLoop
          />
        </View>
        <View style={FSTYLES}>
          <TouchableOpacity
            onPress={() => setCompleted(false)}
            style={{
              ...styles.tabStyle,
              backgroundColor: !Completed ? COLORS.green : COLORS.gray,
            }}
          >
            <AppText size={1.5} bold={true}>
              Upcoming Matches
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setCompleted(true)}
            style={{
              backgroundColor: Completed ? COLORS.green : COLORS.gray,
              ...styles.tabStyle,
            }}
          >
            <AppText size={1.5} bold={true}>
              Completed Matches
            </AppText>
          </TouchableOpacity>
        </View>
        <ScrollView
          style={{ width: "100%" }}
          showsVerticalScrollIndicator={false}
        >
          {Completed ? (
            <>
              {pastTournaments.map((item, i) => (
                <MatchesItem key={i} item={item} />
              ))}
            </>
          ) : (
            <>
              {tournaments.map((item, i) => (
                <MatchesItem key={i} item={item} />
              ))}
            </>
          )}
        </ScrollView>
      </AppView>
    </>
  );
};

const styles = StyleSheet.create({
  tabStyle: {
    width: "48%",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
});

export default HomeScreen;
