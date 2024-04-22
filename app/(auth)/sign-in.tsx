import { Link, router } from 'expo-router'
import { useState } from 'react'
import { Alert, Image, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '../../components/CustomButton'
import FormField from '../../components/FormField'
import { images } from '../../constants'
import { useGlobalContext } from '../../context/GlobalProvider'
import { getCurrentUser, signIn } from '../../lib/appwrite'

const SignIn = () => {
  const { setUser, setIsLogged } = useGlobalContext()
  const [isSubmitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const submit = async () => {
    if (form.email === '' || form.password === '') {
      Alert.alert('Error', 'Please fill in all fields')
    }

    setSubmitting(true)

    try {
      await signIn({
        email: form.email,
        password: form.password,
      })
      const result = await getCurrentUser()
      setUser(result)
      setIsLogged(true)

      Alert.alert('Success', 'User signed in successfully')
      router.replace('/home')
    } catch (error: any) {
      Alert.alert('Error', error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[115px] h-[35px]"
          />
          <Text className="text-2xl text-white font-psemibold mt-10">
            Log in to Aora
          </Text>

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e: string) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e: string) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />

          <CustomButton
            title="Sign in"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Don't have an account?
            </Text>
            <Link
              href="/sign-up"
              className="text-lg font-psemibold text-secondary"
            >
              Sign up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn
