export function ValidateEmail(mail) {
  return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
}

export const mergeUniqueTaskList = (list1, list2) => {
  const mergedList = [...Object.keys(list1).map(key => list1[key]), ...Object.keys(list2).map(key => list2[key])]
  const taskMap = {}
  mergedList.forEach(task => {
    if (taskMap[task.id] === undefined) {
      taskMap[task.id] = task
    } else {
      const duplicatedTask = taskMap[task.id]
      if(task.lastModified >= duplicatedTask.lastModified) taskMap[task.id] = task
    }
  })
  return taskMap
}
