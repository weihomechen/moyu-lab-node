const { Duplex } = require('stream')

export const streamToBuffer = (stream: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    const buffers: any[] = []

    stream.on('error', reject)
    stream.on('data', (data: any) => buffers.push(data))
    stream.on('end', () => resolve(Buffer.concat(buffers)))
  })
}

export const bufferToStream = buffer => {
  const stream = new Duplex()
  stream.push(buffer)
  stream.push(null)

  return stream
}

export const isEmail = (str: string): boolean => {
  return /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(str)
}

export const subObj = (keys: string[], parent: any): any => keys.reduce((a, b) => (parent.hasOwnProperty(b) && (a[b] = parent[b]), a), {})

function getSuffix(filename: string): string {
  const pos = filename.lastIndexOf('.')
  let suffix = ''

  if (pos !== -1) {
    suffix = filename.substring(pos)
  }
  return suffix
}

export const getUniqueFileName = (filename: string): string => {
  const suffix = getSuffix(filename)
  const len = 32
  const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  const maxPos = chars.length
  let pwd = ''
  for (let i = 0; i < len; i += 1) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return suffix ? `${pwd}${suffix}` : ''
}

export const passwordSecret = 'moyu_lab'
