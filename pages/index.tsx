import { useState, useEffect } from 'react'
import Head from 'next/head'

interface Config {
  siteName: string
  logo: string
  backgroundImage: string
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

  useEffect(() => {
    fetch('/config.json')
      .then(res => res.json())
      .then(setConfig)
      .catch(console.error)
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
          backgroundImage: `url(${config.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '100vh'
        }}
      >
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
      `}</style>
    </>
  )
}