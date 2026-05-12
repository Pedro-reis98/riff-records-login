import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Linking,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { router } from "expo-router";
import {
  ArrowLeft,
  Disc3,
  ExternalLink,
  Headphones,
  Music2,
  Play,
  Star,
} from "lucide-react-native";

type Track = {
  title: string;
  album: string;
  duration: string;
  spotifyId: string;
};

type VinylRecord = {
  id: string;
  band: string;
  origin: string;
  years: string;
  label: string;
  mood: string;
  color: string;
  accent: string;
  bio: string;
  topAlbums: string[];
  topTracks: Track[];
};

const RECORDS: VinylRecord[] = [
  {
    id: "acdc",
    band: "AC/DC",
    origin: "Sydney, Australia",
    years: "Desde 1973",
    label: "Hard rock",
    mood: "riff direto, palco em chamas e refrão de estádio",
    color: "#C4211C",
    accent: "#FFCF57",
    bio:
      "Banda australiana que virou referência em riffs simples, pesados e extremamente marcantes. A identidade do AC/DC mistura blues, hard rock e energia de show grande, com guitarras no centro de tudo.",
    topAlbums: ["Highway to Hell", "Back in Black", "Let There Be Rock"],
    topTracks: [
      {
        title: "Highway to Hell",
        album: "Highway to Hell",
        duration: "3:28",
        spotifyId: "2zYzyRzz6pRmhPzyfMEC8s",
      },
      {
        title: "Back In Black",
        album: "Back in Black",
        duration: "4:15",
        spotifyId: "08mG3Y1vljYA6bvDt4Wqkj",
      },
      {
        title: "Thunderstruck",
        album: "The Razors Edge",
        duration: "4:52",
        spotifyId: "57bgtoPSgt236HzfBOd8kj",
      },
    ],
  },
  {
    id: "queen",
    band: "Queen",
    origin: "Londres, Reino Unido",
    years: "1970 - presente",
    label: "Rock clássico",
    mood: "teatro, coro gigante e solos de guitarra cantáveis",
    color: "#7B2CBF",
    accent: "#F7D774",
    bio:
      "O Queen juntou rock, ópera, pop e performance teatral em músicas com arranjos enormes. A banda ficou marcada pela voz de Freddie Mercury e pelas guitarras melódicas de Brian May.",
    topAlbums: ["A Night at the Opera", "News of the World", "The Game"],
    topTracks: [
      {
        title: "Bohemian Rhapsody",
        album: "A Night at the Opera",
        duration: "5:54",
        spotifyId: "7tFiyTwD0nx5a1eklYtX2J",
      },
      {
        title: "Another One Bites The Dust",
        album: "The Game",
        duration: "3:35",
        spotifyId: "5vdp5UmvTsnMEMESIF2Ym7",
      },
      {
        title: "Don't Stop Me Now",
        album: "Jazz",
        duration: "3:29",
        spotifyId: "5T8EDUDqKcs6OSOwEsfqG7",
      },
    ],
  },
  {
    id: "nirvana",
    band: "Nirvana",
    origin: "Aberdeen, EUA",
    years: "1987 - 1994",
    label: "Grunge",
    mood: "distorção crua, tensão e refrão explosivo",
    color: "#D6A21E",
    accent: "#111111",
    bio:
      "O Nirvana levou o grunge para o centro da música mundial nos anos 90. As composições misturam peso, melodia e letras desconfortáveis, com uma estética propositalmente simples.",
    topAlbums: ["Nevermind", "In Utero", "Bleach"],
    topTracks: [
      {
        title: "Smells Like Teen Spirit",
        album: "Nevermind",
        duration: "5:01",
        spotifyId: "5ghIJDpPoe3CfHMGu71E6T",
      },
      {
        title: "Come As You Are",
        album: "Nevermind",
        duration: "3:38",
        spotifyId: "4P5KoWXOxwuobLmHXLMobV",
      },
      {
        title: "Heart-Shaped Box",
        album: "In Utero",
        duration: "4:41",
        spotifyId: "11LmqTE2naFULdEP94AUBa",
      },
    ],
  },
  {
    id: "guns",
    band: "Guns N' Roses",
    origin: "Los Angeles, EUA",
    years: "Desde 1985",
    label: "Hard rock",
    mood: "rua, perigo, balada épica e solo rasgado",
    color: "#D9480F",
    accent: "#F6D365",
    bio:
      "O Guns N' Roses trouxe de volta uma pegada mais suja para o rock de arena no fim dos anos 80. A banda equilibra agressividade, blues e baladas grandiosas.",
    topAlbums: ["Appetite for Destruction", "Use Your Illusion I", "Use Your Illusion II"],
    topTracks: [
      {
        title: "Sweet Child O' Mine",
        album: "Appetite for Destruction",
        duration: "5:56",
        spotifyId: "7o2CTH4ctstm8TNelqjb51",
      },
      {
        title: "Welcome To The Jungle",
        album: "Appetite for Destruction",
        duration: "4:32",
        spotifyId: "0bVtevEgtDIeRjCJbK3Lmv",
      },
      {
        title: "November Rain",
        album: "Use Your Illusion I",
        duration: "8:57",
        spotifyId: "3YRCqOhFifThpSRFJ1VWFM",
      },
    ],
  },
  {
    id: "pink-floyd",
    band: "Pink Floyd",
    origin: "Londres, Reino Unido",
    years: "1965 - 2014",
    label: "Rock progressivo",
    mood: "camadas, viagem sonora e conceito fechado",
    color: "#2F6F73",
    accent: "#F2C94C",
    bio:
      "O Pink Floyd transformou o álbum em experiência completa. As músicas trabalham atmosfera, crítica social e construção lenta, com forte identidade visual e sonora.",
    topAlbums: ["The Dark Side of the Moon", "Wish You Were Here", "The Wall"],
    topTracks: [
      {
        title: "Another Brick in the Wall, Pt. 2",
        album: "The Wall",
        duration: "3:58",
        spotifyId: "4gMgiXfqyzZLMhsksGmbQV",
      },
      {
        title: "Wish You Were Here",
        album: "Wish You Were Here",
        duration: "5:34",
        spotifyId: "6mFkJmJqdDVQ1REhVfGgd1",
      },
      {
        title: "Money",
        album: "The Dark Side of the Moon",
        duration: "6:22",
        spotifyId: "0vFOzaXqZHahrZp6enQwQb",
      },
    ],
  },
  {
    id: "led-zeppelin",
    band: "Led Zeppelin",
    origin: "Londres, Reino Unido",
    years: "1968 - 1980",
    label: "Classic rock",
    mood: "peso, blues e misticismo de arena",
    color: "#8F251F",
    accent: "#E7B75F",
    bio:
      "O Led Zeppelin ajudou a definir a base do hard rock moderno, juntando blues pesado, folk e improviso. A banda é lembrada por riffs enormes e apresentações intensas.",
    topAlbums: ["Led Zeppelin IV", "Physical Graffiti", "Led Zeppelin II"],
    topTracks: [
      {
        title: "Immigrant Song",
        album: "Led Zeppelin III",
        duration: "2:26",
        spotifyId: "78lgmZwycJ3nzsdgmPPGNx",
      },
      {
        title: "Whole Lotta Love",
        album: "Led Zeppelin II",
        duration: "5:33",
        spotifyId: "0hCB0YR03f6AmQaHbwWDe8",
      },
      {
        title: "Black Dog",
        album: "Led Zeppelin IV",
        duration: "4:55",
        spotifyId: "3qT4bUD1MaWpGrTwcvguhb",
      },
    ],
  },
];

