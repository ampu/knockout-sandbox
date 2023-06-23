import './style.scss'

const newItem = ({title}) => {
  return {
    isItem: true,
    title,
  }
}

const newCategory = ({title, items, opened}) => {
  return {
    isCategory: true,
    title,
    items: ko.observableArray(items ?? []),
    opened: ko.observable(opened ?? false),
  }
}

const docsViewModel = {
  toggleOpen(category) {
    category.opened(!category.opened())
  },
  isOpenedCategory(category) {
    return docsViewModel.draggingCategory() !== category && category.opened()
  },
  setDraggingCategory(category) {
    docsViewModel.draggingCategory(category)
    document.addEventListener(`mouseup`, docsViewModel.clearDraggingCategory)
  },
  clearDraggingCategory() {
    docsViewModel.draggingCategory(null)
    document.removeEventListener(`mouseup`, docsViewModel.clearDraggingCategory)
  },
  beforeMoveCategory(arg) {
    const item = arg.item
    if (item.isCategory) {
      return
    }
    arg.cancelDrop = true

    setTimeout(() => {
      const sourceCategory = docsViewModel.categories().find((category) => category.items().includes(item))
      const targetCategory = docsViewModel.categories()[arg.targetIndex - 1] ?? docsViewModel.categories()[arg.targetIndex]

      sourceCategory.items.remove(item)
      if (sourceCategory.items().length === 0) {
        sourceCategory.opened(false)
      }

      if (arg.targetIndex === 0) {
        targetCategory.items.unshift(item)
      } else {
        targetCategory.items.push(item)
      }
      targetCategory.opened(true)
    })
  },
  draggingCategory: ko.observable(null),
  categories: ko.observableArray([
    newCategory({
      title: `Обязательные для всех`,
      items: [
        newItem({title: `Паспорт`}),
        newItem({title: `ИНН`}),
      ],
      opened: true,
    }),
    newCategory({
      title: `Обязательные для трудоустройства`,
      items: [
        newItem({title: `Трудовой договор`}),
      ],
    }),
    newCategory({
      title: `Специальные`,
    }),
  ]),
}

ko.applyBindings(docsViewModel)
