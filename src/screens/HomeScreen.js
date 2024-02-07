import { ScrollView, View, StyleSheet, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppLoader, AppText, AppView, HomeHeader } from "../components";
import MatchesItem from "../components/MatchesItem";
import { filterPastEvents, filterUpcomingEvents } from "../constants/functions";
import { setpastTournaments, settournaments } from "../store/userReducer";
import { db } from "../../firebaseConfig";
import { collection, getDocs, onSnapshot, query } from "firebase/firestore";
import { FIRESTORE_COLLECTIONS, IMAGES } from "../constants/data";
import { COLORS, FSTYLES, SIZES } from "../constants/theme";
import { TouchableOpacity } from "react-native";
import Carousel from "react-native-reanimated-carousel";
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
      const pastEvents =filterPastEvents(arr)
      const upcomingEvents = events.filter(
        (item) => item.status !== "completed" && item.isTesting !=='true'
      );
      const completedEvents = pastEvents.filter(
        (item) => item.isTesting !=='true'
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
      <HomeHeader header={"JOHAR11"} headerTextStyle={{right:SIZES.largeTitle*2}} />
      <AppView>
        <View
          style={{
            bottom: 15,
          }}
        >
           <View>
            <Carousel
              loop
              autoPlay={true}
              width={SIZES.width*.935}
              height={SIZES.width / 4}
              data={IMAGES}
              scrollAnimationDuration={1000}
              renderItem={({ item, index }) => (
                <View
                  style={{
                    height:'100%',
                    justifyContent: "center",
                  }}
                >
                  <Image
                    source={item}
                    resizeMode="contain"
                    style={{width:'100%'}}
                  />
                </View>
              )}
            />
          </View>
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
                <MatchesItem key={i} item={item} completed={Completed} />
              ))}
            </>
          ) : (
            <>
              {tournaments.map((item, i) => (
                <MatchesItem key={i} item={item} fetchData={fetchData} />
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
