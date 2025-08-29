import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const configPath = path.join(process.cwd(), 'config.json')
    const configData = fs.readFileSync(configPath, 'utf8')
    const config = JSON.parse(configData)
    
    res.status(200).json(config)
  } catch (error) {
    console.error('Error reading config:', error)
    
    // 返回默认配置
    res.status(200).json({
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
  }
}