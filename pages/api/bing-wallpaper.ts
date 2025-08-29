import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch('https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN')
    const data = await response.json()
    
    if (data.images && data.images.length > 0) {
      const imageUrl = `https://www.bing.com${data.images[0].url}`
      res.status(200).json({ url: imageUrl })
    } else {
      res.status(200).json({ 
        url: 'https://www.bing.com/th?id=OHR.BlueButterfly_ZH-CN0011401687_1920x1080.jpg'
      })
    }
  } catch (error) {
    console.error('Bing wallpaper error:', error)
    res.status(200).json({ 
      url: 'https://www.bing.com/th?id=OHR.BlueButterfly_ZH-CN0011401687_1920x1080.jpg'
    })
  }
}