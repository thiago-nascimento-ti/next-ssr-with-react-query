import '../styles/globals.css'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Hydrate } from 'react-query/hydration'
import { useState } from 'react'

function MyApp({ Component, pageProps }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <Component {...pageProps} />    
      </Hydrate>
    </QueryClientProvider>
  )
}

export default MyApp
