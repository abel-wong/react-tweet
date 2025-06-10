# @abel-wong/react-tweet

@abel-wong/react-tweet allows you to embed tweets in your React application when using Next.js, Create React App, Vite, and more.

## Installation

```bash
npm install @abel-wong/react-tweet
```

## Usage

```jsx
import { Tweet } from '@abel-wong/react-tweet'

function App() {
  return <Tweet id="1234567890" />
}
```

````

### 4. **确保已登录正确的 npm 账户**
```bash
# 检查当前用户
npm whoami

# 如果不是 abel-wong，重新登录
npm logout
npm login
````

### 5. **重新构建和发布**

```bash
# 清理并重新构建
pnpm clean
pnpm build

# 发布包
cd packages/react-tweet
npm publish
```

## 关键点

1. **包名一致性**：确保所有地方都使用 `@abel-wong/react-tweet`
2. **版本号**：重置为 `1.0.0`
3. **仓库地址**：更新为你的 GitHub 仓库
4. **作者信息**：更新为你的信息
5. **npm 账户**：确保登录的是 `abel-wong` 账户

修改完这些后，应该就能成功发布了。
