import { useState, useEffect } from 'react'
import Head from 'next/head'

let viewCount = 0
let visitorCount = 0
const VISITOR_KEY = 'blog_visitor_id'

interface Config {
  siteName: string
  logo: string
  backgroundImage: string
  backgroundConfig?: {
    position: string
    size: string
    repeat: string
    blurEffect: boolean
    blurStrength: number
  }
  author: {
    name: string
    avatar: string
    bio: string
  }
  navigation: Array<{
    name: string
    url: string
  }>
}

export default function Home() {
  const [config, setConfig] = useState<Config | null>(null)
  const [views, setViews] = useState(0)
  const [visitors, setVisitors] = useState(0)

  useEffect(() => {
    // 浏览量统计
    viewCount++
    setViews(viewCount)
    
    // 访客统计
    let visitorId = localStorage.getItem(VISITOR_KEY)
    if (!visitorId) {
      visitorId = Math.random().toString(36).substring(2) + Date.now().toString(36)
      localStorage.setItem(VISITOR_KEY, visitorId)
      visitorCount++
    }
    setVisitors(visitorCount)
    const loadConfigAndBackground = async () => {
      try {
        const configResponse = await fetch('/api/config')
        if (!configResponse.ok) {
          throw new Error('Failed to load config')
        }
        const configData = await configResponse.json()
        
        // 如果没有设置背景图片，获取Bing壁纸
        if (!configData.backgroundImage) {
          const bingResponse = await fetch('/api/bing-wallpaper')
          if (bingResponse.ok) {
            const bingData = await bingResponse.json()
            configData.backgroundImage = bingData.url
          }
        }
        
        setConfig(configData)
      } catch (error) {
        console.error('Config load error:', error)
        // 使用默认配置作为后备
        setConfig({
          siteName: '我的博客',
          logo: '/logo.png',
          backgroundImage: '',
          backgroundConfig: {
            position: 'center',
            size: 'cover',
            repeat: 'no-repeat',
            blurEffect: false,
            blurStrength: 5
          },
          author: {
            name: '博客作者',
            avatar: '/avatar.jpg',
            bio: '这是我的个人博客，分享技术文章和生活感悟'
          },
          navigation: [
            {name: '首页', url: '/'},
            {name: 'GitHub', url: 'https://github.com'},
            {name: '知乎', url: 'https://zhihu.com'},
            {name: '微博', url: 'https://weibo.com'}
          ]
        })
      }
    }
    
    loadConfigAndBackground()
  }, [])

  if (!config) {
    return <div className="loading">加载中...</div>
  }

  return (
    <>
      <Head>
        <title>{config.siteName}</title>
        <meta name="description" content={config.author.bio} />
      </Head>

      <div 
        className="container" 
        style={{ 
          backgroundImage: config.backgroundImage ? `url(${config.backgroundImage})` : 'none',
          backgroundSize: config.backgroundConfig?.size || 'cover',
          backgroundPosition: config.backgroundConfig?.position || 'center',
          backgroundRepeat: config.backgroundConfig?.repeat || 'no-repeat',
          minHeight: '100vh',
          position: 'relative'
        }}
      >
        {config.backgroundConfig?.blurEffect && (
          <div 
            className="background-blur"
            style={{
              backdropFilter: `blur(${config.backgroundConfig?.blurStrength || 5}px)`,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: -1
            }}
          />
        )}

        <nav className="navbar">
          <div className="nav-brand">
            <img src={config.logo} alt="Logo" className="logo" />
            <span className="site-name">{config.siteName}</span>
          </div>
          <div className="nav-links">
            {config.navigation.map((item, index) => (
              <a 
                key={index} 
                href={item.url} 
                className="nav-link"
                target={item.url.startsWith('http') ? '_blank' : '_self'}
                rel={item.url.startsWith('http') ? 'noopener noreferrer' : ''}
              >
                {item.name}
              </a>
            ))}
          </div>
        </nav>

        <main className="main-content">
          <div className="author-card">
            <img 
              src={config.author.avatar} 
              alt={config.author.name} 
              className="author-avatar"
            />
            <h1 className="author-name">{config.author.name}</h1>
            <p className="author-bio">{config.author.bio}</p>
          </div>
        </main>
      </div>

      <footer className="footer">
        总浏览量: {views} | 访客数: {visitors}
      </footer>

      <style jsx>{`
        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          font-size: 1.5rem;
        }

        .container {
          padding: 20px;
        }

        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 10px;
          margin-bottom: 2rem;
          backdrop-filter: blur(10px);
        }

        .nav-brand {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .logo {
          width: 40px;
          height: 40px;
          border-radius: 8px;
        }

        .site-name {
          font-size: 1.5rem;
          font-weight: bold;
          color: #333;
        }

        .nav-links {
          display: flex;
          gap: 2rem;
        }

        .nav-link {
          color: #666;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s;
        }

        .nav-link:hover {
          color: #0070f3;
        }

        .main-content {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 70vh;
        }

        .author-card {
          background: rgba(255, 255, 255, 0.95);
          padding: 3rem;
          border-radius: 20px;
          text-align: center;
          backdrop-filter: blur(10px);
          max-width: 500px;
          width: 100%;
        }

        .author-avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          margin-bottom: 1.5rem;
          object-fit: cover;
        }

        .author-name {
          font-size: 2rem;
          margin-bottom: 1rem;
          color: #333;
        }

        .author-bio {
          font-size: 1.1rem;
          color: #666;
          line-height: 1.6;
        }

        .footer {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          text-align: center;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          font-size: 0.9rem;
          color: #666;
        }
      `}</style>
    </>
  )
}