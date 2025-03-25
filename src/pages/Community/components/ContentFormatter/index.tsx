import styled from 'styled-components'

interface ContentFormatterProps {
  content: string
  className?: string
}

const Container = styled.div`
  word-break: break-word;

  .hashtag {
    color: #ef4444;
    cursor: pointer;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`

/**
 * Formats content with hashtags highlighted and HTML rendered safely
 */
const ContentFormatter = ({ content, className }: ContentFormatterProps) => {
  if (!content) return null

  // If content contains HTML, render it safely
  if (content.includes('<')) {
    return <Container className={className} dangerouslySetInnerHTML={{ __html: content }} />
  }

  // Otherwise, handle hashtags
  const parts = content.split(/(#[a-zA-Z0-9_]+)/g)

  return (
    <Container className={className}>
      {parts.map((part, index) => {
        if (part.startsWith('#')) {
          return (
            <span key={index} className='hashtag'>
              {part}
            </span>
          )
        }
        return part
      })}
    </Container>
  )
}

export default ContentFormatter