function spotifyTrackUrl(track: Track) {
  return `https://open.spotify.com/track/${track.spotifyId}`;
}

function spotifyEmbedUrl(track: Track) {
  return `https://open.spotify.com/embed/track/${track.spotifyId}?utm_source=generator&theme=0`;
}

function SpotifyFrame({ track }: { track: Track }) {
  if (Platform.OS !== "web") {
    return (
      <Pressable
        accessibilityRole="link"
        onPress={() => Linking.openURL(spotifyTrackUrl(track))}
        style={styles.spotifyFallback}
      >
        <ExternalLink size={18} color="#1ED760" />
        <Text style={styles.spotifyFallbackText}>Abrir no Spotify</Text>
      </Pressable>
    );
  }

  return React.createElement("iframe", {
    src: spotifyEmbedUrl(track),
    width: "100%",
    height: "152",
    frameBorder: "0",
    allow:
      "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture",
    loading: "lazy",
    style: {
      border: 0,
      borderRadius: 14,
      display: "block",
      width: "100%",
    },
  });
}

function VinylDisc({
  size,
  accent,
  rotate,
}: {
  size: number;
  accent: string;
  rotate?: Animated.AnimatedInterpolation<string | number>;
}) {
  const discStyle = [
    styles.disc,
    {
      borderRadius: size / 2,
      height: size,
      width: size,
    },
    rotate ? { transform: [{ rotate }] } : null,
  ];

  return (
    <Animated.View style={discStyle}>
      <View style={[styles.discGrooveOuter, { borderColor: accent }]} />
      <View style={styles.discGrooveMiddle} />
      <View style={[styles.discLabel, { backgroundColor: accent }]} />
      <View style={styles.discHole} />
    </Animated.View>
  );
}

