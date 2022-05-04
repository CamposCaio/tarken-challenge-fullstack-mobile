import * as React from 'react'
import { View, Text } from 'react-native'
import { Button } from 'react-native-paper'
import { styles } from './styles'

interface Props {
  refresh: () => void
}

export function EmptyLibrary({ refresh }: Props) {
  return (
    <View style={styles.view}>
      <Text style={styles.text}>
        It looks like there are no movies in your library! Go to your web
        application and add some!
      </Text>
      {/* @ts-ignore */}
      <Button style={styles.button} icon="refresh" onPress={refresh}>
        Refresh
      </Button>
    </View>
  )
}
