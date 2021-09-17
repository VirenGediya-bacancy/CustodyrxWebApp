import React, { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone';

function DragAndDrop(props) {

  const [file, setFile] = useState()
  const [image, setImage] = useState()
  const onDrop = useCallback((acceptedFiles) => {

    acceptedFiles.forEach((file) => {
      const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
        const binaryStr = reader.result.replace('data:', '').replace(/^.+,/, '');
        setFile(binaryStr);
      }
      reader.readAsDataURL(file);
      //   reader.readAsArrayBuffer(file);
    })

    // const url = acceptedFiles[0]
    setImage(acceptedFiles[0])
  
  }, [])

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  useEffect(() => 
    props.imageUpload(file, image)
  )
  return (
    <div className='drag-file'>
      <div className='drag'>
        <div {...getRootProps()}>
          <input {...getInputProps()}
          />
          <i className="far fa-hand-pointer"></i>
          <span className='drag-text'>
            <span>Drag image here</span>
            <span> Or </span>
            <a href='#'><span>Browse for image</span></a>
          </span>
        </div>
      </div>
      <div className="card-image">
        {/* {file && <img src={`data:image/jpeg;base64,${file}`} />}
        {props.image && <img src={props.image} />} */}

        {file ? 
          <img src={`data:image/jpeg;base64,${file}`} /> 
          : props.image && <img src={props.image} />}
      </div>
    </div>

  )
}

export default DragAndDrop;