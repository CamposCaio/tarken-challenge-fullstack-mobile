import { Audio } from 'expo-av'
import { useState } from 'react'
import { Text, View } from 'react-native'
import { Button, Snackbar } from 'react-native-paper'
import { styles } from './styles'

function formatTimer(timerSeconds: number) {
  let seconds = timerSeconds % 60
  let minutes = Math.floor(timerSeconds / 60)
  return `${('0' + minutes).slice(-2)}:${('0' + seconds).slice(-2)}`
}

export function RecordAudio() {
  const [recording, setRecording] = useState<Audio.Recording>()
  const [alert, setAlert] = useState('')
  const [recordingTimer, setRecordingTimer] = useState<number>(0)
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
        setAlert('Please grant permission to app to access microphone')
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

    // Save recording
    const { sound, status } = await recording.createNewLoadedSoundAsync()
    // updateRecordings.push({
    //   sound: sound,
    //   file: recording?.getURI(),
    // })
  }

  return (
    <View style={styles.view}>
      {/* @ts-ignore */}
      {recording && (
        <Text style={styles.timer}>{formatTimer(recordingTimer)}</Text>
      )}
      {/* @ts-ignore */}
      <Button
        mode="contained"
        icon="microphone"
        onPress={recording ? stopRecording : startRecording}
      >
        {recording ? 'Finish' : 'Record a review'}
      </Button>
      {/* @ts-ignore */}
      <Snackbar visible={alert ? true : false} onDismiss={() => setAlert('')}>
        {alert}
      </Snackbar>
    </View>
  )
}
