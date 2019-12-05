import { observable, action } from 'mobx'

export default () =>
  observable(
    {
      selectedKey: '',
      onSelected(key) {
        this.selectedKey = key
      },
    },
    {
      onSelected: action,
    }
  )
