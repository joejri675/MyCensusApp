import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";

const SplashScreenComponent = () => {
  const navigation = useNavigation();

  // Shared values for animations
  const logoOpacity = useSharedValue(0);
  const logoTranslateY = useSharedValue(50);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(50);

  useEffect(() => {
    // Animate logo first
    logoOpacity.value = withTiming(1, { duration: 2000, easing: Easing.ease });
    logoTranslateY.value = withTiming(0, {
      duration: 2000,
      easing: Easing.out(Easing.cubic),
    });

    // Animate text after logo animation
    textOpacity.value = withTiming(1, { duration: 2000, easing: Easing.ease });
    textTranslateY.value = withTiming(0, {
      duration: 2000,
      easing: Easing.out(Easing.cubic),
      delay: 1000, // Delay text animation for smooth effect
    });

    // Navigate to the next screen after 6 seconds
    const timeout = setTimeout(() => {
      navigation.navigate("index"); // Navigate to the home screen or another page
    }, 6000);

    return () => clearTimeout(timeout); // Cleanup timeout if component unmounts
  }, []);

  // Animated styles for logo
  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ translateY: logoTranslateY.value }],
  }));

  // Animated styles for text
  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  return (
    <View style={styles.container}>
      {/* Animated Logo */}
      <Animated.View style={logoAnimatedStyle}>
        <Image
          source={require("@/assets/images/download.jpeg")} // Ensure the image path is correct
          style={styles.logo}
        />
      </Animated.View>

      {/* Animated Text */}
      <Animated.View style={textAnimatedStyle}>
        <Text style={styles.title}>PNG CENSUS</Text>
        <Text style={styles.subtitle}>Collect, Share, and Inspire</Text>
      </Animated.View>
    </View>
  );
};

// Styling for splash screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF", // White background color
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 250, // Adjust logo size
    height: 150,
    resizeMode: "contain", // Maintain aspect ratio of the logo
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#00BFFF", // Match the color scheme of PNG Census
    textAlign: "center",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#808080", // Subtitle color
    textAlign: "center",
    marginTop: 5,
  },
});

export default SplashScreenComponent;
