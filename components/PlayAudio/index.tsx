import { Audio } from 'expo-av'
import { SetStateAction, useEffect, useRef, useState } from 'react'
import { View } from 'react-native'
import { IconButton } from 'react-native-paper'
import { deleteAudioMoovyAPI } from '../../utils/api'
import { DialogConfirmDelete } from '../DialogConfirmDelete'
import { styles } from './styles'

interface Props {
  title: string
  imdbID: string
  setAudioExists: React.Dispatch<SetStateAction<boolean>>
}
export function PlayAudio({ title, imdbID, setAudioExists }: Props) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const playbackObject = useRef<Audio.Sound>()

  function onLoad() {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
    })
  }

  async function playAudio() {
    try {
      setIsPlaying(true)
      if (playbackObject.current) {
        playbackObject.current.replayAsync()
        return
      }
      const { sound } = await Audio.Sound.createAsync(
        { uri: `http://192.168.1.104:3000/audios/${imdbID}` },
        { shouldPlay: true }
      )
      playbackObject.current = sound
      playbackObject.current.setOnPlaybackStatusUpdate((playbackStatus) => {
        if (playbackStatus.isLoaded && playbackStatus.didJustFinish) {
          setIsPlaying(false)
        }
      })
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

  useEffect(() => onLoad, [])
  return (
    <View style={styles.view}>
      <DialogConfirmDelete
        title={title}
        deleteAudio={deleteAudio}
        visible={openDialog}
        setVisible={setOpenDialog}
      />
      {/* @ts-ignore */}
      <IconButton
        size={36}
        style={styles.deleteButton}
        color="#FE6D8E"
        icon="delete"
        onPress={() => setOpenDialog(true)}
      />
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
    </View>
  )
}
