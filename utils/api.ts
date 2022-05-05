import axios, { AxiosResponse } from 'axios'

export interface MoovyAPI {
  id: number
  imdbID: string
  title: string
  imdbRating: string
  imageSrc: string
  audioSrc?: string
  deleted: boolean
  createdAt: Date
  updatedAt: Date
}

// const API_URL = 'http://192.168.1.104:3000'
export const API_URL = 'https://moovy-back-46sfh.ondigitalocean.app'

export async function getMoovyAPI(imdbID: string) {
  try {
    const { data } = await axios.get<MoovyAPI>(`${API_URL}/movie/${imdbID}`)
    return data
  } catch {
    return null
  }
}

export async function getAllMoovyAPI() {
  try {
    const { data } = await axios.get<MoovyAPI[]>(`${API_URL}/movies`)
    const onlyNotDeleted = data.filter((data) => {
      return !data.deleted
    })
    return onlyNotDeleted
  } catch {
    console.log('error connecting to API')
    return null
  }
}

export async function deleteAudioMoovyAPI(imdbID: string) {
  try {
    const { data } = await axios.delete(`${API_URL}/audios/${imdbID}`)

    return data.audioSrc === null ? true : false
  } catch {
    return false
  }
}
