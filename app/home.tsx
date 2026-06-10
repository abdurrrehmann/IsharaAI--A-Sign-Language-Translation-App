import React, { useMemo } from 'react';
import { PixelRatio, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

const BASE_WIDTH = 390; // reference width
const BASE_HEIGHT = 844; // reference height

function moderateScale(size: number, factor = 0.5, scale: number) {
  return Math.round(size + (size * (scale - 1)) * factor);
}

export default function Home() {
  const { width, height } = useWindowDimensions();
  const isPortrait = height >= width;

  const scale = Math.min(width / BASE_WIDTH, height / BASE_HEIGHT);
  const fontScale = PixelRatio.getFontScale ? PixelRatio.getFontScale() : 1;

  const sizes = useMemo(() => ({
    title: moderateScale(20, 0.6, scale) * fontScale,
    subtitle: moderateScale(14, 0.6, scale) * fontScale,
    cardPadding: Math.round(14 * scale),
    actionPadding: Math.round(14 * scale),
    sectionGap: Math.round(20 * scale),
  }), [scale, fontScale]);

  const responsiveStyles = useMemo(() => createStyles(sizes, isPortrait, width), [sizes, isPortrait, width]);

  return (
    <ScrollView contentContainerStyle={[styles.scrollContainer]} keyboardShouldPersistTaps="handled">
      <View style={responsiveStyles.content}>
        <Text style={[styles.title, { fontSize: sizes.title }]}>Welcome to IsharaAI</Text>
        <Text style={[styles.subtitle, { fontSize: sizes.subtitle }]}>PSL learning with AI — Practical Sign Language learning for students</Text>

        <View style={[styles.quickActions, { marginTop: sizes.sectionGap }]}> 
          <View style={[styles.actionCard, styles.actionPrimary, { padding: sizes.actionPadding }]}> 
            <Text style={[styles.actionTitle, { fontSize: moderateScale(14, 0.6, scale) }]}>SignAcademy</Text>
          </View>
          <View style={[styles.actionCard, styles.actionAccent, { padding: sizes.actionPadding }]}> 
            <Text style={[styles.actionTitle, { fontSize: moderateScale(14, 0.6, scale) }]}>SignDetect</Text>
          </View>
          <View style={[styles.actionCard, styles.actionMuted, { padding: sizes.actionPadding }]}> 
            <Text style={[styles.actionTitle, { fontSize: moderateScale(14, 0.6, scale) }]}>Progress</Text>
          </View>
        </View>

        <View style={[styles.progressSection, { marginTop: sizes.sectionGap }]}> 
          <Text style={[styles.sectionTitle, { fontSize: moderateScale(16, 0.6, scale) }]}>Learning Progress</Text>
          <View style={[styles.progressBar, { height: Math.max(6, Math.round(8 * scale)) }]}>
            <View style={[styles.progressFill, { width: '42%' }]} />
          </View>
          <Text style={[styles.progressText, { marginTop: Math.round(6 * scale) }]}>42% complete</Text>
        </View>

        <View style={[styles.signOfDay, { marginTop: sizes.sectionGap }]}> 
          <Text style={[styles.sectionTitle, { fontSize: moderateScale(16, 0.6, scale) }]}>Sign of the Day</Text>
          <Text style={[styles.signLabel, { fontSize: moderateScale(14, 0.6, scale) }]}>Word: &quot;Thank You&quot;</Text>
          <View style={[styles.signPlaceholder, { aspectRatio: isPortrait ? 1 : 16 / 9, borderRadius: Math.round(8 * scale) }]}>
            <Text style={[styles.placeholderText, { fontSize: moderateScale(14, 0.5, scale) }]}>Image / Video Placeholder</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

function createStyles(sizes: any, isPortrait: boolean, width: number) {
  return StyleSheet.create({
    content: {
      width: '100%',
      maxWidth: 920,
      alignSelf: 'center',
      paddingHorizontal: 16,
      paddingBottom: 20,
    },
  });
}

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, backgroundColor: '#fff', paddingVertical: 20 },
  title: {
    fontWeight: '700',
    color: '#001F3F',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 8,
    color: '#44525a',
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  actionCard: {
    flexBasis: '30%',
    minWidth: 140,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionPrimary: {
    backgroundColor: '#20c997',
  },
  actionAccent: {
    backgroundColor: '#FFB400',
  },
  actionMuted: {
    backgroundColor: '#E9F4FF',
    borderWidth: 1,
    borderColor: '#cfe9ff',
  },
  actionTitle: {
    color: '#001F3F',
    fontWeight: '700',
  },
  progressSection: {
    width: '100%',
  },
  sectionTitle: {
    fontWeight: '700',
    color: '#001F3F',
    marginBottom: 8,
  },
  progressBar: {
    borderRadius: 4,
    backgroundColor: '#e9ecef',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#20c997',
  },
  progressText: {
    color: '#444',
    textAlign: 'center',
  },
  signOfDay: {
    width: '100%',
    alignItems: 'center',
  },
  signLabel: {
    color: '#111',
    fontWeight: '600',
    marginBottom: 8,
  },
  signPlaceholder: {
    width: '100%',
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#adb5bd',
  },
});
