import * as React from 'react'
import  Link  from 'next/link'


const IndexPage: React.FunctionComponent = () => {
  return (
    <>
      <h1>Hello Next.js 👋</h1>
      <p ><Link href='/about'><a>About</a></Link></p>
    </>
  )
}

export default IndexPage;
