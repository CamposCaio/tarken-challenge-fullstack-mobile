import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  view: {
    alignItems: 'center',
    height: '100%',
    width: '100%',
    paddingVertical: 24,
  },
  surface: {
    elevation: 4,
    height: '70%',
    width: '80%',
    borderRadius: 24,
    overflow: 'hidden',
  },
  image: {
    height: '100%',
    width: '100%',
  },
  title: {
    fontSize: 24,
    marginTop: 24,
    marginBottom: 12,
  },
  rating: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 'auto',
  },
  icon: {
    fontSize: 20,
    color: '#FCC419',
  },
  text: {
    fontSize: 18,
    paddingLeft: 4,
  },
})
