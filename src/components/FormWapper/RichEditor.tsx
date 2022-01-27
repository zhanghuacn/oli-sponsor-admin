import { Button, message, Upload } from "antd"
import { RcFile } from "antd/lib/upload"
import BraftEditor, { BraftEditorProps, ControlType, EditorState } from "braft-editor"
import classNames from "classnames"
import React, { useEffect, useMemo, useRef, useState } from "react"
import css from './index.module.less'
import 'braft-editor/dist/index.css'
import { AwsUploader } from "../../utils/upload"
import { PictureOutlined } from '@ant-design/icons'

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
      type: 'component',
      component: (
        <button
          className={classNames(css.upload, 'control-item', 'button')}
          onClick={() => {
            uploadIpt.current?.click()
          }}
        >
          <input
            type="file"
            ref={uploadIpt}
            accept="image/*"
            onChange={(evt) => {
              const files = evt.target.files;
              if(files && files.length > 0) {
                const image = files[0]
                AwsUploader.upload(image)
                  .then((res) => {
                    if(res) {
                      const { ContentUtils } = require('braft-utils')
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
          <PictureOutlined />
        </button>
      )
    }
  ]

  return (
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
  )
}