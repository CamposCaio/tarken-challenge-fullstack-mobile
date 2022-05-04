import { useState } from 'react'
import { StyleSheet, Image, View } from 'react-native'
import { Text, Surface, Paragraph, Button, Snackbar } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Audio } from 'expo-av'
import { Sound } from 'expo-av/build/Audio'
import { MoovyAPI } from '../utils/api'

interface Recording {
  sound: Sound
  file?: string | null
}

interface Props {
  navigation: any
  movie: MoovyAPI
}

export function MovieCard({ navigation, movie }: Props) {
  const [recording, setRecording] = useState<Audio.Recording>()
  const [recordings, setRecordings] = useState<Recording[]>([])
  const [messageAudio, setMessageAudio] = useState('')
  const [recordingTimer, setRecordingTimer] = useState<number>()
  const [recordingTimerInterval, setRecordingTimerInterval] =
    useState<NodeJS.Timeout>()

  async function startRecording() {
    try {
      const permission = await Audio.requestPermissionsAsync()

      if (permission.status === 'granted') {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        })

        setRecordingTimer(0)

        setRecordingTimerInterval(
          setInterval(() => {
            setRecordingTimer((timer) => (timer ? timer + 1 : 1))
          }, 1000)
        )

        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        )

        setRecording(recording)
      } else {
        setMessageAudio('Please grant permission to app to access microphone')
      }
    } catch (err) {
      console.error('Failed to start recording', err)
    }
  }

  async function stopRecording() {
    if (!recording) return
    recordingTimerInterval && clearInterval(recordingTimerInterval)
    setRecording(undefined)
    await recording.stopAndUnloadAsync()

    let updateRecordings = [...recordings]
    const { sound, status } = await recording.createNewLoadedSoundAsync()
    updateRecordings.push({
      sound: sound,
      file: recording?.getURI(),
    })

    setRecordings(updateRecordings)
  }

  function getRecordingLines() {
    return recordings.map((recordingLine, index) => {
      return (
        <View key={index}>
          <Text>Recording {index + 1}</Text>
          <Button
            onPress={() => recordingLine.sound.replayAsync()}
            title="Play"
          >
            Play
          </Button>
        </View>
      )
    })
  }

  return (
    <View style={styles.cardView}>
      <Surface style={styles.surface}>
        <Image
          style={styles.movieImage}
          source={{
            uri: movie.imageSrc,
          }}
        />
      </Surface>
      {/* {getRecordingLines()} */}
      <Text style={styles.movieTitle}>{movie.title}</Text>
      <Paragraph style={styles.movieParagraph}>
        <Icon name="star" size={16} color={'#FCC419'} />
        <Text>{movie.imdbRating}</Text>
      </Paragraph>
      {/* <Text>{recordingTimer}</Text> */}
      <Button
        mode="contained"
        icon="microphone"
        onPress={recording ? stopRecording : startRecording}
      >
        {recording ? 'Finish' : 'Record a review'}
      </Button>
      <Snackbar
        visible={messageAudio ? true : false}
        onDismiss={() => setMessageAudio('')}
      >
        {messageAudio}
      </Snackbar>
    </View>
  )
}

const styles = StyleSheet.create({
  cardView: {
    alignItems: 'center',
    height: '100%',
    width: '100%',
    paddingVertical: 24,
    justifyContent: 'space-between',
  },
  surface: {
    elevation: 4,
    height: '70%',
    width: '80%',
    borderRadius: 24,
    overflow: 'hidden',
  },
  movieImage: {
    height: '100%',
    width: '100%',
  },
  movieTitle: {
    fontSize: 24,
  },
  movieParagraph: {},
})
