import { SimpleUserInfo } from '../api/index.js'
import { formatDate, formatDateOnly } from '../date-utils.js'
import { formatNumber } from '../utils.js'

import s from './tweet-user-info.module.css'

export const TweetUserInfo = ({ userInfo }: { userInfo?: SimpleUserInfo }) => {
  const createdAt =
    userInfo?.created_at && userInfo.created_at.trim() !== ''
      ? new Date(userInfo.created_at)
      : null

  const isValidDate = createdAt && !isNaN(createdAt.getTime())
  const formattedCreatedAtDate = isValidDate ? formatDateOnly(createdAt) : '-'
  const followersCount = (() => {
    if (!userInfo) return '-'
    if (typeof userInfo.followers_count !== 'number') return '-'
    if (userInfo.followers_count < 0) return '-'
    if (userInfo.followers_count === 0) return '0' // 如果确实是 0，显示 0
    return formatNumber(userInfo.followers_count)
  })()
  const hasScreenName =
    userInfo?.screen_name && userInfo.screen_name.trim() !== ''

  return (
    <div className={s.tweetUserInfo}>
      <a
        className={s.joined}
        href={
          hasScreenName ? `https://x.com/${userInfo.screen_name}` : undefined
        }
        target={hasScreenName ? '_blank' : undefined}
        rel={hasScreenName ? 'noopener noreferrer' : undefined}
        aria-label={``}
      >
        <div className={s.userInfoWrapper}>
          <svg viewBox="0 0 24 24" aria-hidden="true" className={s.joinedIcon}>
            <g>
              <path d="M7 4V3h2v1h6V3h2v1h1.5C19.89 4 21 5.12 21 6.5v12c0 1.38-1.11 2.5-2.5 2.5h-13C4.12 21 3 19.88 3 18.5v-12C3 5.12 4.12 4 5.5 4H7zm0 2H5.5c-.27 0-.5.22-.5.5v12c0 .28.23.5.5.5h13c.28 0 .5-.22.5-.5v-12c0-.28-.22-.5-.5-.5H17v1h-2V6H9v1H7V6zm0 6h2v-2H7v2zm0 4h2v-2H7v2zm4-4h2v-2h-2v2zm0 4h2v-2h-2v2zm4-4h2v-2h-2v2z"></path>
            </g>
          </svg>
        </div>
        <span
          className={s.joinedTime}
        >{`Joined ${formattedCreatedAtDate}`}</span>
      </a>
      <a
        className={s.followers}
        href={
          hasScreenName ? `https://x.com/${userInfo.screen_name}` : undefined
        }
        target={hasScreenName ? '_blank' : undefined}
        rel={hasScreenName ? 'noopener noreferrer' : undefined}
        aria-label={``}
      >
        <span className={s.followersCount}>{followersCount}</span>
        <span className={s.followersText}>Followers</span>
      </a>
    </div>
  )
}
