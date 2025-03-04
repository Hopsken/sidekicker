export const getLanguageFromFile = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'json':
      return 'json'
    case 'yaml':
    case 'yml':
      return 'yaml'
    case 'toml':
      return 'toml'
    case 'js':
    case 'jsx':
      return 'javascript'
    case 'ts':
    case 'tsx':
      return 'typescript'
    case 'md':
      return 'markdown'
    case 'css':
      return 'css'
    case 'html':
      return 'html'
    case 'sh':
    case 'bash':
      return 'shell'
    default:
      return 'plaintext'
  }
}
