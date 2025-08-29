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
    fetch('/api/config')
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to load config')
        }
        return res.json()
      })
      .then(setConfig)
      .catch(error => {
        console.error('Config load error:', error)
        // 使用默认配置作为后备
        setConfig({
          siteName: '我的博客',
          logo: '/logo.png',
          backgroundImage: '/background.jpg',
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
      })
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
                backgroundConfig: {...config.backgroundConfig, position: e.target.value}
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
                backgroundConfig: {...config.backgroundConfig, size: e.target.value}
              })}
            >
              <option value="cover">覆盖</option>
              <option value="contain">包含</option>
              <option value="auto">自动</option>
            </select>
          </div>
          <div className="form-group">
            <label>平铺方式:</label>
            <select
              value={config.backgroundConfig?.repeat || 'no-repeat'}
              onChange={(e) => setConfig({
                ...config, 
                backgroundConfig: {...config.backgroundConfig, repeat: e.target.value}
              })}
            >
              <option value="no-repeat">不平铺</option>
              <option value="repeat">平铺</option>
              <option value="repeat-x">横向平铺</option>
              <option value="repeat-y">纵向平铺</option>
            </select>
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={config.backgroundConfig?.blurEffect || false}
                onChange={(e) => setConfig({
                  ...config, 
                  backgroundConfig: {...config.backgroundConfig, blurEffect: e.target.checked}
                })}
              />
              启用毛玻璃效果
            </label>
          </div>
          {config.backgroundConfig?.blurEffect && (
            <div className="form-group">
              <label>模糊强度: {config.backgroundConfig?.blurStrength || 5}px</label>
              <input
                type="range"
                min="1"
                max="20"
                value={config.backgroundConfig?.blurStrength || 5}
                onChange={(e) => setConfig({
                  ...config, 
                  backgroundConfig: {...config.backgroundConfig, blurStrength: parseInt(e.target.value)}
                })}
              />
            </div>
          )}
        </div>

        <div className="form-section">
=======
>>>>>>> 2fcfa30f36494be9a432437c7fca25e2b110ebb8
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
<<<<<<< HEAD
              <div className="nav-item-header">
                <span>导航项 #{index + 1}</span>
                <button 
                  type="button" 
                  className="remove-btn"
                  onClick={() => {
                    const newNav = config.navigation.filter((_, i) => i !== index)
                    setConfig({...config, navigation: newNav})
                  }}
                >
                  删除
                </button>
              </div>
=======
>>>>>>> 2fcfa30f36494be9a432437c7fca25e2b110ebb8
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
<<<<<<< HEAD
          <button 
            type="button" 
            className="add-btn"
            onClick={() => {
              const newNav = [...config.navigation, {name: '新链接', url: 'https://'}]}
              setConfig({...config, navigation: newNav})
            }}
          >
            + 添加导航项
          </button>
=======
>>>>>>> 2fcfa30f36494be9a432437c7fca25e2b110ebb8
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
<<<<<<< HEAD
          border: 1px solid #dee2e6;
        }

        .nav-item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #dee2e6;
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

        .add-btn {
          padding: 0.5rem 1rem;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 1rem;
        }

        .add-btn:hover {
          background: #218838;
=======
>>>>>>> 2fcfa30f36494be9a432437c7fca25e2b110ebb8
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