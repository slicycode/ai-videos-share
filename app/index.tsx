import { Redirect, router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { Image, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '../components/CustomButton'
import { images } from '../constants'
import { useGlobalContext } from '../context/GlobalProvider'

export default function App() {
  const { loading, isLogged } = useGlobalContext()

  if (!loading && isLogged) return <Redirect href="/home" />

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <View className="w-full justify-center items-center min-h-[85vh] px-4">
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[130px] h-[84px]"
          />
          <Image
            source={images.cards}
            resizeMode="contain"
            className="max-w-[380px] w-full h-[300px]"
          />
          <View className="relative mt-5">
            <Text className="text-3xl text-white font-bold text-center">
              Discorver Endless Possibilities with{' '}
              <Text className="text-secondary-200">Aora</Text>
            </Text>

            <Image
              source={images.path}
              resizeMode="contain"
              className="absolute -bottom-2 -right-8 w-[136px] h-[15px]"
            />
          </View>

          <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">
            Where creativity meets innovations: embark on a journey of limitless
            exploration with Aora
          </Text>

          <CustomButton
            title="Continue with Email"
            handlePress={() => router.push('/sign-in')}
            containerStyles="w-full mt-7"
          />
        </View>
      </ScrollView>

      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  )
}
