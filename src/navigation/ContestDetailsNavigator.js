import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { FlatList, ScrollView, View } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { COLORS, FSTYLES, SIZES } from "../constants/theme";
import { AppText } from "../components";
import { useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native";
import { TouchableOpacity } from "react-native";
import { NAVIGATION } from "../constants/routes";
import { getPrizeDistributionData } from "../constants/functions";
import { Avatar } from "react-native-paper";
const Tab = createMaterialTopTabNavigator();
const renderItem = ({ item }) => (
  <View style={{ ...FSTYLES, padding: SIZES.base }}>
    <View style={{ ...FSTYLES, width: "50%" }}>
      <View style={{ ...FSTYLES, width: "20%" }}>
        <AppText size={1.5} bold={true}>
          {item.rank}
        </AppText>
        <Entypo
          name="trophy"
          size={24}
          color={`${item.trophy ? "yellow" : "white"}`}
        />
      </View>

      {(isNaN(item.name) ||
        ![1, 2, 3, 4, 5, 6, 7, 8, 9, 10].includes(parseInt(item.name, 10))) && (
        // Render the name if it's not a numerical value or 1,2,3,4
        <AppText size={1.5}>{item.name}</AppText>
      )}
    </View>

    <View>
      <AppText size={1.5}>₹{item.prizeAmount}</AppText>
    </View>
  </View>
);
export default function ContestDetailsNavigator(matchDetails) {
  const Winnings = ({ navigation }) => {
    const { selectedTournament } = useSelector(
      (state) => state.entities.userReducer
    );
    const [players, setPlayers] = useState([]);

    const getData = useCallback(async () => {
      try {
        await getPrizeDistributionData(selectedTournament.id, setPlayers);
      } catch (error) {
        console.log(error); // Consider displaying this error to the user
      }
    }, [selectedTournament.id]);

    useEffect(() => {
      getData();
    }, [getData]);

    return (
      <SafeAreaView style={{ flex: 1, padding: SIZES.base }}>
        <View style={FSTYLES}>
          <View style={{ ...FSTYLES, width: "35%" }}>
            <AppText size={1.5}>Rank</AppText>
          </View>
          <AppText size={1.5}>Winnings</AppText>
        </View>
        <FlatList
          data={players}
          renderItem={renderItem}
          keyExtractor={(item) => item.name}
        />
      </SafeAreaView>
    );
  };
  const LeaderboardScreen = ({ navigation }) => {
    const { leaderBoard, createPlayers } = useSelector(
      (state) => state.entities.playersReducer
    );
    const [leaderBoardArray, setleaderBoardArray] = useState([]);
    const pointsValue = {
      Captain: 2,
      ViceCaptain: 1.5,
      Player: 1,
    };
    useEffect(() => {
      if (!createPlayers || !leaderBoard) {
        setleaderBoardArray([]);
        return;
      }

      const playerPointMap = createPlayers.reduce((map, player) => {
        map[player.id] = player.points;
        return map;
      }, {});

      const tempLeaderBoard = leaderBoard.map((team) => {
        const teamScore = team.players.reduce((totalScore, player) => {
          const playerPoints = playerPointMap[player.id] || 0;
          const playerType = player.type || "Player";
          const pointValue = pointsValue[playerType] || 0;
          const playerScore = pointValue * playerPoints;
          return totalScore + playerScore;
        }, 0);

        const playersArray = team.players.map((player) => {
          const playerPoints = playerPointMap[player.id] || 0;
          const playerType = player.type || "Player";
          const pointValue = pointsValue[playerType] || 0;

          return {
            name: player.name,
            playerType: player.playerType,
            type: playerType,
            playerPic: player.playerPic,
            points: pointValue * playerPoints,
          };
        });

        return {
          id: team.id,
          userName: team.userName,
          score: teamScore,
          playersArray,
          profilePic: team.profilePic,
        };
      });

      tempLeaderBoard.sort((a, b) => b.score - a.score);
      setleaderBoardArray(tempLeaderBoard);
    }, [createPlayers, leaderBoard]);

    return (
      <SafeAreaView style={{ flex: 1, padding: SIZES.base }}>
        <View style={FSTYLES}>
          <View style={{ ...FSTYLES, width: "35%" }}>
            <AppText size={1.5}>Names</AppText>
          </View>
          <AppText size={1.5}>Ranking</AppText>
        </View>
        <ScrollView>
          {leaderBoardArray.map((item, index) => (
            <TouchableOpacity
              onPress={() => {
                const selectedTeam = leaderBoard.find(
                  (team) => team.id === item.id
                );
                if (matchDetails.status === "completed") {
                  navigation.navigate(NAVIGATION.WINNING_POINTS, {
                    selectedTeam,
                    playersArray: item.playersArray,
                  });
                }
              }}
              key={index}
              style={{ ...FSTYLES, padding: SIZES.base }}
            >
              <View style={{ ...FSTYLES, width: "30%" }}>
                {item.profilePic ? (
                  <Avatar.Image
                    size={SIZES.base * 3}
                    source={{ uri: item.profilePic }}
                  />
                ) : (
                  <Avatar.Icon
                    size={SIZES.base * 3}
                    icon="account"
                    style={{ backgroundColor: COLORS.white }}
                  />
                )}
                <AppText style={{ left: 12 }} size={1.3}>
                  {item.userName}
                </AppText>
              </View>
              <View>
                <AppText size={1.3}>{index + 1}</AppText>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  };

  return (
    <Tab.Navigator>
      <Tab.Screen name="Winnings" component={Winnings} />
      <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
    </Tab.Navigator>
  );
}
