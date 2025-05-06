import React from 'react'

function Text(props) {
  return (
    <div className='mx-3 leading-tight' >
        <p className='text-white text-xs'>{props.CText}</p>
        <p className='font-medium text-white text-s tracking-tighter'>{props.HText}</p>
    </div>
  )
}

export default Text