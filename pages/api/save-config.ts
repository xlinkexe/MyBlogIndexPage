import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const configData = req.body
    
    // 保存配置到文件
    const configPath = path.join(process.cwd(), 'config.json')
    fs.writeFileSync(configPath, JSON.stringify(configData, null, 2))
    
    console.log('Config saved to file:', configPath)
    
    res.status(200).json({ 
      message: 'Config saved successfully',
      data: configData 
    })
  } catch (error) {
    console.error('Save config error:', error)
    res.status(500).json({ message: 'Failed to save config' })
  }
}