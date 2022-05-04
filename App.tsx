import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { useEffect, useState } from 'react'
import { getAllMoovyAPI, MoovyAPI } from './utils/api'
import { EmptyLibrary } from './Screens/EmptyLibrary/EmptyLibrary'
import { StyleSheet } from 'react-native'
import { MovieCard } from './Screens/MovieCard/MovieCard'

const Tab = createMaterialTopTabNavigator()

function sliceTitle(title: string) {
  return title.length < 33 ? title : `${title.slice(0, 30)}...`
}

export default function App() {
  const [movies, setMovies] = useState<MoovyAPI[]>([])

  function loadMovies() {
    getAllMoovyAPI().then((movies) => {
      movies && setMovies(movies)
    })
  }

  useEffect(() => loadMovies, [])

  return (
    <PaperProvider theme={theme}>
      {movies[0] ? (
        <NavigationContainer>
          {/* @ts-ignore */}
          <Tab.Navigator
            style={styles.navigator}
            screenOptions={{
              tabBarScrollEnabled: true,
              tabBarIndicatorStyle: {
                backgroundColor: '#FE6D8E',
              },
            }}
          >
            {movies.map((movie) => (
              <Tab.Screen
                key={movie.imdbID}
                name={movie.imdbID}
                options={{
                  tabBarLabel: sliceTitle(movie.title),
                }}
                children={(props) => <MovieCard {...props} movie={movie} />}
              />
            ))}
          </Tab.Navigator>
        </NavigationContainer>
      ) : (
        <EmptyLibrary refresh={loadMovies} />
      )}
    </PaperProvider>
  )
}

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#FE6D8E',
  },
}

const styles = StyleSheet.create({
  navigator: {
    marginTop: 24,
  },
})
