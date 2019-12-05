import { Modal, Button } from 'antd'

export function info(title, content) {
  Modal.info({
    title,
    content,
    onOk() {},
  })
}

export function success(title, content) {
  Modal.success({
    title,
    content,
  })
}

export function error(title, content) {
  Modal.error({
    title,
    content,
  })
}
