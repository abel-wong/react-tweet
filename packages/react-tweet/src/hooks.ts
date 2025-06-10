'use client'

import { useEffect, useState } from 'react'
import swr from 'swr'
import {
  SimpleUserInfo,
  type Tweet,
  TwitterApiError,
  UserInfo,
} from './api/index.js'

// Avoids an error when used in the pages directory where useSWR might be in `default`.
const useSWR = ((swr as any).default as typeof swr) || swr
const host = 'https://react-tweet.vercel.app'

async function fetcher([url, fetchOptions]: [
  string,
  RequestInit
]): Promise<Tweet | null> {
  const res = await fetch(url, fetchOptions)
  const json = await res.json()

  // We return null in case `json.data` is undefined, that way we can check for "loading" by
  // checking if data is `undefined`. `null` means it was fetched.
  if (res.ok) return json.data || null

  throw new TwitterApiError({
    message: `Failed to fetch tweet at "${url}" with "${res.status}".`,
    data: json,
    status: res.status,
  })
}
async function userInfoFetcher(url: string): Promise<SimpleUserInfo> {
  const res = await fetch(url)
  const json = await res.json()
  return {
    created_at: json.profileInfo.created_at,
    followers_count: json.profileInfo.followers_count,
    screen_name: json.profileInfo.screen_name,
  }
}

/**
 * SWR hook for fetching a tweet in the browser.
 */
export const useTweet = (
  id?: string,
  apiUrl?: string,
  fetchOptions?: RequestInit
) => {
  const { isLoading, data, error } = useSWR(
    () =>
      apiUrl || id
        ? [apiUrl || (id && `${host}/api/tweet/${id}`), fetchOptions]
        : null,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  )

  return {
    // If data is `undefined` then it might be the first render where SWR hasn't started doing
    // any work, so we set `isLoading` to `true`.
    isLoading: Boolean(isLoading || (data === undefined && !error)),
    data,
    error,
  }
}
export const useUserInfo = (username: string) => {
  const { data, error, isLoading } = useSWR<SimpleUserInfo>(
    username
      ? `https://debot.ai/api/v1/nitter/userInfo/query?username=${username}`
      : null,
    userInfoFetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  )
  return { data, error, isLoading }
}

export const useMounted = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  return mounted
}
