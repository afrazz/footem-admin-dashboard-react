import React, { useEffect, useRef, useState } from 'react'
import { Editor } from '@tinymce/tinymce-react'

export default function TextEditor({ initialValue, setValue, index }) {
  const editorRef = useRef(null)

  const [intialValueState, setIntialValueState] = useState()

  useEffect(() => {
    setIntialValueState(initialValue)
  }, [])

  return (
    <>
      <Editor
        onInit={(evt, editor) => (editorRef.current = editor)}
        onChange={(a, textEditor) => {
          setValue(textEditor.getContent(), index)
        }}
        initialValue={intialValueState}
        init={{
          height: 500,
          fontsize_formats: '8px 10px 12px 14px 16px 24px 36px',
          // menubar: false,
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount',
          ],
          toolbar:
            'undo redo | fontsizeselect | formatselect | ' +
            'bold italic backcolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
          content_style:
            'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        }}
      />
      {/* <button onClick={log}>Log editor content</button> */}
    </>
  )
}
