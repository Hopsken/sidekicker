import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { useState, useEffect } from 'react'
import { Editor } from '@monaco-editor/react'
import { getLanguageFromFile } from '~/utils/editor'

export const loader = async () => {
  return json({
    message: 'Welcome to Config File Editor',
  })
}

export default function Index() {
  const { message } = useLoaderData<typeof loader>()
  const [files, setFiles] = useState<string[]>([])
  const [selectedFile, setSelectedFile] = useState('')
  const [fileContent, setFileContent] = useState('')
  const [error, setError] = useState('')
  const [language, setLanguage] = useState('plaintext')

  useEffect(() => {
    loadFiles()
  }, [])

  const loadFiles = async () => {
    try {
      const response = await fetch('/api/files')
      const data = await response.json()

      if (data.error) {
        setError(data.error)
        return
      }

      setFiles(data.files)
      setError('')
    } catch (err) {
      setError('Failed to load files')
    }
  }

  const handleFileSelect = async (file: string) => {
    setSelectedFile(file)
    setLanguage(getLanguageFromFile(file))
    try {
      const response = await fetch(
        `/api/files?path=${encodeURIComponent(file)}`
      )
      const data = await response.json()

      if (data.error) {
        setError(data.error)
        return
      }

      setFileContent(data.content)
      setError('')
    } catch (err) {
      setError('Failed to read file')
    }
  }

  const handleFileSave = async () => {
    if (!selectedFile || !fileContent) {
      setError('Please select a file and enter content')
      return
    }

    try {
      const formData = new FormData()
      formData.append('path', selectedFile)
      formData.append('content', fileContent)

      const response = await fetch('/api/files', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.error) {
        setError(data.error)
        return
      }

      setError('')
      loadFiles() // Refresh the file list
    } catch (err) {
      setError('Failed to save file')
    }
  }

  const handleEditorChange = (value: string | undefined) => {
    if (value) {
      setFileContent(value)
    }
  }

  return (
    <div className='min-h-screen bg-gray-100 p-8'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl font-bold mb-8'>{message}</h1>

        <div className='bg-white rounded-lg shadow p-6 mb-6'>
          <h2 className='text-xl font-semibold mb-4'>Files</h2>
          <div className='grid grid-cols-4 gap-2'>
            {files.map(file => (
              <button
                key={file}
                onClick={() => handleFileSelect(file)}
                className={`p-2 text-left rounded ${
                  selectedFile === file
                    ? 'bg-blue-100 text-blue-800'
                    : 'hover:bg-gray-100'
                }`}
              >
                {file}
              </button>
            ))}
          </div>
          {error && <div className='text-red-500 text-sm mt-2'>{error}</div>}
        </div>

        <div className='bg-white rounded-lg shadow p-6'>
          <div className='h-[500px] border rounded overflow-hidden'>
            <Editor
              height='100%'
              language={language}
              value={fileContent}
              onChange={handleEditorChange}
              theme='vs-light'
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
                automaticLayout: true,
              }}
            />
          </div>
          <div className='mt-4 flex justify-end'>
            <button
              onClick={handleFileSave}
              className='px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600'
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
