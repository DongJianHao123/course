
interface IProps {
  text: string
  highlight: string
}

const HighlightText = ({ text, highlight }: IProps) => {
  if (!highlight) {
    return <>{text}</>
  }
  // Split on highlight term and include term into parts, ignore case
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'))
  return (
    <span>
      {parts.map((part, i) => (
        <span key={i} className={part.toLowerCase() === highlight.toLowerCase() ? 'highlight' : ''}>
          {part}
        </span>
      ))}
    </span>
  )
}

export default HighlightText
