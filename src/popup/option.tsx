import React, { useState } from 'react'
import { useEffect } from 'react'
import { Button } from 'antd'
import { getStorageWordArr, removeStorageWord } from '../utils/setting'

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
    <div className='p-4 text-lg'>
      {
        wordArr.map((item, index) => {
          return <div key={index}>
            <span className='mr-10'>{item.context}</span>
              <Button onClick={()=>{handleRemove(item.word)}} size='small'>remove1</Button>
              <Button onClick={()=>{location.href = `https://fanyi.baidu.com/?aldtype=16047#zh/en/${item.context}`}} size='small' type='link'>baidu fanyi</Button>
            </div>
        })
      }
    </div>
  )
}

export default App
