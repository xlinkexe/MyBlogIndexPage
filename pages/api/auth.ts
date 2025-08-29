import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { username, password } = req.body
  
  const adminUsername = process.env.ADMIN_USERNAME
  const adminPassword = process.env.ADMIN_PASSWORD
  
  if (username === adminUsername && password === adminPassword) {
    res.status(200).json({ success: true })
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' })
  }
}