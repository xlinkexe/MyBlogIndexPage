import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

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

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [config, setConfig] = useState<Config | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth')
        if (response.ok) {
          setIsAuthenticated(true)
          loadConfig()
        }
      } catch (error) {
        console.error('Auth check failed:', error)
      }
    }
    checkAuth()
  }, [])

  const loadConfig = async () => {
    try {
      const response = await fetch('/api/config')
      if (response.ok) {
        const configData = await response.json()
        setConfig(configData)
      }
    } catch (error) {
      console.error('Config load failed:', error)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      
      if (response.ok) {
        setIsAuthenticated(true)
        loadConfig()
      } else {
        alert('登录失败')
      }
    } catch (error) {
      console.error('Login failed:', error)
      alert('登录失败')
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth', { method: 'DELETE' })
      setIsAuthenticated(false)
      setConfig(null)
      router.push('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/save-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })
      
      if (response.ok) {
        alert('配置保存成功')
      } else {
        alert('配置保存失败')
      }
    } catch (error) {
      console.error('Save failed:', error)
      alert('配置保存失败')
    }
  }

  const handleNavItemChange = (index: number, field: string, value: string) => {
    if (!config) return
    const newNav = [...config.navigation]
    newNav[index] = { ...newNav[index], [field]: value }
    setConfig({ ...config, navigation: newNav })
  }

  const handleAddNavItem = () => {
    if (!config) return
    const newNav = [...config.navigation, { name: '新链接', url: 'https://' }]
    setConfig({ ...config, navigation: newNav })
  }

  const handleRemoveNavItem = (index: number) => {
    if (!config) return
    const newNav = config.navigation.filter((_, i) => i !== index)
    setConfig({ ...config, navigation: newNav })
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
              placeholder="留空则使用Bing每日壁纸"
            />
          </div>
        </div>

        <div className="form-section">
          <h3>背景图片设置</h3>
          <div className="form-group">
            <label>背景位置:</label>
            <select
              value={config.backgroundConfig?.position || 'center'}
              onChange={(e) => setConfig({
                ...config,
                backgroundConfig: {
                  position: e.target.value,
                  size: config.backgroundConfig?.size || 'cover',
                  repeat: config.backgroundConfig?.repeat || 'no-repeat',
                  blurEffect: config.backgroundConfig?.blurEffect || false,
                  blurStrength: config.backgroundConfig?.blurStrength || 5
                }
              })}
            >
              <option value="left">左对齐</option>
              <option value="center">居中</option>
              <option value="right">右对齐</option>
              <option value="top">顶部</option>
              <option value="bottom">底部</option>
            </select>
          </div>
          <div className="form-group">
            <label>背景大小:</label>
            <select
              value={config.backgroundConfig?.size || 'cover'}
              onChange={(e) => setConfig({
                ...config,
                backgroundConfig: {
                  position: config.backgroundConfig?.position || 'center',
                  size: e.target.value,
                  repeat: config.backgroundConfig?.repeat || 'no-repeat',
                  blurEffect: config.backgroundConfig?.blurEffect || false,
                  blurStrength: config.backgroundConfig?.blurStrength || 5
                }
              })}
            >
              <option value="cover">覆盖</option>
              <option value="contain">包含</option>
              <option value="auto">自动</option>
            </select>
          </div>
          <div className="form-group">
            <label>背景重复:</label>
            <select
              value={config.backgroundConfig?.repeat || 'no-repeat'}
              onChange={(e) => setConfig({
                ...config,
                backgroundConfig: {
                  position: config.backgroundConfig?.position || 'center',
                  size: config.backgroundConfig?.size || 'cover',
                  repeat: e.target.value,
                  blurEffect: config.backgroundConfig?.blurEffect || false,
                  blurStrength: config.backgroundConfig?.blurStrength || 5
                }
              })}
            >
              <option value="no-repeat">不重复</option>
              <option value="repeat">重复</option>
              <option value="repeat-x">水平重复</option>
              <option value="repeat-y">垂直重复</option>
            </select>
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={config.backgroundConfig?.blurEffect || false}
                onChange={(e) => setConfig({
                  ...config,
                  backgroundConfig: {
                    position: config.backgroundConfig?.position || 'center',
                    size: config.backgroundConfig?.size || 'cover',
                    repeat: config.backgroundConfig?.repeat || 'no-repeat',
                    blurEffect: e.target.checked,
                    blurStrength: config.backgroundConfig?.blurStrength || 5
                  }
                })}
              />
              启用背景模糊效果
            </label>
          </div>
          {config.backgroundConfig?.blurEffect && (
            <div className="form-group">
              <label>模糊强度:</label>
              <input
                type="range"
                min="0"
                max="20"
                value={config.backgroundConfig?.blurStrength || 5}
                onChange={(e) => setConfig({
                  ...config,
                  backgroundConfig: {
                    position: config.backgroundConfig?.position || 'center',
                    size: config.backgroundConfig?.size || 'cover',
                    repeat: config.backgroundConfig?.repeat || 'no-repeat',
                    blurEffect: config.backgroundConfig?.blurEffect || false,
                    blurStrength: parseInt(e.target.value)
                  }
                })}
              />
              <span>{config.backgroundConfig?.blurStrength || 5}px</span>
            </div>
          )}
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
              <div className="nav-item-header">
                <span>导航项 #{index + 1}</span>
                <button 
                  type="button" 
                  className="remove-btn"
                  onClick={() => handleRemoveNavItem(index)}
                >
                  删除
                </button>
              </div>
              <div className="nav-item-form">
                <div className="form-group">
                  <label>名称:</label>
                  <input
                    value={item.name}
                    onChange={(e) => handleNavItemChange(index, 'name', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>链接:</label>
                  <input
                    value={item.url}
                    onChange={(e) => handleNavItemChange(index, 'url', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
          <button 
            type="button" 
            className="add-btn"
            onClick={handleAddNavItem}
          >
            + 添加导航项
          </button>
        </div>

        <button type="submit" className="save-btn">保存配置</button>
      </form>

      <style jsx>{`
        .dashboard-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #eee;
        }

        .logout-btn {
          padding: 0.5rem 1rem;
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .logout-btn:hover {
          background: #c82333;
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

        .form-section:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        input, select, textarea {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }

        textarea {
          resize: vertical;
        }

        .nav-item {
          background: #f8f9fa;
          padding: 1rem;
          border-radius: 4px;
          margin-bottom: 1rem;
        }

        .nav-item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .remove-btn {
          padding: 0.25rem 0.5rem;
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 3px;
          cursor: pointer;
          font-size: 0.8rem;
        }

        .remove-btn:hover {
          background: #c82333;
        }

        .nav-item-form {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .add-btn {
          padding: 0.75rem 1rem;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
        }

        .add-btn:hover {
          background: #218838;
        }

        .save-btn {
          padding: 1rem 2rem;
          background: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1.1rem;
          width: 100%;
        }

        .save-btn:hover {
          background: #0056b3;
        }
      `}</style>
    </div>
  )
}