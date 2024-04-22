export interface AuthForm {
  username: string
  email: string
  password: string
}

export interface Post {
  $id: string
  title: string
  thumbnail: string
  video: string
  creator: {
    username: string
    avatar: string
  }
}