function VinylCard({
  record,
  selected,
  compact,
  onPress,
}: {
  record: VinylRecord;
  selected: boolean;
  compact: boolean;
  onPress: () => void;
}) {
  const [hovering, setHovering] = useState(false);
  const hover = useRef(new Animated.Value(selected ? 1 : 0)).current;
  const spin = useRef(new Animated.Value(0)).current;
  const spinLoop = useRef<Animated.CompositeAnimation | null>(null);
  const active = selected || hovering;

  useEffect(() => {
    Animated.spring(hover, {
      toValue: active ? 1 : 0,
      friction: 7,
      tension: 110,
      useNativeDriver: true,
    }).start();

    if (active && !spinLoop.current) {
      spinLoop.current = Animated.loop(
        Animated.timing(spin, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        })
      );
      spinLoop.current.start();
    }

    if (!active && spinLoop.current) {
      spinLoop.current.stop();
      spinLoop.current = null;
      spin.setValue(0);
    }
  }, [active, hover, spin]);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  const translateX = hover.interpolate({
    inputRange: [0, 1],
    outputRange: [compact ? 18 : 22, compact ? 58 : 72],
  });
  const scale = hover.interpolate({
    inputRange: [0, 1],
    outputRange: [0.94, 1],
  });

  return (
    <Pressable
      accessibilityRole="button"
      onHoverIn={() => setHovering(true)}
      onHoverOut={() => setHovering(false)}
      onPress={onPress}
      style={[styles.cardButton, compact && styles.cardButtonCompact]}
    >
      <View style={styles.recordStage}>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.cardDisc,
            compact && styles.cardDiscCompact,
            {
              transform: [{ translateX }, { scale }, { rotate }],
            },
          ]}
        >
          <VinylDisc
            accent={record.accent}
            rotate={rotate}
            size={compact ? 118 : 136}
          />
        </Animated.View>

        <View
          style={[
            styles.cover,
            compact && styles.coverCompact,
            selected && styles.coverSelected,
            { backgroundColor: record.color },
          ]}
        >
          <Text style={styles.coverKicker}>VINYL</Text>
          <Text style={[styles.coverBand, compact && styles.coverBandCompact]}>
            {record.band}
          </Text>
          <View style={styles.coverLines}>
            <View style={[styles.coverLine, { backgroundColor: record.accent }]} />
            <View style={[styles.coverDot, { backgroundColor: record.accent }]} />
            <View style={[styles.coverLine, { backgroundColor: record.accent }]} />
          </View>
          <Text style={styles.coverLabel}>{record.label}</Text>
        </View>
      </View>
    </Pressable>
  );
}

