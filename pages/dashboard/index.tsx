import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

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

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [config, setConfig] = useState<Config | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = localStorage.getItem('isAuthenticated')
    if (checkAuth === 'true') {
      setIsAuthenticated(true)
      loadConfig()
    }
  }, [])

  const loadConfig = () => {
    fetch('/config.json')
      .then(res => res.json())
      .then(setConfig)
      .catch(console.error)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })
      
      if (response.ok) {
        setIsAuthenticated(true)
        localStorage.setItem('isAuthenticated', 'true')
      } else {
        alert('用户名或密码错误')
      }
    } catch (error) {
      console.error('登录错误:', error)
      alert('登录失败，请重试')
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!config) return
    
    try {
      const response = await fetch('/api/save-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      })
      
      if (response.ok) {
        alert('配置保存成功')
      } else {
        alert('保存失败')
      }
    } catch (error) {
      console.error('保存配置错误:', error)
      alert('保存失败')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('isAuthenticated')
    setUsername('')
    setPassword('')
  }

  if (!isAuthenticated) {
    return (
      <div className="login-container">
        <form onSubmit={handleLogin} className="login-form">
          <h2>管理员登录</h2>
          <div className="form-group">
            <label>用户名:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>密码:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">登录</button>
        </form>

        <style jsx>{`
          .login-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: #f5f5f5;
          }

          .login-form {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            width: 300px;
          }

          .form-group {
            margin-bottom: 1rem;
          }

          label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
          }

          input {
            width: 100%;
            padding: 0.5rem;
            border: 1px solid #ddd;
            border-radius: 4px;
          }

          button {
            width: 100%;
            padding: 0.75rem;
            background: #0070f3;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }

          button:hover {
            background: #0056b3;
          }
        `}</style>
      </div>
    )
  }

  if (!config) {
    return <div>加载中...</div>
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>网站配置管理</h1>
        <button onClick={handleLogout} className="logout-btn">退出登录</button>
      </header>

      <form onSubmit={handleSave} className="config-form">
        <div className="form-section">
          <h3>网站基本信息</h3>
          <div className="form-group">
            <label>网站名称:</label>
            <input
              value={config.siteName}
              onChange={(e) => setConfig({...config, siteName: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Logo URL:</label>
            <input
              value={config.logo}
              onChange={(e) => setConfig({...config, logo: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>背景图片 URL:</label>
            <input
              value={config.backgroundImage}
              onChange={(e) => setConfig({...config, backgroundImage: e.target.value})}
            />
          </div>
        </div>

        <div className="form-section">
          <h3>作者信息</h3>
          <div className="form-group">
            <label>作者名称:</label>
            <input
              value={config.author.name}
              onChange={(e) => setConfig({
                ...config, 
                author: {...config.author, name: e.target.value}
              })}
            />
          </div>
          <div className="form-group">
            <label>头像 URL:</label>
            <input
              value={config.author.avatar}
              onChange={(e) => setConfig({
                ...config, 
                author: {...config.author, avatar: e.target.value}
              })}
            />
          </div>
          <div className="form-group">
            <label>简介:</label>
            <textarea
              value={config.author.bio}
              onChange={(e) => setConfig({
                ...config, 
                author: {...config.author, bio: e.target.value}
              })}
              rows={3}
            />
          </div>
        </div>

        <div className="form-section">
          <h3>导航菜单</h3>
          {config.navigation.map((item, index) => (
            <div key={index} className="nav-item">
              <div className="form-group">
                <label>名称:</label>
                <input
                  value={item.name}
                  onChange={(e) => {
                    const newNav = [...config.navigation]
                    newNav[index].name = e.target.value
                    setConfig({...config, navigation: newNav})
                  }}
                />
              </div>
              <div className="form-group">
                <label>URL:</label>
                <input
                  value={item.url}
                  onChange={(e) => {
                    const newNav = [...config.navigation]
                    newNav[index].url = e.target.value
                    setConfig({...config, navigation: newNav})
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <button type="submit" className="save-btn">保存配置</button>
      </form>

      <style jsx>{`
        .dashboard-container {
          padding: 2rem;
          max-width: 800px;
          margin: 0 auto;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .logout-btn {
          padding: 0.5rem 1rem;
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .config-form {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .form-section {
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #eee;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        input, textarea {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .nav-item {
          background: #f8f9fa;
          padding: 1rem;
          margin-bottom: 1rem;
          border-radius: 4px;
        }

        .save-btn {
          padding: 1rem 2rem;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1.1rem;
        }

        .save-btn:hover {
          background: #218838;
        }
      `}</style>
    </div>
  )
}