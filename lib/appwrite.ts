import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from 'react-native-appwrite'
import { AuthForm } from '../app/(auth)/sign-up'

export const appwriteConfig = {
  endpoint: 'https://cloud.appwrite.io/v1',
  platform: 'com.slicycode.aora',
  projectId: '66221f051f6f8985aa9a',
  databaseId: '66221fd36364e3c13e06',
  userCollectionId: '66221fece39830466205',
  videoCollectionId: '66221ffd8c6b58ae2c0c',
  storageId: '662220c085bad3b59938',
}

const client = new Client()

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform)

const account = new Account(client)
const storage = new Storage(client)
const avatars = new Avatars(client)
const databases = new Databases(client)

export async function createUser({ email, password, username }: AuthForm) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    )

    if (!newAccount) throw Error

    const avatarUrl = avatars.getInitials(username)

    await signIn({ email, password })

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      }
    )

    return newUser
  } catch (error: any) {
    throw new Error(error)
  }
}

export async function signIn({ email, password }: Partial<AuthForm>) {
  try {
    const session = await account.createEmailSession(email, password)

    return session
  } catch (error: any) {
    throw new Error(error)
  }
}

export async function getAccount() {
  try {
    const currentAccount = await account.get()

    return currentAccount
  } catch (error: any) {
    throw new Error(error)
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount()
    if (!currentAccount) throw Error

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    )

    if (!currentUser) throw Error

    return currentUser.documents[0]
  } catch (error) {
    return null
  }
}

export async function signOut() {
  try {
    const session = await account.deleteSession('current')

    return session
  } catch (error: any) {
    throw new Error(error)
  }
}

export async function getFilePreview({
  fileId,
  type,
}: {
  fileId: string
  type: 'image' | 'video'
}) {
  let fileUrl

  try {
    if (type === 'video') {
      fileUrl = storage.getFileView(appwriteConfig.storageId, fileId)
    } else if (type === 'image') {
      fileUrl = storage.getFilePreview(
        appwriteConfig.storageId,
        fileId,
        2000,
        2000,
        'top',
        100
      )
    } else {
      throw new Error('Invalid file type')
    }

    if (!fileUrl) throw Error

    return fileUrl
  } catch (error: any) {
    throw new Error(error)
  }
}

export async function uploadFile({
  file,
  type,
}: {
  file: any
  type: 'image' | 'video'
}) {
  if (!file) return

  const { mimeType, ...rest } = file
  const asset = { type: mimeType, ...rest }

  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      asset
    )

    const fileUrl = await getFilePreview({
      fileId: uploadedFile.$id,
      type,
    })
    return fileUrl
  } catch (error: any) {
    throw new Error(error)
  }
}

export async function getUserPosts(userId: string) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.equal('creator', userId)]
    )

    return posts.documents
  } catch (error: any) {
    throw new Error(error)
  }
}

export async function createVideoPost(form: {
  title: string
  thumbnail: any
  video: any
  prompt: string
  userId: string
}) {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile({
        ...form.thumbnail,
        type: 'image',
      }),
      uploadFile({
        ...form.video,
        type: 'video',
      }),
    ])

    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId,
      }
    )

    return newPost
  } catch (error: any) {
    throw new Error(error)
  }
}

export async function getAllPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId
    )

    return posts.documents
  } catch (error: any) {
    throw new Error(error)
  }
}

export async function searchPosts(query: string) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.search('title', query)]
    )

    if (!posts) throw new Error('Something went wrong')

    return posts.documents
  } catch (error: any) {
    throw new Error(error)
  }
}

export async function getLatestPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.orderDesc('$createdAt'), Query.limit(7)]
    )

    return posts.documents
  } catch (error: any) {
    throw new Error(error)
  }
}
