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
    const { selectedTournament } = useSelector(
      (state) => state.entities.userReducer
    );

    const [players, setPlayers] = useState([
      { name: "Player 1", prize: 3 }, 
      { name: "Player 2", prize: 2 },
      { name: "Player 3", prize: 1 },
    ]);

    // const [totalAmount, setTotalAmount] = useState(100); // Total amount to distribute among players

    // const distributeAmount = () => {
    //   const totalPlayers = players.length;

    //   const distributedPlayers = players.map(player => ({
    //     name: player.name,
    //     amountReceived: (totalAmount * player.percentage).toFixed(2),
    //   }));

    //   const totalPercentage = players.reduce((sum, player) => sum + player.percentage, 0);
    //   const remainingAmount = totalAmount * (1 - totalPercentage);
    //   const amountPerRemainingPlayer = remainingAmount / (totalPlayers - players.length);

    //   for (let i = players.length; i < totalPlayers; i++) {
    //     distributedPlayers.push({
    //       name: `Player ${i + 1}`,
    //       amountReceived: amountPerRemainingPlayer.toFixed(2),
    //     });
    //   }

    //   return distributedPlayers;
    // };

    // const handleDistribution = () => {
    //   const distributedPlayers = distributeAmount();
    //   // You can do something with the distributedPlayers array here (e.g., set it in state, display it, etc.)
    //   console.log("Amount distribution among players:");
    //   console.log(distributedPlayers);
    // };
    return (
      <SafeAreaView style={{ flex: 1, padding: SIZES.base }}>
        <View style={FSTYLES}>
          <View style={{ ...FSTYLES, width: "35%" }}>
            <AppText size={1.5}>Rank</AppText>
          </View>
          <AppText size={1.5}>Winnings</AppText>
        </View>
        <ScrollView>
          {players.map((item, index) => (
            <View key={index} style={{ ...FSTYLES, padding: SIZES.base }}>
              <View style={{ ...FSTYLES, width: "30%" }}>
                <AppText size={1.5}>{index + 1}</AppText>
              </View>
              <View>
                <AppText size={1.5}>{item.prize}</AppText>
              </View>
            </View>
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
