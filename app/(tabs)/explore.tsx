import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<Ionicons size={310} name="help-buoy-outline" style={styles.headerImage} />}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Help</ThemedText>
      </ThemedView>
      <ThemedText>This is a student verification app with parents otp.</ThemedText>
      <ThemedText type="defaultSemiBold">
        - Parent received otp on registerd mobile number
      </ThemedText>
      <ThemedText type="defaultSemiBold">
        - Enter otp shared by parents
      </ThemedText>
      <ThemedText type="defaultSemiBold">
        - Verify the parent for right student
      </ThemedText>
      <ThemedText type="defaultSemiBold">
        - That's it. Your done...
      </ThemedText>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
