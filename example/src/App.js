import React from 'react'

import { useMyHook } from 'use-http-api'

const App = () => {
  const example = useMyHook()
  return (
    <div>
      {example}
    </div>
  )
}
export default App
