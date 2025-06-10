export interface TweetUser {
  id_str: string
  name: string
  profile_image_url_https: string
  profile_image_shape: 'Circle' | 'Square' | 'Hexagon'
  screen_name: string
  verified: boolean
  verified_type?: 'Business' | 'Government'
  is_blue_verified: boolean
}
export interface UserInfo {
  code: number
  profileInfo: {
    screen_name: string
    uid: string
    name: string
    description: string
    avatar: string
    banner: string
    created_at: string
    location: string
    fast_followers_count: number
    normal_followers_count: number
    favourites_count: number
    followers_count: number
    friends_count: number
    listed_count: number
    media_count: number
    categories: any
  }
}
export interface SimpleUserInfo {
  created_at: string
  followers_count: number
  screen_name: string
}
