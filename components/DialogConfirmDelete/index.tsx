import { SetStateAction } from 'react'
import { Text } from 'react-native'
import { Button, Dialog, Portal } from 'react-native-paper'

interface Props {
  title: string
  deleteAudio: () => void
  visible: boolean
  setVisible: React.Dispatch<SetStateAction<boolean>>
}
export function DialogConfirmDelete({
  title,
  deleteAudio,
  visible,
  setVisible,
}: Props) {
  const hideDialog = () => setVisible(false)

  function handleDelete() {
    setVisible(false)
    deleteAudio()
  }

  return (
    // @ts-ignore
    <Portal>
      {/* @ts-ignore */}
      <Dialog visible={visible} onDismiss={hideDialog}>
        <Dialog.Content>
          <Text>Are you sure you want to delete {title} audio review?</Text>
        </Dialog.Content>
        <Dialog.Actions>
          {/* @ts-ignore */}
          <Button onPress={hideDialog}>Cancel</Button>
          {/* @ts-ignore */}
          <Button onPress={handleDelete}>Delete</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}
