import * as React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { Button } from 'react-native-paper'

interface Props {
  refresh: () => void
}

export function EmptyLibrary({ refresh }: Props) {
  return (
    <View style={styles.view}>
      <Text style={styles.text}>
        It looks like there are no movies in your library! Go to you web
        application and add some!
      </Text>
      <Button style={styles.button} icon="refresh" onPress={refresh}>
        Refresh
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  view: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  text: {
    maxWidth: '60%',
    fontSize: 20,
    textAlign: 'center',
  },
  button: {
    marginTop: 24,
  },
})
