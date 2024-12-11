import React from 'react'

function WhiteCard({ className, p20, children }) {
  return (
    <div className={`${className} ${p20 ? 'md:p-5 p-4' : 'p-4'} rounded-lg shadow-cardShadow bg-white`}>{children}</div>
  )
}

export default WhiteCard
