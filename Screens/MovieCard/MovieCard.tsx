import { Image, View } from 'react-native'
import { Text, Surface } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { MoovyAPI } from '../../utils/api'
import { styles } from './styles'
import { RecordAudio } from '../../components/RecordAudio'

interface Props {
  movie: MoovyAPI
}

export function MovieCard({ movie }: Props) {
  return (
    <View style={styles.view}>
      {/* @ts-ignore */}
      <Surface style={styles.surface}>
        <Image
          style={styles.image}
          source={{
            uri: movie.imageSrc,
          }}
        />
      </Surface>
      {/* @ts-ignore */}
      <Text style={styles.title}>{movie.title}</Text>
      <View style={styles.rating}>
        <Icon name="star" style={styles.icon} />
        {/* @ts-ignore */}
        <Text style={styles.text}>{movie.imdbRating}</Text>
      </View>
      <RecordAudio />
    </View>
  )
}
