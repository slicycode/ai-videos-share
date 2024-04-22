import { View, ActivityIndicator, Dimensions, Platform } from 'react-native'

const Loader = ({ isLoading }: { isLoading: boolean }) => {
  const osName = Platform.OS
  const screenHeight = Dimensions.get('screen').height

  if (!isLoading) return null

  return (
    <View
      className="absolute z-10 flex items-center justify-center w-full h-full bg-primary/60"
      style={{
        height: screenHeight,
      }}
    >
      <ActivityIndicator
        animating={isLoading}
        color="#fff"
        size={osName === 'ios' ? 'large' : 50}
      />
    </View>
  )
}

export default Loader
