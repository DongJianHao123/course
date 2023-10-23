import React, { useState } from 'react'

// import './index-mobile.scss'
// import './index.scss'

interface IPane {
  key: string
  title: string
  content: React.ReactNode
}
interface ITabsProps {
  items: IPane[]
}

const Tabs = (props: ITabsProps) => {
  const { items } = props
  const [activeTab, setActiveTab] = useState<string>(items[0].key)
  const handleTabClick = (key: string) => {
    setActiveTab(key)
  }
  return (
    <div className="tabs">
      <div className="tab-nav-list">
        {items.map(({ title, key }) => (
          <div
            key={key}
            className={`tabs-tab ${key === activeTab ? 'tabs-tab-active' : ''}`}
            onClick={() => handleTabClick(key)}
          >
            {title}
          </div>
        ))}
      </div>
      <div className="tabs-content-list">
        {items.map(({ key, content }) => (
          <div
            key={key}
            className={`tabs-content-item ${key === activeTab ? '' : 'tabs-content-item-hidden'}`}
          >
            {content}
          </div>
        ))}
      </div>
    </div>
  )
}
export default Tabs
