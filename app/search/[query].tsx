import { useLocalSearchParams } from 'expo-router'
import { useEffect } from 'react'
import { FlatList, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { EmptyState, SearchInput, VideoCard } from '../../components'
import { searchPosts } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import { Post } from '../../types'

const Search = () => {
  const { query } = useLocalSearchParams()
  const { data: posts, refetch } = useAppwrite(() =>
    searchPosts(query as string)
  )

  useEffect(() => {
    refetch()
  }, [query])

  return (
    <SafeAreaView className="h-full bg-primary">
      <FlatList
        data={posts as Post[]}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard
            title={item.title}
            thumbnail={item.thumbnail}
            video={item.video}
            creator={{
              username: item.creator.username,
              avatar: item.creator.avatar,
            }}
            $id={item.$id}
          />
        )}
        ListHeaderComponent={() => (
          <View className="flex px-4 my-6 space-y-6">
            <View className="flex flex-row items-start justify-between mb-6">
              <View>
                <Text className="text-sm text-gray-100 font-pmedium">
                  Search Results
                </Text>
                <Text className="text-2xl text-white font-psemibold">
                  {query}
                </Text>
              </View>
            </View>
            <SearchInput initialQuery={query as string} />
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No videos found for this search query"
          />
        )}
      />
    </SafeAreaView>
  )
}

export default Search
