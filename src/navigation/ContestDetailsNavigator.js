import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { ScrollView, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { FSTYLES, SIZES } from "../constants/theme";
import { AppText } from "../components";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native";
import { TouchableOpacity } from "react-native";
import { NAVIGATION } from "../constants/routes";
const Tab = createMaterialTopTabNavigator();

export default function ContestDetailsNavigator() {
  const Winnings = ({ navigation }) => {
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
          <AppText size={1.5}>Points</AppText>
        </View>
        <ScrollView>
          {leaderBoardArray.map((item, index) => (
            <TouchableOpacity
              onPress={() => {
                const selectedTeam = leaderBoard.find(
                  (team) => team.id === item.id
                );
                navigation.navigate(NAVIGATION.WINNING_POINTS, {
                  selectedTeam,
                  playersArray: item.playersArray,
                });
              }}
              key={index}
              style={{ ...FSTYLES, padding: SIZES.base }}
            >
              <View style={{ ...FSTYLES, width: "30%" }}>
                <FontAwesome name="user-circle-o" size={24} color="black" />
                <AppText style={{ left: 12 }} size={1.3}>
                  {item.userName}
                </AppText>
              </View>
              <View>
                <AppText size={1.3}>{item.score}</AppText>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
                navigation.navigate(NAVIGATION.WINNING_POINTS, {
                  selectedTeam,
                  playersArray: item.playersArray,
                });
              }}
              key={index}
              style={{ ...FSTYLES, padding: SIZES.base }}
            >
              <View style={{ ...FSTYLES, width: "30%" }}>
                <FontAwesome name="user-circle-o" size={24} color="black" />
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
