import { router, usePathname } from 'expo-router'
import { useState } from 'react'
import { Alert, Image, TextInput, TouchableOpacity, View } from 'react-native'

import { icons } from '../constants'

const SearchInput = ({ initialQuery }: { initialQuery?: string }) => {
  const pathname = usePathname()
  const [query, setQuery] = useState(initialQuery || '')

  return (
    <View className="flex flex-row items-center w-full h-16 px-4 space-x-4 border-2 bg-black-100 rounded-2xl border-black-200 focus:border-secondary">
      <TextInput
        className="text-base mt-0.5 text-white flex-1 font-pregular"
        value={query}
        placeholder="Search a video topic"
        placeholderTextColor="#CDCDE0"
        onChangeText={(e) => setQuery(e)}
      />

      <TouchableOpacity
        onPress={() => {
          if (query === '')
            return Alert.alert(
              'Missing Query',
              'Please input something to search results across database'
            )

          if (pathname.startsWith('/search')) router.setParams({ query })
          else router.push(`/search/${query}`)
        }}
      >
        <Image source={icons.search} className="w-5 h-5" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  )
}

export default SearchInput
