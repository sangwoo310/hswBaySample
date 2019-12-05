import { error, info, success } from '../../common/NFTModal'

export const handleEosErrorModal = result => {
  if (!result) {
    return
  }

  let response = null
  if (true === result) {
    success('Success', 'Success!')
    return
  } else if (typeof result === 'string') {
    try {
      response = JSON.parse(result)
    } catch (err) {
      response = result
    }
  } else {
    response = result
  }

  if (!response.code) {
    // error('Error', response)
    error('Error', 'Error')
    return
  } else if (response.code === 402) {
    error('Error', 'Cancelled')
    return
  } else if (response.code === 500) {
    error('Error', response.error.details[0].message.replace('assertion failure with message: ', ''))
    return
  } else {
    if (response.message && response.message === 'This transaction requires a keyProvider for signing') {
      info('Info', 'Please check your scatter.')
    }
    return
  }

  // if (response.error) {
  //   error('Error', response.error)
  // }
}
