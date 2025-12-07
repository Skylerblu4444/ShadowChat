import Header from '../components/Header'
export default function Home() {
  return (
    <div>
      <Header />
      <main style={{padding:'2rem',maxWidth:900,margin:'0 auto'}}>
        <h1>ShadowChat — Secure Messaging</h1>
        <p>Demo scaffold by Innovative Information Technology Resolutions LLC.</p>
      </main>
    </div>
  )
}