export default function CatalogScreen() {
  const { width } = useWindowDimensions();
  const compact = width < 620;
  const wide = width >= 1000;
  const [selectedId, setSelectedId] = useState(RECORDS[0].id);
  const selectedRecord = useMemo(
    () => RECORDS.find((record) => record.id === selectedId) || RECORDS[0],
    [selectedId]
  );
  const [selectedTrack, setSelectedTrack] = useState(selectedRecord.topTracks[0]);
  const fly = useRef(new Animated.Value(1)).current;
  const platterSpin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setSelectedTrack(selectedRecord.topTracks[0]);
  }, [selectedRecord]);

  useEffect(() => {
    fly.setValue(0);
    Animated.sequence([
      Animated.timing(fly, {
        toValue: 0.72,
        duration: 420,
        useNativeDriver: true,
      }),
      Animated.spring(fly, {
        toValue: 1,
        friction: 6,
        tension: 95,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fly, selectedTrack, selectedRecord]);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(platterSpin, {
        toValue: 1,
        duration: 3200,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [platterSpin]);

  const platterRotate = platterSpin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  const flyRotate = fly.interpolate({
    inputRange: [0, 1],
    outputRange: ["-35deg", "720deg"],
  });
  const flyTranslateX = fly.interpolate({
    inputRange: [0, 1],
    outputRange: [compact ? -92 : -170, 0],
  });
  const flyTranslateY = fly.interpolate({
    inputRange: [0, 1],
    outputRange: [compact ? -52 : -70, 0],
  });
  const flyScale = fly.interpolate({
    inputRange: [0, 1],
    outputRange: [0.52, 1],
  });

  function selectRecord(record: VinylRecord) {
    setSelectedId(record.id);
  }

  function selectTrack(track: Track) {
    setSelectedTrack(track);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.topbar}>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ArrowLeft size={20} color="#FFF4E2" />
            <Text style={styles.backText}>Voltar</Text>
          </Pressable>
          <View style={styles.topbarBadge}>
            <Disc3 size={17} color="#FFCF57" />
            <Text style={styles.topbarText}>Riff Records Catalog</Text>
          </View>
        </View>

        <View style={styles.hero}>
          <View style={styles.heroCopy}>
            <Text style={styles.eyebrow}>Estante interativa</Text>
            <Text style={[styles.title, compact && styles.titleCompact]}>
              Catálogo de vinis de rock
            </Text>
            <Text style={styles.subtitle}>
              Passe o mouse nas capas para puxar o disco. Clique em um vinil para
              abrir a biografia da banda, álbuns importantes e faixas no Spotify.
            </Text>
          </View>

          <View style={styles.heroStats}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{RECORDS.length}</Text>
              <Text style={styles.statLabel}>bandas</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>18</Text>
              <Text style={styles.statLabel}>faixas</Text>
            </View>
          </View>
        </View>

        <View
          nativeID="catalog-layout"
          style={[styles.contentGrid, wide && styles.contentGridWide]}
        >
          <View nativeID="catalog-shelf-section" style={styles.shelfSection}>
            <Text style={styles.sectionTitle}>Estante de vinis</Text>
            <View style={styles.shelf}>
              {RECORDS.map((record) => (
                <VinylCard
                  compact={compact}
                  key={record.id}
                  onPress={() => selectRecord(record)}
                  record={record}
                  selected={record.id === selectedRecord.id}
                />
              ))}
            </View>
          </View>

          <View
            nativeID="catalog-detail-column"
            style={[styles.detailColumn, wide && styles.detailColumnWide]}
          >
            <View style={styles.bandPanel}>
              <View style={styles.bandHeader}>
                <View>
                  <Text style={styles.bandKicker}>{selectedRecord.label}</Text>
                  <Text style={styles.bandTitle}>{selectedRecord.band}</Text>
                </View>
                <View
                  style={[
                    styles.bandSignal,
                    { backgroundColor: selectedRecord.color },
                  ]}
                >
                  <Star size={19} color={selectedRecord.accent} fill={selectedRecord.accent} />
                </View>
              </View>

              <Text style={styles.bandMeta}>
                {selectedRecord.origin} • {selectedRecord.years}
              </Text>
              <Text style={styles.bandBio}>{selectedRecord.bio}</Text>
              <Text style={styles.bandMood}>{selectedRecord.mood}</Text>

              <Text style={styles.blockTitle}>Top álbuns</Text>
              <View style={styles.albumList}>
                {selectedRecord.topAlbums.map((album, index) => (
                  <View key={album} style={styles.albumPill}>
                    <Text style={styles.albumIndex}>{index + 1}</Text>
                    <Text style={styles.albumText}>{album}</Text>
                  </View>
                ))}
              </View>

              <Text style={styles.blockTitle}>Top músicas</Text>
              <View style={styles.trackList}>
                {selectedRecord.topTracks.map((track, index) => {
                  const active = track.spotifyId === selectedTrack.spotifyId;
                  return (
                    <Pressable
                      accessibilityRole="button"
                      key={track.spotifyId}
                      onPress={() => selectTrack(track)}
                      style={[styles.trackRow, active && styles.trackRowActive]}
                    >
                      <View style={styles.trackIndex}>
                        {active ? (
                          <Play size={14} color="#17110F" fill="#17110F" />
                        ) : (
                          <Text style={styles.trackIndexText}>{index + 1}</Text>
                        )}
                      </View>
                      <View style={styles.trackTextGroup}>
                        <Text style={styles.trackTitle}>{track.title}</Text>
                        <Text style={styles.trackAlbum}>
                          {track.album} • {track.duration}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.turntablePanel}>
              <View style={styles.turntableHeader}>
                <View>
                  <Text style={styles.playerKicker}>Toca-discos</Text>
                  <Text style={styles.playerTitle}>{selectedTrack.title}</Text>
                </View>
                <Headphones size={24} color="#FFCF57" />
              </View>

              <View style={styles.turntableStage}>
                <View style={styles.turntableBase}>
                  <Animated.View
                    style={[
                      styles.platter,
                      {
                        transform: [{ rotate: platterRotate }],
                      },
                    ]}
                  />
                  <Animated.View
                    style={[
                      styles.flyingRecord,
                      {
                        transform: [
                          { translateX: flyTranslateX },
                          { translateY: flyTranslateY },
                          { scale: flyScale },
                          { rotate: flyRotate },
                        ],
                      },
                    ]}
                  >
                    <VinylDisc
                      accent={selectedRecord.accent}
                      rotate={platterRotate}
                      size={compact ? 154 : 188}
                    />
                  </Animated.View>
                  <View style={styles.tonearm}>
                    <View style={styles.tonearmHead} />
                  </View>
                </View>
              </View>

              <View style={styles.spotifyBox}>
                <View style={styles.spotifyHeader}>
                  <Music2 size={18} color="#1ED760" />
                  <Text style={styles.spotifyTitle}>Ouvir pelo Spotify</Text>
                </View>
                <SpotifyFrame track={selectedTrack} />
                <Pressable
                  accessibilityRole="link"
                  onPress={() => Linking.openURL(spotifyTrackUrl(selectedTrack))}
                  style={styles.spotifyLink}
                >
                  <Text style={styles.spotifyLinkText}>Abrir música no Spotify</Text>
                  <ExternalLink size={15} color="#1ED760" />
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const cardShadow = Platform.select({
  web: {
    boxShadow: "0 20px 36px rgba(0, 0, 0, 0.2)",
  },
  default: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.22,
    shadowRadius: 26,
    elevation: 7,
  },
});

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#0F0D0B",
    flex: 1,
  },
  page: {
    gap: 26,
    padding: 20,
    paddingBottom: 34,
  },
  topbar: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
  },
  backButton: {
    alignItems: "center",
    backgroundColor: "#201714",
    borderColor: "#49332C",
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    minHeight: 44,
    paddingHorizontal: 14,
  },
  backText: {
    color: "#FFF4E2",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 0,
  },
  topbarBadge: {
    alignItems: "center",
    backgroundColor: "#201714",
    borderColor: "#49332C",
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    minHeight: 44,
    paddingHorizontal: 14,
  },
  topbarText: {
    color: "#FFCF57",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0,
    textTransform: "uppercase",
  },
  hero: {
    backgroundColor: "#17110F",
    borderColor: "#49332C",
    borderRadius: 28,
    borderWidth: 1,
    flexDirection: "row",
    gap: 18,
    justifyContent: "space-between",
    overflow: "hidden",
    padding: 24,
    ...cardShadow,
  },
  heroCopy: {
    flex: 1,
    maxWidth: 760,
  },
  eyebrow: {
    color: "#FFCF57",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0,
    marginBottom: 12,
    textTransform: "uppercase",
  },
  title: {
    color: "#FFF4E2",
    fontSize: 46,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 52,
  },
  titleCompact: {
    fontSize: 34,
    lineHeight: 40,
  },
  subtitle: {
    color: "#D8C6B7",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0,
    lineHeight: 24,
    marginTop: 14,
  },
  heroStats: {
    alignSelf: "stretch",
    gap: 12,
    justifyContent: "center",
    minWidth: 118,
  },
  statBox: {
    backgroundColor: "#241916",
    borderColor: "#49332C",
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
  },
  statNumber: {
    color: "#FFCF57",
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 0,
  },
  statLabel: {
    color: "#D8C6B7",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0,
    textTransform: "uppercase",
  },
  contentGrid: {
    gap: 22,
  },
  contentGridWide: {
    alignItems: "flex-start",
    flexDirection: "row",
  },
  shelfSection: {
    flex: 1,
    gap: 14,
    minWidth: 0,
  },
  sectionTitle: {
    color: "#FFF4E2",
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 0,
  },
  shelf: {
    backgroundColor: "#241916",
    borderColor: "#49332C",
    borderRadius: 26,
    borderWidth: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    padding: 18,
  },
  cardButton: {
    flexBasis: 170,
    flexGrow: 1,
    maxWidth: 230,
    minWidth: 164,
  },
  cardButtonCompact: {
    flexBasis: 142,
    maxWidth: 190,
    minWidth: 138,
  },
  recordStage: {
    height: 220,
    justifyContent: "flex-end",
    position: "relative",
  },
  cardDisc: {
    bottom: 32,
    position: "absolute",
    right: 2,
    zIndex: 0,
  },
  cardDiscCompact: {
    bottom: 42,
  },
  cover: {
    borderColor: "#F7D8A1",
    borderRadius: 12,
    borderWidth: 2,
    gap: 10,
    height: 190,
    justifyContent: "space-between",
    overflow: "hidden",
    padding: 16,
    position: "relative",
    zIndex: 1,
    ...cardShadow,
  },
  coverCompact: {
    height: 170,
    padding: 14,
  },
  coverSelected: {
    borderColor: "#FFCF57",
  },
  coverKicker: {
    color: "#FFF4E2",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0,
  },
  coverBand: {
    color: "#FFF4E2",
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 32,
    textTransform: "uppercase",
  },
  coverBandCompact: {
    fontSize: 22,
    lineHeight: 27,
  },
  coverLines: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
  },
  coverLine: {
    height: 3,
    flex: 1,
  },
  coverDot: {
    borderRadius: 999,
    height: 8,
    width: 8,
  },
  coverLabel: {
    color: "#FFF4E2",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0,
    textTransform: "uppercase",
  },
  disc: {
    alignItems: "center",
    backgroundColor: "#0B0908",
    borderColor: "#241916",
    borderWidth: 12,
    justifyContent: "center",
    overflow: "hidden",
  },
  discGrooveOuter: {
    borderRadius: 999,
    borderWidth: 3,
    height: "72%",
    opacity: 0.85,
    position: "absolute",
    width: "72%",
  },
  discGrooveMiddle: {
    borderColor: "#2D2520",
    borderRadius: 999,
    borderWidth: 2,
    height: "48%",
    position: "absolute",
    width: "48%",
  },
  discLabel: {
    alignItems: "center",
    borderRadius: 999,
    height: "28%",
    justifyContent: "center",
    width: "28%",
  },
  discHole: {
    backgroundColor: "#0B0908",
    borderRadius: 999,
    height: "10%",
    position: "absolute",
    width: "10%",
  },
  detailColumn: {
    gap: 18,
    minWidth: 0,
    width: "100%",
  },
  detailColumnWide: {
    maxWidth: 470,
    width: 470,
  },
  bandPanel: {
    backgroundColor: "#F6EFE3",
    borderColor: "#D7C4AE",
    borderRadius: 26,
    borderWidth: 1,
    gap: 14,
    padding: 20,
    ...cardShadow,
  },
  bandHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 14,
    justifyContent: "space-between",
  },
  bandKicker: {
    color: "#B91F1A",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0,
    textTransform: "uppercase",
  },
  bandTitle: {
    color: "#17110F",
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 38,
  },
  bandSignal: {
    alignItems: "center",
    borderRadius: 18,
    height: 52,
    justifyContent: "center",
    width: 52,
  },
  bandMeta: {
    color: "#7A6258",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0,
  },
  bandBio: {
    color: "#35241F",
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0,
    lineHeight: 23,
  },
  bandMood: {
    backgroundColor: "#FFF3D6",
    borderColor: "#E3C675",
    borderRadius: 16,
    borderWidth: 1,
    color: "#6E4B12",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0,
    lineHeight: 21,
    padding: 13,
  },
  blockTitle: {
    color: "#17110F",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 0,
    marginTop: 4,
  },
  albumList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
  },
  albumPill: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#D7C4AE",
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  albumIndex: {
    color: "#B91F1A",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0,
  },
  albumText: {
    color: "#35241F",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0,
  },
  trackList: {
    gap: 8,
  },
  trackRow: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#D7C4AE",
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    minHeight: 62,
    padding: 12,
  },
  trackRowActive: {
    backgroundColor: "#FFE8B5",
    borderColor: "#D7A83C",
  },
  trackIndex: {
    alignItems: "center",
    backgroundColor: "#FFCF57",
    borderRadius: 999,
    height: 30,
    justifyContent: "center",
    width: 30,
  },
  trackIndexText: {
    color: "#17110F",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0,
  },
  trackTextGroup: {
    flex: 1,
    minWidth: 0,
  },
  trackTitle: {
    color: "#17110F",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0,
  },
  trackAlbum: {
    color: "#7A6258",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0,
    marginTop: 3,
  },
  turntablePanel: {
    backgroundColor: "#17110F",
    borderColor: "#49332C",
    borderRadius: 26,
    borderWidth: 1,
    gap: 18,
    padding: 20,
    ...cardShadow,
  },
  turntableHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  playerKicker: {
    color: "#FFCF57",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0,
    textTransform: "uppercase",
  },
  playerTitle: {
    color: "#FFF4E2",
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 28,
  },
  turntableStage: {
    alignItems: "center",
  },
  turntableBase: {
    alignItems: "center",
    backgroundColor: "#2B1D19",
    borderColor: "#6E4B3A",
    borderRadius: 28,
    borderWidth: 1,
    height: 260,
    justifyContent: "center",
    maxWidth: 420,
    overflow: "hidden",
    position: "relative",
    width: "100%",
  },
  platter: {
    backgroundColor: "#070606",
    borderColor: "#42332D",
    borderRadius: 999,
    borderWidth: 15,
    height: 218,
    position: "absolute",
    width: 218,
  },
  flyingRecord: {
    alignItems: "center",
    justifyContent: "center",
  },
  tonearm: {
    backgroundColor: "#D8C6B7",
    borderRadius: 999,
    height: 114,
    position: "absolute",
    right: 54,
    top: 34,
    transform: [{ rotate: "32deg" }],
    width: 8,
  },
  tonearmHead: {
    backgroundColor: "#FFCF57",
    borderRadius: 7,
    bottom: -6,
    height: 18,
    left: -5,
    position: "absolute",
    width: 18,
  },
  spotifyBox: {
    backgroundColor: "#0B0908",
    borderColor: "#30231F",
    borderRadius: 18,
    borderWidth: 1,
    gap: 12,
    padding: 12,
  },
  spotifyHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  spotifyTitle: {
    color: "#FFF4E2",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 0,
  },
  spotifyFallback: {
    alignItems: "center",
    backgroundColor: "#102016",
    borderColor: "#1ED760",
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    minHeight: 58,
  },
  spotifyFallbackText: {
    color: "#1ED760",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 0,
  },
  spotifyLink: {
    alignItems: "center",
    flexDirection: "row",
    gap: 7,
    justifyContent: "center",
    paddingVertical: 2,
  },
  spotifyLinkText: {
    color: "#1ED760",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0,
  },
});
