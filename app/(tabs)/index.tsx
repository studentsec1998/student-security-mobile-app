import { Text, Button, StyleSheet, Pressable, ActivityIndicator, Alert } from "react-native";
import { TextInput } from "react-native";
import { useRef, useState } from "react";
import { View } from "react-native";
import { OTPInput } from "react-native-otp-component";
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from "axios";

export default function SignIn() {
  const [codes, setCodes] = useState<string[] | undefined>(Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifiedSuccess, setIsVerifiedSuccess] = useState(false)
  const [verifiedStudentData, setVerifiedStudentData] = useState(null);
  const refs = Array(6)
    .fill(null)
    .map(() => useRef<TextInput>(null));

  const [errorMessages, setErrorMessages] = useState<string[]>();

  const onChangeCode = (text: string, index: number) => {
    if (text.length > 1) {
      setErrorMessages(undefined);
      const newCodes = text.split("");
      setCodes(newCodes);
      refs[5]!.current?.focus();
      return;
    }
    setErrorMessages(undefined);
    const newCodes = [...codes!];
    newCodes[index] = text;
    setCodes(newCodes);
    if (text !== "" && index < 5) {
      refs[index + 1]!.current?.focus();
    }
  };

  const verifyHandler = async (event) => {
    console.log("codes", codes?.join(''))
    setIsLoading(true);
    const otoPayload = {
      otp: codes?.join('')
    }

    try {
      const response = await axios.post(`http://192.168.0.122:3000/api/otp/verifyotp`, otoPayload);
      if (response.status === 200) {
        setVerifiedStudentData(response.data.data)
        setIsVerifiedSuccess(true)
        setIsLoading(false);
        setCodes(Array(6).fill(""));
      } else {
        Alert.alert("SORRY!", "Failed to verify OTP");
        setIsVerifiedSuccess(false)
        setCodes(Array(6).fill(""));
      }
    } catch (error: any) {
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      Alert.alert("SORRY!", resMessage);
      setCodes(Array(6).fill(""));
      setIsLoading(false);
    }
  };

  const otpConfig = {
    borderColor: "#000",
    backgroundColor: "#fff",
    textColor: "#000",
    errorColor: "#dc2626",
    focusColor: "#22c55e"
  }

  return (
    isVerifiedSuccess ? <View
      style={
        {
          height: "100%",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          padding: 20,
          backgroundColor: "#fff"
        }
      }
    >
      {isVerifiedSuccess ?
        <Ionicons size={100} name="checkmark-circle" style={styles.checkmark} /> :
        <Ionicons size={100} name="close-circle" style={styles.close} />
      }
      {isVerifiedSuccess ? <Text style={styles.alertMsg}>Successful</Text> : <Text style={styles.alertMsg}>Failed</Text>}
      <View style={{
        height: 1,
        backgroundColor: '#000',
        alignSelf: 'stretch'
      }} />

      <Text style={styles.infoLabel}>Student name:</Text>
      <Text style={styles.infoValue}>{verifiedStudentData?.studentName || 'NA'}</Text>
      <Text style={styles.infoLabel}>Parent name:</Text>
      <Text style={styles.infoValue}>{verifiedStudentData?.parentName || 'NA'}</Text>
      <Text style={styles.infoLabel}>Parent mobile:</Text>
      <Text style={styles.infoValue}>{verifiedStudentData?.phone || 'NA'}</Text>
      <View style={{
        height: 1,
        backgroundColor: '#000',
        alignSelf: 'stretch'
      }} />
      <Pressable style={styles.backButton} onPress={() => {
        setIsVerifiedSuccess(false)
        setVerifiedStudentData(null)
      }}>
        <Ionicons size={20} name="arrow-back-sharp" style={styles.backArrow} />
        <Text style={styles.text}> Back </Text>
      </Pressable>
    </View> :
      <View
        style={
          {
            height: "100%",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            padding: 20,
            gap: 50,
            backgroundColor: "#fff"
          }
        }>
        <Ionicons size={150} name="shield-checkmark-sharp" style={styles.checkmark} />
        <Text style={styles.title}>Enter verification code</Text>
        <OTPInput
          codes={codes!}
          errorMessages={errorMessages}
          onChangeCode={onChangeCode}
          refs={refs}
          config={otpConfig}
        />

        {isLoading ?
          <><ActivityIndicator size="large" color="#00ff00" />
            <Text>Verifying please wait...</Text></>
          : <Pressable style={styles.button} onPress={verifyHandler}>
            <Text style={styles.text}>Verify phone number</Text>
          </Pressable>}
      </View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: 'green'
  },
  headerTitle: {
    fontSize: 50,
  },

  title: {
    fontSize: 30,
    fontWeight: "800"
  },
  subTitle: {
    fontSize: 20
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 30,
    elevation: 3,
    backgroundColor: '#ff1b1b'
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '800',
    letterSpacing: 0.25,
    color: 'white',
  },
  checkmark: {
    color: 'green'
  },
  close: {
    color: 'red'
  },
  infoLabel: {
    fontWeight: "600",
    paddingTop: 10
  },
  infoValue: {
    fontWeight: "800",
    fontSize: 20,
  },
  alertMsg: {
    fontSize: 30,
    fontWeight: "800"
  },
  backButton: {
    display: "flex",
    flexDirection: "row",
    gap: 2,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: "#000",
    borderRadius: 30
  },
  backArrow: {
    color: "#fff"
  }
});