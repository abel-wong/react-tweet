import { Suspense } from 'react'
import { getTweet, SimpleUserInfo } from './api/index.js'
import {
  EmbeddedTweet,
  TweetNotFound,
  TweetSkeleton,
} from './twitter-theme/components.js'
import type { TweetProps } from './swr.js'

// This is not ideal because we don't use the `apiUrl` prop here and `id` is required. But as the
// type is shared with the SWR version when the Tweet component is imported, we need to have a type
// that supports both versions of the component.
export type { TweetProps }

type TweetContentProps = Omit<TweetProps, 'fallback'>

// 添加用户信息获取函数
async function getUserInfo(
  username: string
): Promise<SimpleUserInfo | undefined> {
  try {
    const res = await fetch(
      `https://debot.ai/api/v1/nitter/userInfo/query?username=${username}`
    )
    const json = await res.json()
    return {
      created_at: json.profileInfo.created_at,
      followers_count: json.profileInfo.followers_count,
      screen_name: json.profileInfo.screen_name,
    }
  } catch (error) {
    console.error('Failed to fetch user info:', error)
    return undefined
  }
}

const TweetContent = async ({
  id,
  components,
  fetchOptions,
  onError,
}: TweetContentProps) => {
  let error
  const tweet = id
    ? await getTweet(id, fetchOptions).catch((err) => {
        if (onError) {
          error = onError(err)
        } else {
          console.error(err)
          error = err
        }
      })
    : undefined

  if (!tweet) {
    const NotFound = components?.TweetNotFound || TweetNotFound
    return <NotFound error={error} />
  }
  const userInfo = tweet?.user?.screen_name
    ? await getUserInfo(tweet.user.screen_name)
    : undefined

  return (
    <EmbeddedTweet tweet={tweet} userInfo={userInfo} components={components} />
  )
}

export const Tweet = ({
  fallback = <TweetSkeleton />,
  ...props
}: TweetProps) => (
  <Suspense fallback={fallback}>
    {/* @ts-ignore: Async components are valid in the app directory */}
    <TweetContent {...props} />
  </Suspense>
)
