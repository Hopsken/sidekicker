import { json } from '@remix-run/node'
import { readFile, writeFile, readdir } from 'fs/promises'
import { join } from 'path'

const FILES_DIR = process.env.FILES_DIR || '/tmp'

export const loader = async ({ request }: { request: Request }) => {
  const url = new URL(request.url)
  const filePath = url.searchParams.get('path')

  if (!filePath) {
    try {
      const files = await readdir(FILES_DIR)
      return json({ files })
    } catch (error) {
      return json({ error: 'Failed to list files' }, { status: 500 })
    }
  }

  try {
    const fullPath = join(FILES_DIR, filePath)
    const content = await readFile(fullPath, 'utf-8')
    return json({ content })
  } catch (error) {
    return json({ error: 'Failed to read file' }, { status: 500 })
  }
}

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData()
  const filePath = formData.get('path') as string
  const content = formData.get('content') as string

  if (!filePath || !content) {
    return json(
      { error: 'File path and content are required' },
      { status: 400 }
    )
  }

  try {
    const fullPath = join(FILES_DIR, filePath)
    await writeFile(fullPath, content, 'utf-8')
    return json({ success: true })
  } catch (error) {
    return json({ error: 'Failed to write file' }, { status: 500 })
  }
}
