import { Audio } from 'expo-av'
import { SetStateAction, useEffect, useRef, useState } from 'react'
import { View, Text } from 'react-native'
import { IconButton } from 'react-native-paper'
import { API_URL, deleteAudioMoovyAPI } from '../../utils/api'
import { DialogConfirmDelete } from '../DialogConfirmDelete'
import { formatTimer } from '../RecordAudio'
import { styles } from './styles'

interface Props {
  title: string
  imdbID: string
  setAudioExists: React.Dispatch<SetStateAction<boolean>>
}
export function PlayAudio({ title, imdbID, setAudioExists }: Props) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [duration, setDuration] = useState(0)
  const playbackObject = useRef<Audio.Sound>()

  async function onLoad() {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
    })

    const { sound } = await Audio.Sound.createAsync({
      uri: `${API_URL}/audios/${imdbID}`,
    })
    playbackObject.current = sound
    playbackObject.current.setOnPlaybackStatusUpdate((playbackStatus) => {
      if (playbackStatus.isLoaded && playbackStatus.didJustFinish) {
        setIsPlaying(false)
      }
    })
    const status = await playbackObject.current.getStatusAsync()
    const seconds =
      status.isLoaded && status.durationMillis
        ? Math.round(status.durationMillis / 1000)
        : 0
    setDuration(seconds)
  }

  async function playAudio() {
    try {
      if (playbackObject.current) {
        setIsPlaying(true)
        playbackObject.current.replayAsync()
      }
    } catch (err) {
      console.error('Failed to play audio', err)
    }
  }

  function stopAudio() {
    setIsPlaying(false)
    playbackObject.current?.stopAsync()
  }

  async function deleteAudio() {
    const wasDeleted = await deleteAudioMoovyAPI(imdbID)
    if (wasDeleted) setAudioExists(false)
  }

  useEffect(() => {
    onLoad()
  }, [])
  return (
    <View style={styles.view}>
      <DialogConfirmDelete
        title={title}
        deleteAudio={deleteAudio}
        visible={openDialog}
        setVisible={setOpenDialog}
      />
      <View style={styles.deleteButton}>
        {/* @ts-ignore */}
        <IconButton
          size={28}
          color="#FE6D8E"
          icon="delete"
          onPress={() => setOpenDialog(true)}
        />
      </View>
      {isPlaying ? (
        // @ts-ignore
        <IconButton
          size={36}
          style={styles.iconButton}
          icon="stop"
          onPress={stopAudio}
        />
      ) : (
        // @ts-ignore
        <IconButton
          size={36}
          style={styles.iconButton}
          icon="play"
          onPress={playAudio}
        />
      )}
      {/* @ts-ignore */}
      <Text style={styles.duration}>{formatTimer(duration)}</Text>
    </View>
  )
}
