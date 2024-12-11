import { ErrorMessage } from 'formik'

import { useEffect, useRef, useState } from 'react'
import { SlPlus } from 'react-icons/sl'
import { TbFile, TbTrash } from 'react-icons/tb'

const FileInput = ({
  parentClass,
  setValue,
  isImage = true,
  name,
  isMulti = false,
  value,
  label,
  acceptTypes,
  isCompulsory = false,
  onFileUpload,
}) => {
  const inputRef = useRef(null)

  return (
    <>
      <div className={`relative ${parentClass ? parentClass : ''}`}>
        <div className='inner relative'>
          {label && <label className='block mb-10px text-sm/18px text-left font-semibold'>{label}</label>}

          <input
            type='file'
            ref={inputRef}
            id='inputFile'
            accept={acceptTypes}
            onChange={(event) => {
              if (isMulti === false && event.target.files && event.target.files[0]) {
                setValue(name, event.target.files[0])
                onFileUpload?.(event.target.files[0])
              }
            }}
            hidden
          />
          <label
            htmlFor='inputFile'
            className={`flex flex-col items-center justify-center w-full bg-white border border-dashed border-black/30 rounded-md cursor-pointer active:scale-95 min-h-[120px] p-2 transition-all duration-300`}
          >
            {value && (
              <div
                className={`${
                  isImage ? ' grid gap-3 grid-cols-[repeat(auto-fill,_minmax(56px,_1fr))]' : ' max-w-[300px]'
                }`}
              >
                <FileList value={value} name={name} setValue={setValue} ref={inputRef} isImage={isImage} />
              </div>
            )}
            {!value && (
              <>
                <span className='block text-base/5 font-semibold pointer-events-none h-fit text-center'>
                  Select file
                </span>
                <span className='block text-sm/4 text-black/50 mt-2 font-medium pointer-events-none h-fit text-center'>
                  {isImage ? 'Drop images here to upload' : 'Drop files here to upload'}
                </span>
              </>
            )}
          </label>
        </div>

        <ErrorMessage name={name}>
          {(msg) => <div className='text-site-red text-sm font-medium'>{msg}</div>}
        </ErrorMessage>
      </div>
    </>
  )
}

export const FileList = ({ value, name, setValue, ref, isImage }) => {
  const [source, setSource] = useState()

  const removeFile = () => {
    if (ref?.current) ref.current.value = ''
    setValue(name, null)
  }

  useEffect(() => {
    if (typeof value === 'string') {
      setSource(value)
    } else {
      if (value) {
        setSource(window?.URL?.createObjectURL(value))
      } else {
        setSource('')
      }
    }
  }, [value])
  return (
    <div>
      {isImage ? (
        <img src={source} className='rounded-md  object-contain' width={'100'} height={'100'} alt='' />
      ) : (
        <>
          <div className='flex w-full bg-black/10 p-1 items-center border-b border-solid border-black/05 last:border-none rounded-lg'>
            <div className='relative w-12 h-12 bg-white rounded-md'>
              <TbFile className='w-full h-full p-2 text-black/70' />
            </div>
            <p className='text-sm/5 font-semibold max-w-[calc(100%_-_100px)] w-full mx-auto truncate'>
              {typeof value !== 'string' ? value.name : value.split('/')[value.split('/').length - 1] ?? 'file'}
            </p>
            <span
              onClick={() => removeFile()}
              className='icon mx-auto select-none inline-block w-5 h-5 bg-red hover:bg-tomatoRed text-white p-1.5 rounded-full cursor-pointer'
            >
              <TbTrash className='w-full h-full' />
            </span>
          </div>
        </>
      )}
      {isImage && (
        <span
          className='icon absolute top-[50px] right-[70px] select-none inline-block w-4 h-4 bg-red hover:bg-tomatoRed text-white p-1 rounded-full cursor-pointer'
          onClick={() => removeFile()}
        >
          <TbTrash className='text-dark-grey hover:text-site-red' />
        </span>
      )}
    </div>
  )
}

export default FileInput
