import React from 'react'

const github = new URL('assets/img/github.png', import.meta.url).href
const spotify = new URL('assets/img/spotify.png', import.meta.url).href
const twitter = new URL('assets/img/twitter.png', import.meta.url).href

const Interface = () => {
  return (
    <div className='absolute bottom-5 right-5'>
      <a title='Github' target='_tab' href='https://github.com/michealparks'>
        <img className='mb-2' width='30' height='30' alt='Github' src={github} />
      </a>
      <a title='Spotify' target='_tab' href='https://open.spotify.com/user/micheal_parks'>
        <img className='mb-2' width='30' height='30' alt='Spotify' src={spotify} />
      </a>
      <a title='Twitter' target='_tab' href='https://twitter.com/godisacomputer'>
        <img className='mb-2' width='30' height='30' alt='Twitter' src={twitter} />
      </a>
    </div>
  )
}

export default Interface
