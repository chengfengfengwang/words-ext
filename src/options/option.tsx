import React, { useState } from 'react'
import { useEffect } from 'react'
import { Button } from 'antd'
import { getStorageWordArr, removeStorageWord } from '../utils/setting'

const highlight = (context, word) => {
  // Split on highlight term and include term into parts, ignore case
  const parts = context.split(new RegExp(`(${word})`, 'gi'));
  return <> { parts.map((part, i) => 
      <span key={i} className={part.toLowerCase() === word.toLowerCase() ? 'underline font-bold text-lg' : '' }>
          { part }
      </span>)
  } </>;
}
const App: React.FC = () => {
  const [wordArr, setWordArr] = useState<{word: string, context: string}[]>([])
  const getWordArr = async () => {
    const arr = await getStorageWordArr();        
    setWordArr(arr)
  }
  const handleRemove = async (word: string) => {
    await removeStorageWord(word)
  }
  useEffect(() => {
    getWordArr()
  }, [])
  useEffect(() => {
    chrome.storage.onChanged.addListener(function(changes, namespace) {
      getWordArr()
    });
  }, [])
  return (
    <div className='p-20 text-lg'>
      {
        wordArr.map((item, index) => {
          return <div className='flex items-center' key={index}>
            <div className='mr-10'>{highlight(item.context, item.word)}</div>
            <Button onClick={()=>{handleRemove(item.word)}} size='small'>remove</Button>
            <Button onClick={()=>{window.open(`https://fanyi.baidu.com/?aldtype=16047#zh/en/${item.context}`, 'fanyi')}} className='ml-2' size='small' danger type='primary'>baidu fanyi</Button>
            </div>
        })
      }
    </div>
  )
}

export default App
