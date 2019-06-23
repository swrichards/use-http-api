# use-http-api

> A React hook to easily manage HTTP API requests using Axios

[![NPM](https://img.shields.io/npm/v/use-http-api.svg)](https://www.npmjs.com/package/use-http-api) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save use-http-api
```

## Usage

```tsx
import * as React from 'react'

import { useMyHook } from 'use-http-api'

const Example = () => {
  const example = useMyHook()
  return (
    <div>
      {example}
    </div>
  )
}
```

## License

MIT © [swrichards](https://github.com/swrichards)

---

This hook is created using [create-react-hook](https://github.com/hermanya/create-react-hook).
