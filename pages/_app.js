import '../styles/globals.css'
import 'semantic-ui-css/semantic.min.css'
import Layout from '../components/layout'
import FactoryContextProvider from '../context/factory.context'
import Head from 'next/head'

function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>CrowdCoin</title>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/ico" sizes="16x16" href="/favicon.ico" />
        <link rel="manifest" href="/site.webmanifest"/>
      </Head>
      <FactoryContextProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </FactoryContextProvider>
    </>
  )
}

export default App
