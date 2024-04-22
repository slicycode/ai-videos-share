import { FlatList, Image, RefreshControl, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useState } from 'react'
import EmptyState from '../../components/EmptyState'
import SearchInput from '../../components/SearchInput'
import Trending from '../../components/Trending'
import { images } from '../../constants'
import { getAllPosts, getLatestPosts } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '../../components/VideoCard'
import { Post } from '../../types'
import { useGlobalContext } from '../../context/GlobalProvider'

const Home = () => {
  const { data: posts, refetch } = useAppwrite(getAllPosts)
  const { user }: any = useGlobalContext()
  const { data: latestPosts } = useAppwrite(getLatestPosts)
  const postsArray = posts as Array<any>

  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }

  return (
    <SafeAreaView className="bg-primary">
      <FlatList
        data={postsArray ?? []}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }: { item: Post }) => (
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
                  Welcome back,
                </Text>
                <Text className="text-2xl text-white font-psemibold">
                  {user?.username}
                </Text>
              </View>

              <View className="mt-1.5">
                <Image
                  source={images.logoSmall}
                  className="h-10 w-9"
                  resizeMode="contain"
                />
              </View>
            </View>

            <SearchInput />

            <View className="flex-1 w-full pt-5 pb-8">
              <Text className="mb-3 text-lg text-gray-100 font-pregular">
                Latest Videos
              </Text>

              <Trending posts={latestPosts ?? []} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No videos created yet"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  )
}

export default Home
