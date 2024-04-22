import { ResizeMode, Video } from 'expo-av'
import { useState } from 'react'
import {
  FlatList,
  Image,
  ImageBackground,
  TouchableOpacity,
} from 'react-native'
import * as Animatable from 'react-native-animatable'

import { icons } from '../constants'
import { Post } from '../types'

const zoomIn = {
  0: {
    scale: 0.9,
  },
  1: {
    scale: 1,
  },
}

const zoomOut = {
  0: {
    scale: 1,
  },
  1: {
    scale: 0.9,
  },
}

const TrendingItem = ({
  activeItem,
  item,
}: {
  activeItem: Post
  item: any
}) => {
  const [play, setPlay] = useState(false)

  return (
    <Animatable.View
      className="mr-5"
      animation={activeItem === item.$id ? zoomIn : (zoomOut as any)}
      duration={500}
    >
      {play ? (
        <Video
          source={{ uri: item.video }}
          className="w-52 h-72 rounded-[33px] mt-3 bg-white/10"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if (status.isLoaded && status.didJustFinish) {
              setPlay(false)
            }
          }}
        />
      ) : (
        <TouchableOpacity
          className="relative flex items-center justify-center"
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
        >
          <ImageBackground
            source={{
              uri: item.thumbnail,
            }}
            className="w-52 h-72 rounded-[33px] my-5 overflow-hidden shadow-lg shadow-black/40"
            resizeMode="cover"
          />

          <Image
            source={icons.play}
            className="absolute w-12 h-12"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  )
}

const Trending = ({ posts }: { posts: Array<Post> }) => {
  const [activeItem, setActiveItem] = useState(posts[0])

  const viewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: Array<any>
  }) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key)
    }
  }

  return (
    <FlatList
      data={posts}
      horizontal
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <TrendingItem activeItem={activeItem} item={item} />
      )}
      onViewableItemsChanged={viewableItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 70,
      }}
      contentOffset={{ x: 170, y: 0 }}
    />
  )
}

export default Trending
