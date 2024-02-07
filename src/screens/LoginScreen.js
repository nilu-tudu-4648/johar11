import {
  StyleSheet,
  View,
  BackHandler,
  Image,
  ScrollView,
  ImageBackground,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import { COLORS, FSTYLES, SIZES } from "../constants/theme";
import { useForm } from "react-hook-form";
import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import FormInput from "../components/FormInput";
import AppLoader from "../components/AppLoader";
import { db } from "../../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { NAVIGATION } from "../constants/routes";
import { useDispatch } from "react-redux";
import { setLoginUser } from "../store/userReducer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FIRESTORE_COLLECTIONS } from "../constants/data";
import { showToast, updateUser } from "../constants/functions";
import { TouchableOpacity } from "react-native";

const LoginScreen = ({ navigation }) => {
  const [loading, setloading] = useState(false);
  const [forgotPin, setforgotPin] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      phone: "",
      password: "",
    },
  });
  const dispatch = useDispatch();
  async function getUser(mobile, forgot = false) {
    const q = query(
      collection(db, FIRESTORE_COLLECTIONS.USERS),
      where("mobile", "==", mobile)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const data = querySnapshot.docs[0].data();
      if (forgot) {
        showToast(`Your password is ${data.password}`);
      }
      return data;
    }
    // User does not exist
    return null;
  }
  const handleSignIn = async (phone, password) => {
    const userExists = await getUser(phone);

    if (!userExists) {
      showToast("Invalid credentials");
      console.log("User login failed.");
      return;
    }
    const checkPassword = userExists.password === password;
    if (checkPassword) {
      dispatch(setLoginUser(userExists));
      const fcmToken = await AsyncStorage.getItem("fcmToken");
      await updateUser({ ...userExists, fcmToken }, dispatch);
      showToast("Login successful");
    } else {
      showToast("Invalid credentials");
      console.log("User login failed.");
    }
  };
  const onSubmit = async (data) => {
    if (forgotPin) {
      await getUser(data.phone, true);
      setforgotPin(false);
    } else {
      setloading(true);
      try {
        await handleSignIn(data.phone, data.password);
      } catch (error) {
        console.log(error, "err");
        showToast("Something went wrong");
      } finally {
        setloading(false);
      }
    }
  };
  BackHandler.addEventListener(
    "hardwareBackPress",
    () => {
      navigation.navigate(NAVIGATION.WELCOME);
      return () => true;
    },
    []
  );
  const phonePattern = /^[6-9][0-9]{9}$/;
  return (
    <ImageBackground
      style={{ height: SIZES.height, flex: 1 }}
      source={require("../../assets/messi.jpg")}
    >
      <View style={styles.container}>
        <AppLoader loading={loading} />
        <View style={{ flex: 0.3 }} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "space-between",
          }}
        >
          <View style={{ ...FSTYLES, paddingHorizontal: "6%" }}>
            <Image
              source={require("../../assets/icon.png")}
              style={styles.logo}
            />
            <View>
              <AppText bold={true} size={3} style={styles.title}>
                {"Login Account"}
              </AppText>
              <AppText bold={true} size={2} style={{ ...styles.title }}>
                {"Hello ,Welcome Back"}
              </AppText>
            </View>
          </View>
          <View style={styles.inputContainer}>
            <FormInput
              control={control}
              rules={{
                required: "This field is mandatory",
                pattern: {
                  value: phonePattern,
                  message: "Please enter a valid phone number",
                },
                minLength: {
                  value: 10,
                  message: "Please enter a valid phone number",
                },
              }}
              keyboardType="numeric"
              placeholder="Enter Mobile Number"
              name="phone"
              maxLength={10}
            />
            {!forgotPin ? (
              <FormInput
                control={control}
                rules={{ required: "This field is mandatory" }}
                placeholder="Password"
                name="password"
                secureTextEntry={true}
              />
            ) : null}
            {!forgotPin && (
              <TouchableOpacity
                style={{ alignSelf: "flex-end" }}
                onPress={() => setforgotPin(true)}
              >
                <AppText size={1.3} color={COLORS.white}>
                  Forgot Pin
                </AppText>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
        <View>
          <AppButton
            title={forgotPin ? "Get Password" : "Login"}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.h1,
  },
  logo: {
    width: 90,
    height: 90,
    borderRadius: 90 / 2,
  },
  title: {
    color: COLORS.white,
  },
  inputContainer: {
    marginVertical: SIZES.padding * 2,
  },
});
