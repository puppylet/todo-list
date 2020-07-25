import Icon from '@material-ui/core/Icon'
import Button from '@material-ui/core/Button'

const icons = {
  'todo': 'assignment',
  'in-progress': 'autorenew',
  'done': 'assignment_turned_in',
  'deleted': 'delete',
  'canceled': 'cancel'
}
const colors = {
  'todo': 'grey',
  'in-progress': 'blue',
  'done': 'green',
  'deleted': 'red',
  'canceled': 'black'
}

const commandList = {
  'todo': ['start', 'delete'],
  'in-progress': ['done', 'cancel'],
  'done': ['delete'],
  'deleted': [],
  'canceled': ['delete']
}

const commandButtonColors = {
  start: 'primary',
  done: 'secondary'
}


const statusCommands = {
  start: 'in-progress',
  done: 'done',
  cancel: 'canceled',
  delete: 'deleted'
}

export default ({children, status, onChange}) => {

  const createCommandButton = command => () => <Button
    onClick={() => onChange && onChange(statusCommands[command])}
    type="button"
    color={commandButtonColors[command]}>
    {command}
  </Button>

  const enabledCommands = commandList[status]
  return (
    <>
      <li className="task-list__item">
        <Icon style={{color: colors[status], margin: 'auto 4px auto 0px'}}>{icons[status]}</Icon>
        <p className="title">{children}</p>
        <div className="btn-group">
          {enabledCommands.map((command, index) => {
            const CommandButton = createCommandButton(command)
            return <CommandButton key={index} />
          })}
        </div>
      </li>
      <style jsx>{
        `
        .task-list__item {
          padding: 4px 8px;
          margin: 2px 0px;
          display: flex;
          background: #fff;
        }
        .title {
          flex: 1;
          margin: auto 0;
        }
        .btn-group {
          display: flex;
        }
        `
      }</style>
    </>
  )
}
