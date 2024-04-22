import { View, Text } from 'react-native'

const InfoBox = ({
  title,
  subtitle,
  containerStyles,
  titleStyles,
}: {
  title: string
  subtitle?: string
  containerStyles?: string
  titleStyles: string
}) => {
  return (
    <View className={containerStyles}>
      <Text className={`text-white text-center font-psemibold ${titleStyles}`}>
        {title}
      </Text>
      <Text className="text-sm text-center text-gray-100 font-pregular">
        {subtitle}
      </Text>
    </View>
  )
}

export default InfoBox
