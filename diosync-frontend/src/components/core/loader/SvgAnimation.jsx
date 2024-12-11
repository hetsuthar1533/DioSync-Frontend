// src/components/Loading.js
import React from 'react'
import LoaderGIF from '../../../assets/images/beer_anim_fast.gif' // Adjust the path as needed

const SvgAnimation = () => (
  <div className='bg-site-black flex items-center justify-center h-screen'>
    <img src={LoaderGIF} alt='Loading...' />
  </div>
)

export default SvgAnimation
