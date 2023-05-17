import React from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/index.css'
import 'antd/dist/reset.css';
import Content from './option'
function Option() {
  return (
    <Content></Content>
  )
}

// mount React component to DOM
document.body.innerHTML = '<div id="app"></div>'
createRoot(document.getElementById('app') as HTMLElement).render(<Option />)
