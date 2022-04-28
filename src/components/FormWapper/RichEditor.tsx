import { Input, message } from "antd"
import BraftEditor, { BraftEditorProps, ControlType, EditorState } from "braft-editor"
import classNames from "classnames"
import { useEffect, useMemo, useRef, useState } from "react"
import css from './index.module.less'
import 'braft-editor/dist/index.css'
import { AwsUploader } from "../../utils/upload"
import { PictureOutlined, CodeOutlined } from '@ant-design/icons'
const { ContentUtils } = require('braft-utils')

export interface IRichEditorProps extends BraftEditorProps {
  value?: string
  onChange?: (v: string | undefined) => void
  placeholder?: string
  className?: string
}

export function RichEditor({
  value,
  onChange,
  placeholder,
  className,
  ...rest
}: IRichEditorProps) {
  const [ val, setVal ] = useState(BraftEditor.createEditorState(value, {
    fontSize: 16
  }))
  const [ codeInsertionValue, setCodeInsertionValue ] = useState('')
  const uploadIpt = useRef<HTMLInputElement>(null)
  const controls = useMemo<ControlType[]>(() => [
    'undo', 'redo', 'separator',
    'font-size', 'line-height', 'separator',
    'text-color', 'bold', 'italic', 'underline', 'strike-through', 'separator',
    'superscript', 'subscript', 'remove-styles', 'separator',
    'headings', 'list-ul', 'list-ol', 'blockquote', 'code', 'separator',
    'link', 'separator', 'hr', 'separator',
    'clear', 'fullscreen'
  ], [])
  const extendControls: any[] = [
    {
      key: 'antd-uploader',
      type: 'button',
      text: <PictureOutlined />,
      title: 'Insert image',
      onClick() {
        uploadIpt.current?.click()
      }
    }, {
      key: 'iframe-insertion',
      type: 'modal',
      text: <CodeOutlined />,
      title: 'Insert video',
      modal: {
        id: 'braft-editor-code-insertion',
        title: 'Insert video',
        width: 600,
        className: css.richCodeInsertion,
        children: (
          <Input
            value={codeInsertionValue}
            onChange={(evt) => setCodeInsertionValue(evt.target.value)}
          />
        ),
        confirmable: true,
        closeOnConfirm: true,
        closeOnCancel: true,
        onConfirm: () => {
          setCodeInsertionValue((html) => {
            setVal((val: any) => {
              return ContentUtils.insertMedias(val, [{
                type: 'IFRAME',
                url: html
              }])
            })
            return ''
          })
        }
      }
    }
  ]

  useEffect(() => {
    if(value !== val?.toHTML()) {
      setVal(BraftEditor.createEditorState(value, {
        fontSize: 16
      }))
    }
  }, [value])

  return (
    <>
      <BraftEditor
        {...rest}
        value={val}
        onChange={(v: EditorState) => {
          setVal(v)
          onChange && onChange(v?.toHTML())
        }}
        extendControls={extendControls}
        controls={controls}
        className={classNames(css.richEditor, className)}
        placeholder={placeholder}
        language="en"
      />

      <input
        type="file"
        ref={uploadIpt}
        className={css.richUploadIpt}
        accept="image/*"
        onChange={(evt) => {
          const files = evt.target.files;
          if(files && files.length > 0) {
            const image = files[0]
            AwsUploader.upload(image)
              .then((res) => {
                if(res) {
                  setVal(ContentUtils.insertMedias(val, [{
                    type: 'IMAGE',
                    url: res
                  }]))
                }
              })
              .catch((err) => {
                message.error(err.message)
              })
          }
        }}
      />
    </>
  )
}