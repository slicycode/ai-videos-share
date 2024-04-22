import { Link, router } from 'expo-router'
import { useState } from 'react'
import { Alert, Image, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '../../components/CustomButton'
import FormField from '../../components/FormField'
import { images } from '../../constants'
import { useGlobalContext } from '../../context/GlobalProvider'
import { createUser } from '../../lib/appwrite'

export interface AuthForm {
  username: string
  email: string
  password: string
}

const SignUp = () => {
  const { setUser, setIsLogged } = useGlobalContext()

  const [isSubmitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  })

  const submit = async () => {
    if (form.username === '' || form.email === '' || form.password === '') {
      Alert.alert('Error', 'Please fill in all fields')
    }

    setSubmitting(true)
    try {
      const result = await createUser({
        username: form.username,
        email: form.email,
        password: form.password,
      })
      setUser(result)
      setIsLogged(true)

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
            Sign up to Aora
          </Text>

          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(e: string) => setForm({ ...form, username: e })}
            otherStyles="mt-7"
          />
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
            title="Sign up"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Already have an account?
            </Text>
            <Link
              href="/sign-in"
              className="text-lg font-psemibold text-secondary"
            >
              Sign in
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp
